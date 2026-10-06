using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace micpanel.Models
{
    public class ProductTranslation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? FullDescription { get; set; }

        [MaxLength(200)]
        public string? SEO_Title { get; set; }

        [MaxLength(500)]
        public string? SEO_Description { get; set; }

        // Navigation property
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }
    }
}

