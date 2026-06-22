using MassTransit;
using Microsoft.EntityFrameworkCore;
using RoutineService;
using Shared.Contracts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

builder.Services.AddDbContext<RoutineDb>(opt =>
    opt.UseSqlite("Data Source=routines.db"));

builder.Services.AddMassTransit(x =>
{
    x.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMQ:Host"] ?? "localhost", "/", h =>
        {
            h.Username(builder.Configuration["RabbitMQ:User"] ?? "guest");
            h.Password(builder.Configuration["RabbitMQ:Pass"] ?? "guest");
        });
    });
});

var app = builder.Build();

app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();

// Ensure DB
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<RoutineDb>();
    db.Database.EnsureCreated();
}

// --- Routines ---
app.MapGet("/api/routines/{userId}", async (string userId, RoutineDb db) =>
{
    var items = await db.RoutineItems.Where(r => r.UserId == userId).ToListAsync();
    return Results.Ok(items);
});

app.MapPost("/api/routines", async (AddRoutineItemRequest req, RoutineDb db, IPublishEndpoint bus) =>
{
    var item = new RoutineItem
    {
        Id = Guid.NewGuid(),
        UserId = req.UserId,
        ProductName = req.ProductName,
        Category = req.Category,
        Slot = req.Slot,
        Ingredients = string.Join(",", req.Ingredients),
        AddedAt = DateTime.UtcNow,
    };
    db.RoutineItems.Add(item);
    await db.SaveChangesAsync();

    // Check if review should be scheduled (after 30 days)
    await bus.Publish(new ReviewDueEvent(
        Guid.NewGuid(), req.UserId, req.UserEmail, req.ProductName,
        item.AddedAt, item.AddedAt.AddDays(30)
    ));

    return Results.Created($"/api/routines/{item.Id}", item);
});

app.MapDelete("/api/routines/{id:guid}", async (Guid id, RoutineDb db) =>
{
    var item = await db.RoutineItems.FindAsync(id);
    if (item is null) return Results.NotFound();
    db.RoutineItems.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
