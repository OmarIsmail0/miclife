namespace micpanel.Services
{
    public class TokenBlacklistMiddleware
    {
        private readonly RequestDelegate _next;

        public TokenBlacklistMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, TokenBlacklistService blacklistService)
        {
            var authHeader = context.Request.Headers["Authorization"].ToString();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                if (await blacklistService.IsTokenBlacklistedAsync(token))
                {
                    // Set context items for ApiLogService to capture
                    context.Items["TokenBlocked"] = true;
                    context.Items["BlockedToken"] = token;

                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        Message = "Token is Revoked !"
                    });
                    return;
                }
            }
            await _next(context);
        }
    }
}
