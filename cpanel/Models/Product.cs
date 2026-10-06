using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace micpanel.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int LOBId { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        // Navigation properties
        [ForeignKey("LOBId")]
        public virtual LOB LOB { get; set; }

        public virtual ICollection<ProductTranslation> ProductTranslations { get; set; } = new List<ProductTranslation>();
    }
}

