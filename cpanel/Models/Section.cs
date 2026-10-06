using System.ComponentModel.DataAnnotations;

namespace micpanel.Models
{
    public class Section
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string SectionKey { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual ICollection<SectionTranslation> SectionTranslations { get; set; } = new List<SectionTranslation>();
        
        // Many-to-many relationship with Block
        public virtual ICollection<SectionBlock> SectionBlocks { get; set; } = new List<SectionBlock>();
    }
}

