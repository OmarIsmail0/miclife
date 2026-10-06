using micpanel.Helpers;
using micpanel.ModelDto;
using micpanel.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace micpanel.Repository
{
        public class AuthService : IAuthServices
        {
            private readonly UserManager<AuthUser> _userManager;
            private readonly IMailServices _mailservices;
            private readonly RoleManager<IdentityRole> _roleManager;
            private readonly Jwt _jwt;

            public AuthService(UserManager<AuthUser> userManager, RoleManager<IdentityRole> roleManager, IOptions<Jwt> jwt
            , SignInManager<AuthUser> signInManager, IMailServices mailservices)
            {
                _userManager = userManager;
                _roleManager = roleManager;
                _jwt = jwt.Value;
                _mailservices = mailservices;
            }
            public async Task<AuthModel> GetTokenAsync(TokenRequestModel model)
            {
                var authModel = new AuthModel();

                var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) {
                authModel.Message = "Email or Password is incorrect!";
                return authModel;
            }
            if (await _userManager.IsLockedOutAsync(user))
                {
                    authModel.Message = "Your account has been temporarily locked. Please try again in 1 minute";
                    return authModel;
                }
                if (user is null || !await _userManager.CheckPasswordAsync(user, model.Password))
                {
                    int remain = 0;
                    var countNum = await _userManager.AccessFailedAsync(user);
                    if (countNum.Succeeded)
                    {
                        remain = await _userManager.GetAccessFailedCountAsync(user);

                    }
                    authModel.Message = "Email or Password is incorrect!," + " remaminig login attemp : " + (remain == 0 ? "0" : (3 - remain).ToString());
                    return authModel;
                }
                var resetAttemp = await _userManager.ResetAccessFailedCountAsync(user);
                if (resetAttemp.Succeeded)
                {
                    var tk = TokenOptions.DefaultEmailProvider;
                    var token = await _userManager.GenerateTwoFactorTokenAsync(user, tk);
                    authModel.IsAuthenticated = true;
                    authModel.IsFactorAuth = true;

                    await _mailservices.SendOtpEmailAsync(model.Email, token);
                    authModel.Message = "Please verifiy your login from your email address !";
                    return authModel;
                }
                authModel.Message = "Faild to reset the login attemp ";
                return authModel;
            }
            public async Task<AuthModel> GetOtpTokenASync(string username, string cod)
            {
                var authModel = new AuthModel();

                var user = await _userManager.FindByEmailAsync(username);
                if (user is null)
                {
                    authModel.Message = "Email is incorrect!";
                    return authModel;
                }
                var signin = await _userManager.VerifyTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider, cod);
                if (signin)
                {
                    var jwtSecurityToken = await CreateJwtToken(user);
                    var rolesList = await _userManager.GetRolesAsync(user);
                    authModel.IsAuthenticated = true;
                    authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
                    authModel.Email = user.Email;
                    authModel.Username = user.UserName;
                    authModel.FullName = user.FullName;
                    authModel.ExpiresOn = jwtSecurityToken.ValidTo;
                    authModel.Roles = rolesList.ToList();
                }
                else
                {
                    authModel.Message = "Code is not correct !";
                }
                return authModel;
            }
            public async Task<AuthModel> RegisterAsync(RegisterModel model)
            {
                if (await _userManager.FindByEmailAsync(model.Email) is not null)
                    return new AuthModel { Message = "Email is already registered!" };

                if (await _userManager.FindByNameAsync(model.Username) is not null)
                    return new AuthModel { Message = "Username is already registered!" };

                var user = new AuthUser
                {
                    FullName = model.FullName,
                    UserName = model.Username,
                    Email = model.Email
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (!result.Succeeded)
                {
                    var errors = string.Empty;

                    foreach (var error in result.Errors)
                        errors += $"{error.Description},";

                    return new AuthModel { Message = errors };
                }
                await _userManager.SetTwoFactorEnabledAsync(user, true);
                await _userManager.AddToRoleAsync(user, "User");
                var tk = TokenOptions.DefaultEmailProvider;
                var token = await _userManager.GenerateTwoFactorTokenAsync(user, tk);
                await _mailservices.SendOtpEmailAsync(model.Email, token);
                return new AuthModel { IsAuthenticated = true, Message = "Please verifiy your login from your email address !" };
            }

            private async Task<JwtSecurityToken> CreateJwtToken(AuthUser user)
            {
                var userClaims = await _userManager.GetClaimsAsync(user);
                var roles = await _userManager.GetRolesAsync(user);
                var roleClaims = new List<Claim>();

                foreach (var role in roles)
                    roleClaims.Add(new Claim("roles", role));

                var claims = new[]
                {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("uid", user.Id),
                new Claim("fullname",user.FullName),

            }
                .Union(userClaims)
                .Union(roleClaims);

                var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
                var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

                var jwtSecurityToken = new JwtSecurityToken(
                    issuer: _jwt.Issuer,
                    audience: _jwt.Audience,
                    claims: claims,
                    expires: DateTime.Now.AddDays((double)_jwt.DurationInDays),
                    signingCredentials: signingCredentials);

                return jwtSecurityToken;
            }

            public async Task<string> CreateRole(CreateRoleModel model)
            {
                if (await _roleManager.RoleExistsAsync(model.Role))
                    return "Role already Exist";
                var result = await _roleManager.CreateAsync(new IdentityRole(model.Role));
                return result.Succeeded ? string.Empty : "Some thing went wrong !";
            }

            public async Task<IEnumerable<IdentityRole>> GetRoles()
            {
                return await _roleManager.Roles.ToListAsync();
            }

            public async Task<string> UnAssignUserFromRole(AddRoleModel model)
            {
                var user = await _userManager.FindByIdAsync(model.UserId);
                if (user is null || !await _roleManager.RoleExistsAsync(model.Role))
                    return "User or Role not found";
                if (!await _userManager.IsInRoleAsync(user, model.Role))
                    return "User already not assined to this role";
                var result = await _userManager.RemoveFromRoleAsync(user, model.Role);
                return result.Succeeded ? string.Empty : "Some thing went wrong !"; throw new NotImplementedException();
            }

            public async Task<string> AssignUserToRole(AddRoleModel model)
            {
                var user = await _userManager.FindByIdAsync(model.UserId);
                if (user is null || !await _roleManager.RoleExistsAsync(model.Role))
                    return "User or Role not found";
                if (await _userManager.IsInRoleAsync(user, model.Role))
                    return "User already assined to this role";
                var result = await _userManager.AddToRoleAsync(user, model.Role);
                return result.Succeeded ? string.Empty : "Some thing went wrong !";
            }
        }
}
