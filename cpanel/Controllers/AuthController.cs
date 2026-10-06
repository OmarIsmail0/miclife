using micpanel.ModelDto;
using micpanel.Repository;
using micpanel.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace micpanel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices _authService;
        private readonly TokenBlacklistService _blacklistService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthServices authService, TokenBlacklistService blacklistService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _blacklistService = blacklistService;
            _logger = logger;
        }

        [HttpPost("register")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                if(model.Password is null || model.Password == "")
                {
                    return BadRequest(new {
                        Message = "Password cannot be empty"
                    });
                }
                var result = await _authService.RegisterAsync(model);

                if (!result.IsAuthenticated)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration");
                return StatusCode(500, new { Message = "An error occurred during registration. Please try again later." });
            }
        }

        [HttpPost("token")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> GetTokenAsync([FromBody] TokenRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (model.Password is null || model.Password == "")
            {
                return BadRequest(new
                {
                    Message = "Password cannot be empty"
                });
            }
            try
            {
                var result = await _authService.GetTokenAsync(model);

                if (!result.IsAuthenticated)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token generation");
                return StatusCode(500, new { Message = "An error occurred during authentication. Please try again later." });
            }
        }
        [HttpPost("verifiy2FA")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> verifiy2FA([FromBody] TokenRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var result = await _authService.GetOtpTokenASync(model.Email, model.Code);

                if (!result.IsAuthenticated)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during 2FA verification");
                return StatusCode(500, new { Message = "An error occurred during verification. Please try again later." });
            }
        }

        [Authorize,HttpPost("blacklist-token")]
        public async Task<IActionResult> BlacklistToken()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Blacklist the token for 24 hours
                var expiry = DateTime.UtcNow.AddDays(300);
                var authHeader = HttpContext.Request.Headers["Authorization"].ToString();
                if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                {
                    var token = authHeader.Substring("Bearer ".Length).Trim();
                    await _blacklistService.BlacklistTokenAsync(token, expiry);
                    return Ok(new { Message = "Token has been blacklisted" });
                }
                else
                {
                    return BadRequest(new { Message = "Authorization header is missing or invalid" });
                }
              
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token blacklisting");
                return StatusCode(500, new { Message = "An error occurred while blacklisting the token. Please try again later." });
            }
        }
        [Authorize(Roles = "admin"), HttpPost("AssignRole")]
        public async Task<IActionResult> AssignRole([FromBody] AddRoleModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.AssignUserToRole(model);

            if (!string.IsNullOrEmpty(result))
                return BadRequest(result);

            return Ok(result);
        }
        [Authorize(Roles = "admin"), HttpPost("UnAssignRole")]
        public async Task<IActionResult> UnAssignRole([FromBody] AddRoleModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _authService.UnAssignUserFromRole(model);

                if (!string.IsNullOrEmpty(result))
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during role unassignment");
                return StatusCode(500, new { Message = "An error occurred while unassigning the role. Please try again later." });
            }
        }

        [HttpGet("GetRoles")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                var result = await _authService.GetRoles();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving roles");
                return StatusCode(500, new { Message = "An error occurred while retrieving roles. Please try again later." });
            }
        }

        [HttpGet("GetUserId")]
        [Authorize(Roles = "admin")]
        public IActionResult GetUserId()
        {
            try
            {
                var userId = User.Claims?.FirstOrDefault(c => c.Type == "uid")?.Value;
                return Ok(new
                {
                    outData = userId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user ID");
                return StatusCode(500, new { Message = "An error occurred while retrieving user information. Please try again later." });
            }
        }
    }
}
