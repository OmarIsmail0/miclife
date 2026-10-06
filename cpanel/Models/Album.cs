using System.ComponentModel.DataAnnotations;
using micpanel.ModelDto.Enums;

namespace micpanel.Models
{
    public class Album
    {
        [Key]
        public int Id { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;
        public MediaType Type { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation property
        public virtual ICollection<AlbumTranslation> Translations { get; set; } = new List<AlbumTranslation>();
    }
}

