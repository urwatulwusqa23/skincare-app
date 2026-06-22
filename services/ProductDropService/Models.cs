using MassTransit;
using Microsoft.EntityFrameworkCore;
using Shared.Contracts;

namespace ProductDropService;

public class ProductDrop
{
    public Guid Id { get; set; }
    public string ProductName { get; set; } = "";
    public string Brand { get; set; } = "";
    public string Category { get; set; } = "";
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public string TargetSkinTypes { get; set; } = "";
    public string TargetConcerns { get; set; } = "";
    public int StockCount { get; set; }
    public int DiscountPercent { get; set; }
    public string Status { get; set; } = "live";
    public DateTime CreatedAt { get; set; }
    public DateTime? EndsAt { get; set; }
}

public class DropsDb(DbContextOptions<DropsDb> options) : DbContext(options)
{
    public DbSet<ProductDrop> Drops => Set<ProductDrop>();
}

public record CreateDropRequest(
    string ProductName,
    string Brand,
    string Category,
    decimal Price,
    decimal OriginalPrice,
    string[] TargetSkinTypes,
    string[] TargetConcerns,
    int StockCount,
    double DurationHours
);

// Listens to UserMatched events — logs them
public class MatchConsumer(ILogger<MatchConsumer> logger) : IConsumer<UserMatchedEvent>
{
    public Task Consume(ConsumeContext<UserMatchedEvent> context)
    {
        logger.LogInformation("Match confirmed: {User} → {Product}", context.Message.UserName, context.Message.ProductName);
        return Task.CompletedTask;
    }
}
