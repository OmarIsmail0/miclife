using System.ComponentModel.DataAnnotations;

namespace micpanel.Models
{
    public class ShareHolder
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? Title { get; set; }
        [Required]
        public string? Descrption { get; set; }
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public string? Share { get; set; } = string.Empty;

    }
}
