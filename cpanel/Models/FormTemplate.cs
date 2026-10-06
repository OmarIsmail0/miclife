using System.ComponentModel.DataAnnotations;

namespace micpanel.Models
{
    public class FormTemplate
    {
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Design { get; set; }
        public string? Language { get; set; }
    }
}
