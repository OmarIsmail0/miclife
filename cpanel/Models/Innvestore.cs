using System.ComponentModel.DataAnnotations;

namespace micpanel.Models
{
    public class Innvestore
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        [Required]
        [MaxLength(200)]
        public string TitleAr { get; set; } = string.Empty;

        [MaxLength(500)]

        public string? UrlFrm { get; set; }
        [MaxLength(500)]
        public string? UrlFrmAr { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }
    }
}
