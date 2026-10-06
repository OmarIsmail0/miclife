namespace micpanel.ModelDto.Enums
{
    public enum TicketStatus
    {
        Open = 1,          // Ticket is open and awaiting action
        InProgress = 2,    // Ticket is currently being worked on
        Closed = 3,        // Ticket has been resolved and closed
        OnHold = 4,        // Ticket is on hold for some reason
        Reopened = 5       // Ticket was closed but has been reopened for further action
    }
} 