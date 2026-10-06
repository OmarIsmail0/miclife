using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace micpanel.Models
{
    public class LOBTranslation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int LOBId { get; set; }

        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        // Navigation property
        [ForeignKey("LOBId")]
        public virtual LOB LOB { get; set; }
    }
}

