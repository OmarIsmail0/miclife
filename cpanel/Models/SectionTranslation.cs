using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace micpanel.Models
{
    public class SectionTranslation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SectionId { get; set; }

        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? Content { get; set; }

        [MaxLength(200)]
        public string? SEO_Title { get; set; }

        [MaxLength(500)]
        public string? SEO_Description { get; set; }

        // Navigation property
        [ForeignKey("SectionId")]
        public virtual Section Section { get; set; }
    }
}

