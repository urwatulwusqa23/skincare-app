using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using ReviewService;
using Shared.Contracts;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddDbContext<ReviewDb>(opt =>
    opt.UseSqlite("Data Source=reviews.db"));

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<ReviewDueConsumer>();
    x.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMQ:Host"] ?? "localhost", "/", h =>
        {
            h.Username(builder.Configuration["RabbitMQ:User"] ?? "guest");
            h.Password(builder.Configuration["RabbitMQ:Pass"] ?? "guest");
        });
        cfg.ReceiveEndpoint("review-scheduler", e =>
        {
            e.ConfigureConsumer<ReviewDueConsumer>(ctx);
        });
    });
});

// Background job: checks for pending reviews every hour
builder.Services.AddHostedService<ReviewSchedulerWorker>();

var host = builder.Build();

using (var scope = host.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ReviewDb>();
    db.Database.EnsureCreated();
}

host.Run();
