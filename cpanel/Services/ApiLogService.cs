using micpanel.Context;
using micpanel.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;

namespace micpanel.Services
{
    public interface IApiLogService
    {
        Task LogRequest(HttpContext context, string requestBody, string responseBody, int statusCode, long duration);
    }

    public class ApiLogService : IApiLogService
    {
        private readonly CommerceDb _context;

        public ApiLogService(CommerceDb context)
        {
            _context = context;
        }

        public async Task LogRequest(HttpContext context, string requestBody, string responseBody, int statusCode, long duration)
        {
            var userId = context.User?.FindFirst("uid")?.Value;

            // Try multiple claim types for username
            var userName = context.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                ?? context.User?.FindFirst(ClaimTypes.Name)?.Value
                ?? context.User?.FindFirst("fullname")?.Value
                ?? context.User?.Identity?.Name;

            // Check if the request is for the LogsController
            bool isLogsController = context.Request.Path.Value?.Contains("/api/logs", StringComparison.OrdinalIgnoreCase) == true;
            bool isAuthController = context.Request.Path.Value?.Contains("/api/auth", StringComparison.OrdinalIgnoreCase) == true;
            
            // Only deserialize if requestBody is not empty and contains valid JSON
            Dictionary<string, JsonElement> dict = null;
            if (!string.IsNullOrEmpty(requestBody) && requestBody.Trim().StartsWith("{"))
            {
                try
                {
                    dict = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(requestBody);
                    dict?.Remove("password"); // remove password key
                }
                catch (JsonException)
                {
                    // If JSON parsing fails, treat as plain text
                    dict = null;
                }
            }

            // Check if token was blocked
            bool isTokenBlocked = context.Items.ContainsKey("TokenBlocked") && (bool)context.Items["TokenBlocked"];
            string blockedToken = context.Items.ContainsKey("BlockedToken") ? context.Items["BlockedToken"].ToString() : null;

            // Modify response body for blocked tokens to include more details
            if (isTokenBlocked && statusCode == 401)
            {
                responseBody = $"Token is blacklisted. Blocked token: {blockedToken?.Substring(0, Math.Min(20, blockedToken?.Length ?? 0))}...";
            }

            var log = new ApiLog
            {
                Method = context.Request.Method,
                Path = context.Request.Path,
                QueryString = isLogsController ? string.Empty : context.Request.QueryString.ToString(),
                RequestBody = dict != null ? JsonSerializer.Serialize(dict) : requestBody,
                ResponseBody = (isLogsController || isAuthController) ? string.Empty : responseBody,
                StatusCode = statusCode,
                UserId = userId,
                UserName = userName,
                IpAddress = context.Connection.RemoteIpAddress?.ToString(),
                Timestamp = DateTime.UtcNow,
                Duration = duration
            };

            _context.ApiLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}
