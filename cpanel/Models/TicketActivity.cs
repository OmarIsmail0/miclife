using micpanel.ModelDto.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace micpanel.Models
{
    public class TicketActivity
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int TicketId { get; set; }
        
        [ForeignKey(nameof(TicketId))]
        public Ticket Ticket { get; set; } = null!;
        
        public string? TicketComment { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
