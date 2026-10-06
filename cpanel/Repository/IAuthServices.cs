using micpanel.ModelDto;
using Microsoft.AspNetCore.Identity;

namespace micpanel.Repository
{
    public interface IAuthServices
    {
        Task<AuthModel> RegisterAsync(RegisterModel model);
        Task<AuthModel> GetTokenAsync(TokenRequestModel model);
        Task<AuthModel> GetOtpTokenASync(string username, string cod);
        Task<string> CreateRole(CreateRoleModel model);
        Task<IEnumerable<IdentityRole>> GetRoles();
        Task<string> UnAssignUserFromRole(AddRoleModel model);
        Task<string> AssignUserToRole(AddRoleModel model);
    }
}
