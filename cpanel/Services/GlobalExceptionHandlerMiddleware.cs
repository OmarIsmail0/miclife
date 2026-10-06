using System.Net;
using System.Text.Json;

namespace micpanel.Services
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;
        private readonly IWebHostEnvironment _environment;

        public GlobalExceptionHandlerMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionHandlerMiddleware> logger,
            IWebHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _environment = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred. Path: {Path}, Method: {Method}",
                    context.Request.Path, context.Request.Method);

                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var code = HttpStatusCode.InternalServerError;
            var message = "An error occurred while processing your request. Please try again later.";

            // Handle specific exception types (check more specific types first)
            if (exception is ArgumentNullException || exception is ArgumentException)
            {
                code = HttpStatusCode.BadRequest;
                message = "Invalid request parameters.";
            }
            else if (exception is UnauthorizedAccessException)
            {
                code = HttpStatusCode.Unauthorized;
                message = "You are not authorized to perform this action.";
            }
            else if (exception is KeyNotFoundException || exception is FileNotFoundException)
            {
                code = HttpStatusCode.NotFound;
                message = "The requested resource was not found.";
            }
            else if (exception is InvalidOperationException)
            {
                code = HttpStatusCode.BadRequest;
                message = "The operation cannot be completed.";
            }

            var result = JsonSerializer.Serialize(new { Message = message });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
    }
}

