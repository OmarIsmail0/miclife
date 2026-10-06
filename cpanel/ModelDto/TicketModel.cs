using micpanel.ModelDto.Enums;
using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class TicketModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public bool IsForm { get; set; }
        public TicketType TicketType { get; set; }
        public TicketStatus TicketStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TicketActivityModel>? TicketActivities { get; set; }
    }

    public class TicketActivityModel
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public string? TicketComment { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateTicketModel
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string? Description { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address")]
        [MaxLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public string? Email { get; set; }
        public bool IsForm { get; set; }

        [MaxLength(20, ErrorMessage = "Phone cannot exceed 20 characters")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Ticket type is required")]
        public TicketType TicketType { get; set; }

        public TicketStatus TicketStatus { get; set; } = TicketStatus.Open;
    }

    public class UpdateTicketModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string? Description { get; set; }
        public bool IsForm { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address")]
        [MaxLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public string? Email { get; set; }

        [MaxLength(20, ErrorMessage = "Phone cannot exceed 20 characters")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Ticket type is required")]
        public TicketType TicketType { get; set; }

        [Required(ErrorMessage = "Ticket status is required")]
        public TicketStatus TicketStatus { get; set; }
    }

    public class TicketFilterModel
    {
        public TicketType? TicketType { get; set; }
        public TicketStatus? TicketStatus { get; set; }
        public string? Email { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class CreateTicketActivityModel
    {
        [Required(ErrorMessage = "Ticket ID is required")]
        public int TicketId { get; set; }

        [MaxLength(2000, ErrorMessage = "Comment cannot exceed 2000 characters")]
        public string? TicketComment { get; set; }
    }

    public class UpdateTicketActivityModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Ticket ID is required")]
        public int TicketId { get; set; }

        [MaxLength(2000, ErrorMessage = "Comment cannot exceed 2000 characters")]
        public string? TicketComment { get; set; }
    }
}
