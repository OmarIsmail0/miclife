using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace micpanel.Models
{
    public class AlbumTranslation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int AlbumId { get; set; }

        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? Description { get; set; }

        // Navigation property
        [ForeignKey("AlbumId")]
        public virtual Album Album { get; set; }
    }
}

