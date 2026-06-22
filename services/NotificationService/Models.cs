using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Shared.Contracts;

namespace NotificationService;

public class Alert
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = "";
    public string Type { get; set; } = ""; // drop | review | match
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AlertDb(DbContextOptions<AlertDb> options) : DbContext(options)
{
    public DbSet<Alert> Alerts => Set<Alert>();
}

// SignalR hub — pushes real-time alerts to browser
public class AlertHub : Hub
{
    public async Task JoinUser(string userId) =>
        await Groups.AddToGroupAsync(Context.ConnectionId, userId);
}

// Consumer: ProductDropped → finds matched users → sends UserMatched → stores alert
public class UserMatchedConsumer(AlertDb db, IHubContext<AlertHub> hub, ILogger<UserMatchedConsumer> logger)
    : IConsumer<UserMatchedEvent>
{
    public async Task Consume(ConsumeContext<UserMatchedEvent> ctx)
    {
        var msg = ctx.Message;
        logger.LogInformation("Sending drop alert to {User} for {Product}", msg.UserName, msg.ProductName);

        var alert = new Alert
        {
            Id = Guid.NewGuid(),
            UserId = msg.UserId,
            Type = "drop",
            Title = $"✨ {msg.ProductName} is perfect for you!",
            Body = $"Hey {msg.UserName}! {msg.ProductName} by {msg.Brand} matches your skin profile. It's ${msg.Price} right now.",
            CreatedAt = DateTime.UtcNow,
        };

        db.Alerts.Add(alert);
        await db.SaveChangesAsync();

        // Push via SignalR to any connected browser
        await hub.Clients.Group(msg.UserId).SendAsync("NewAlert", alert);
    }
}

// Consumer: ReviewDue → creates review reminder alert
public class ReviewDueConsumer(AlertDb db, IHubContext<AlertHub> hub, ILogger<ReviewDueConsumer> logger)
    : IConsumer<ReviewDueEvent>
{
    public async Task Consume(ConsumeContext<ReviewDueEvent> ctx)
    {
        var msg = ctx.Message;
        logger.LogInformation("Review reminder for {User}: {Product}", msg.UserId, msg.ProductName);

        var alert = new Alert
        {
            Id = Guid.NewGuid(),
            UserId = msg.UserId,
            Type = "review",
            Title = "Time to review! ⭐",
            Body = $"You've been using {msg.ProductName} for 30 days. How's your skin doing?",
            CreatedAt = DateTime.UtcNow,
        };

        db.Alerts.Add(alert);
        await db.SaveChangesAsync();

        await hub.Clients.Group(msg.UserId).SendAsync("NewAlert", alert);
    }
}
