using Microsoft.IO;
using System.Text;

namespace micpanel.Services
{
    public class ApiLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly RecyclableMemoryStreamManager _streamManager;

        public ApiLoggingMiddleware(RequestDelegate next, IServiceScopeFactory serviceScopeFactory)
        {
            _next = next;
            _serviceScopeFactory = serviceScopeFactory;
            _streamManager = new RecyclableMemoryStreamManager();
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var startTime = DateTime.UtcNow;
            string requestBody = string.Empty;
            string responseBody = string.Empty;

            // Read request body
            if (context.Request.Body != null && context.Request.ContentLength > 0)
            {
                context.Request.EnableBuffering();
                try
                {
                    using (var reader = new StreamReader(
                        context.Request.Body,
                        encoding: Encoding.UTF8,
                        detectEncodingFromByteOrderMarks: false,
                        bufferSize: 1024 * 45,
                        leaveOpen: true))
                    {
                        requestBody = await reader.ReadToEndAsync();
                        context.Request.Body.Position = 0;
                    }
                }
                catch (Exception)
                {
                    // Log error or handle it appropriately
                    requestBody = "Error reading request body";
                }
            }

            // Capture response
            var originalBodyStream = context.Response.Body;
            using var responseStream = _streamManager.GetStream();
            context.Response.Body = responseStream;

            try
            {
                await _next(context);

                // Read response body
                responseStream.Seek(0, SeekOrigin.Begin);
                try
                {
                    using (var reader = new StreamReader(responseStream, Encoding.UTF8, true, 1024 * 45, true))
                    {
                        responseBody = await reader.ReadToEndAsync();
                    }
                }
                catch (Exception)
                {
                    responseBody = "Error reading response body";
                }

                // Calculate duration
                var duration = (long)(DateTime.UtcNow - startTime).TotalMilliseconds;

                // Create a scope for the scoped service
                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var apiLogService = scope.ServiceProvider.GetRequiredService<IApiLogService>();
                    // Log the request
                    await apiLogService.LogRequest(
                        context,
                        requestBody,
                        responseBody,
                        context.Response.StatusCode,
                        duration
                    );
                }

                // Copy response back to original stream
                responseStream.Seek(0, SeekOrigin.Begin);
                await responseStream.CopyToAsync(originalBodyStream);
            }
            catch (Exception)
            {
                // If there's an error, make sure we restore the original response stream
                context.Response.Body = originalBodyStream;
                throw;
            }
            finally
            {
                context.Response.Body = originalBodyStream;
            }
        }
    }
}
