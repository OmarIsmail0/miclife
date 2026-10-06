using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class CreateRoleModel
    {
        [Required]
        public string Role { get; set; }
    }
}
