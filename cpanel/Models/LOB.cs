using System.ComponentModel.DataAnnotations;

namespace micpanel.Models
{
    public class LOB
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        [MaxLength(500)]
        public string? IconUrl { get; set; }
        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public bool IsActive { get; set; } = true;

        public int DisplayOrder { get; set; } = 0;

        // Navigation properties
        public virtual ICollection<LOBTranslation> LOBTranslations { get; set; } = new List<LOBTranslation>();
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}

