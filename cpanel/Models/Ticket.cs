using micpanel.ModelDto.Enums;
using System.ComponentModel.DataAnnotations;

namespace micpanel.Models
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsForm { get; set; } = false;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public TicketType TicketType { get; set; }
        public TicketStatus TicketStatus { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public ICollection<TicketActivity>? TicketActivities { get; set; }

    }
}
