using MassTransit;
using Microsoft.EntityFrameworkCore;
using Shared.Contracts;

namespace ReviewService;

public class PendingReview
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = "";
    public string UserEmail { get; set; } = "";
    public string ProductName { get; set; } = "";
    public DateTime AddedAt { get; set; }
    public DateTime DueAt { get; set; }
    public bool Fired { get; set; }
}

public class ReviewDb(DbContextOptions<ReviewDb> options) : DbContext(options)
{
    public DbSet<PendingReview> PendingReviews => Set<PendingReview>();
}

// Stores the review due event in our DB
public class ReviewDueConsumer(ReviewDb db, ILogger<ReviewDueConsumer> logger) : IConsumer<ReviewDueEvent>
{
    public async Task Consume(ConsumeContext<ReviewDueEvent> ctx)
    {
        var msg = ctx.Message;
        logger.LogInformation("Scheduled review for {User} — {Product} due {Due}", msg.UserId, msg.ProductName, msg.ReviewDueAt);

        db.PendingReviews.Add(new PendingReview
        {
            Id = msg.ReviewId,
            UserId = msg.UserId,
            UserEmail = msg.UserEmail,
            ProductName = msg.ProductName,
            AddedAt = msg.AddedToRoutineAt,
            DueAt = msg.ReviewDueAt,
        });
        await db.SaveChangesAsync();
    }
}

// Background worker: every hour, fires ReviewDueEvent for overdue reviews
public class ReviewSchedulerWorker(
    IServiceScopeFactory scopeFactory,
    IPublishEndpoint bus,
    ILogger<ReviewSchedulerWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            await using var scope = scopeFactory.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<ReviewDb>();

            var due = await db.PendingReviews
                .Where(r => !r.Fired && r.DueAt <= DateTime.UtcNow)
                .ToListAsync(ct);

            foreach (var review in due)
            {
                logger.LogInformation("Firing review reminder: {Product} for {User}", review.ProductName, review.UserId);
                await bus.Publish(new ReviewDueEvent(
                    review.Id, review.UserId, review.UserEmail,
                    review.ProductName, review.AddedAt, review.DueAt
                ), ct);
                review.Fired = true;
            }

            if (due.Count > 0) await db.SaveChangesAsync(ct);

            await Task.Delay(TimeSpan.FromHours(1), ct);
        }
    }
}
