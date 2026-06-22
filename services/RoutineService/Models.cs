using Microsoft.EntityFrameworkCore;

namespace RoutineService;

public class RoutineItem
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = "";
    public string ProductName { get; set; } = "";
    public string Category { get; set; } = "";
    public string Slot { get; set; } = "am"; // am | pm
    public string Ingredients { get; set; } = "";
    public DateTime AddedAt { get; set; }
}

public class RoutineDb(DbContextOptions<RoutineDb> options) : DbContext(options)
{
    public DbSet<RoutineItem> RoutineItems => Set<RoutineItem>();
}

public record AddRoutineItemRequest(
    string UserId,
    string UserEmail,
    string ProductName,
    string Category,
    string Slot,
    string[] Ingredients
);
