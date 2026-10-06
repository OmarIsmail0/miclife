using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class TokenRequestModel
    {
        [Required]
        public string? Email { get; set; }

        //[Required]
        public string? Password { get; set; }
        public string? Code { get; set; }
        public string? Token { get; set; }
    }
}
