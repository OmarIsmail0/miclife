using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace micpanel.Models
{
    public class SectionBlock
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SectionId { get; set; }

        [Required]
        public int BlockId { get; set; }

        public int DisplayOrder { get; set; } = 0; // Optional: to order blocks within a section

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("SectionId")]
        public virtual Section Section { get; set; }

        [ForeignKey("BlockId")]
        public virtual Block Block { get; set; }
    }
}

