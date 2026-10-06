using System.ComponentModel.DataAnnotations;

namespace micpanel.Models
{
    public class Block
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<BlockTranslation> BlockTranslations { get; set; } = new List<BlockTranslation>();
        
        // Many-to-many relationship with Section
        public virtual ICollection<SectionBlock> SectionBlocks { get; set; } = new List<SectionBlock>();
    }
}
