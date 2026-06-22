using MassTransit;
using Microsoft.EntityFrameworkCore;
using NotificationService;
using Shared.Contracts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

builder.Services.AddSignalR();

builder.Services.AddDbContext<AlertDb>(opt =>
    opt.UseSqlite("Data Source=alerts.db"));

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<UserMatchedConsumer>();
    x.AddConsumer<ReviewDueConsumer>();
    x.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMQ:Host"] ?? "localhost", "/", h =>
        {
            h.Username(builder.Configuration["RabbitMQ:User"] ?? "guest");
            h.Password(builder.Configuration["RabbitMQ:Pass"] ?? "guest");
        });

        cfg.ReceiveEndpoint("notification-user-matched", e =>
        {
            e.ConfigureConsumer<UserMatchedConsumer>(ctx);
            e.UseMessageRetry(r => r.Exponential(3, TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(10), TimeSpan.FromSeconds(2)));
        });

        cfg.ReceiveEndpoint("notification-review-due", e =>
        {
            e.ConfigureConsumer<ReviewDueConsumer>(ctx);
        });
    });
});

var app = builder.Build();

app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();
app.MapHub<AlertHub>("/notificationHub");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AlertDb>();
    db.Database.EnsureCreated();
}

app.MapGet("/api/alerts/{userId}", async (string userId, AlertDb db) =>
    Results.Ok(await db.Alerts.Where(a => a.UserId == userId).OrderByDescending(a => a.CreatedAt).Take(50).ToListAsync()));

app.MapPut("/api/alerts/{userId}/read", async (string userId, AlertDb db) =>
{
    await db.Alerts.Where(a => a.UserId == userId && !a.IsRead)
        .ExecuteUpdateAsync(s => s.SetProperty(a => a.IsRead, true));
    return Results.NoContent();
});

app.Run();
