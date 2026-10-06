using System.ComponentModel.DataAnnotations;

namespace micpanel.Models
{
    public class Branch
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? Title { get; set; }
        public string? Descrption { get; set; }
    }
}
