namespace micpanel.ModelDto.Enums
{
    public enum ActivityType
    {
        Created = 1,        // Ticket was created
        StatusChanged = 2,  // Ticket status was changed
        Updated = 3,        // Ticket details were updated
        CommentAdded = 4,   // Comment was added to ticket
        Assigned = 5,       // Ticket was assigned to someone
        Deleted = 6,        // Ticket was deleted (soft delete)
        Reopened = 7,       // Ticket was reopened
        Escalated = 8,      // Ticket was escalated
        Resolved = 9        // Ticket was resolved
    }
} 