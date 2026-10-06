using micpanel.ModelDto.Enums;
using System.ComponentModel.DataAnnotations;

namespace micpanel.Models
{
    public class Document
    {
        public int Id { get; set; }

        [Required]
        public string FileName { get; set; }

        [Required]
        public string FilePath { get; set; }

        public string? FileExtension { get; set; }

        public long FileSize { get; set; } // in bytes

        public string? MimeType { get; set; }

        public string? Description { get; set; }

        [Required]
        public EntityType EntityType { get; set; }

        public string? UploadedByName { get; set; } // User name for display

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public bool IsDeleted { get; set; } = false;

        public bool IsPublic { get; set; } = false; // For access control

        public string? Tags { get; set; } // Comma-separated tags for categorization
    }
}
