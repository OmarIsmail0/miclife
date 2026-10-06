using Microsoft.AspNetCore.Identity;

namespace micpanel.Models
{
    public class AuthUser : IdentityUser
    {
        public string? FullName { get; set; }
    }
}
