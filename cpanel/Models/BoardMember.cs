using System.ComponentModel.DataAnnotations;

namespace micpanel.Models
{
    public class BoardMember
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(200)]
        public string? Name { get; set; }
        [MaxLength(200)]
        public string? Title { get; set; }
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        [MaxLength(500)]
        public string? IconUrl { get; set; }
        [MaxLength(2000)]
        public string? Description { get; set; } = string.Empty;
    }
}
