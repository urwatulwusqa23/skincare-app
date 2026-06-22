namespace Shared.Contracts;

public record ProductDroppedEvent(
    Guid DropId,
    string ProductName,
    string Brand,
    string Category,
    decimal Price,
    decimal? OriginalPrice,
    string[] TargetSkinTypes,
    string[] TargetConcerns,
    DateTime DroppedAt
);

public record UserMatchedEvent(
    Guid MatchId,
    string UserId,
    string UserEmail,
    string UserName,
    string[] UserConcerns,
    Guid DropId,
    string ProductName,
    string Brand,
    decimal Price,
    DateTime MatchedAt
);

public record ReviewDueEvent(
    Guid ReviewId,
    string UserId,
    string UserEmail,
    string ProductName,
    DateTime AddedToRoutineAt,
    DateTime ReviewDueAt
);

public record IngredientConflictEvent(
    string UserId,
    string ProductA,
    string ProductB,
    string ConflictReason,
    string RoutineSlot
);
