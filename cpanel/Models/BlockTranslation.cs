using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace micpanel.Models
{
    public class BlockTranslation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BlockId { get; set; }

        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? Description { get; set; }

        [MaxLength(200)]
        public string? SEO_Title { get; set; }

        [MaxLength(500)]
        public string? SEO_Description { get; set; }

        // Navigation property
        [ForeignKey("BlockId")]
        public virtual Block Block { get; set; }
    }
}
