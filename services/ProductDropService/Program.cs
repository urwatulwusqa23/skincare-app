using MassTransit;
using Microsoft.EntityFrameworkCore;
using ProductDropService;
using Shared.Contracts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

builder.Services.AddDbContext<DropsDb>(opt =>
    opt.UseSqlite("Data Source=drops.db"));

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<MatchConsumer>();
    x.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMQ:Host"] ?? "localhost", "/", h =>
        {
            h.Username(builder.Configuration["RabbitMQ:User"] ?? "guest");
            h.Password(builder.Configuration["RabbitMQ:Pass"] ?? "guest");
        });
        cfg.ConfigureEndpoints(ctx);
    });
});

var app = builder.Build();

app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DropsDb>();
    db.Database.EnsureCreated();
}

// GET all drops
app.MapGet("/api/products/drops", async (DropsDb db) =>
    Results.Ok(await db.Drops.OrderByDescending(d => d.CreatedAt).ToListAsync()));

// POST a new drop — publishes event to RabbitMQ
app.MapPost("/api/products/drops", async (CreateDropRequest req, DropsDb db, IPublishEndpoint bus) =>
{
    var drop = new ProductDrop
    {
        Id = Guid.NewGuid(),
        ProductName = req.ProductName,
        Brand = req.Brand,
        Category = req.Category,
        Price = req.Price,
        OriginalPrice = req.OriginalPrice,
        TargetSkinTypes = string.Join(",", req.TargetSkinTypes),
        TargetConcerns = string.Join(",", req.TargetConcerns),
        StockCount = req.StockCount,
        DiscountPercent = req.OriginalPrice > 0
            ? (int)Math.Round((1 - req.Price / req.OriginalPrice) * 100)
            : 0,
        Status = "live",
        CreatedAt = DateTime.UtcNow,
        EndsAt = req.DurationHours > 0 ? DateTime.UtcNow.AddHours(req.DurationHours) : null,
    };

    db.Drops.Add(drop);
    await db.SaveChangesAsync();

    // Broadcast to RabbitMQ — MatchService will consume this
    await bus.Publish(new ProductDroppedEvent(
        drop.Id, drop.ProductName, drop.Brand, drop.Category,
        drop.Price, drop.OriginalPrice,
        req.TargetSkinTypes, req.TargetConcerns,
        drop.CreatedAt
    ));

    return Results.Created($"/api/products/drops/{drop.Id}", drop);
});

app.Run();
