namespace micpanel.ModelDto.Enums
{
    public enum TicketType
    {
        //None = 0,
        Claim = 1,         // Ticket related to a claim
        Inquiry = 2,       // General inquiry or question
        Complaint = 3,     // Customer complaint or issue
        Feedback = 4,      // Customer feedback or suggestion
        Support = 5,       // Technical support or assistance
        PolicyChange = 6,  // Request for policy change or update
        Renewal = 7,       // Ticket related to policy renewal
        Cancellation = 8,  // Request for policy cancellation
        Underwriting = 9,  // Ticket related to underwriting process
        Other = 10         // Any other type of ticket not covered above

    }
}
