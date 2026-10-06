using micpanel.Context;
using micpanel.Helpers;
using micpanel.ModelDto;
using micpanel.Models;
using micpanel.Repository;
using micpanel.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Threading.RateLimiting;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
IConfiguration Configuration = builder.Configuration;


// Force environment to Development for debugging (REMOVE IN PRODUCTION)
//builder.Environment.EnvironmentName = "Development";

// Add environment detection and logging
//var environment = builder.Environment.EnvironmentName;
//Console.WriteLine($"Current Environment: {environment}");
//Console.WriteLine($"Configuration Files: {string.Join(", ", builder.Configuration.GetChildren().Select(x => x.Key))}");



builder.Services.AddDbContext<CommerceDb>(options =>
options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<AuthUser, IdentityRole>(option =>
{
    option.Tokens.AuthenticatorTokenProvider = TokenOptions.DefaultEmailProvider;
    option.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
    option.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultEmailProvider;
    option.Tokens.ChangeEmailTokenProvider = TokenOptions.DefaultEmailProvider;
    option.Tokens.ChangePhoneNumberTokenProvider = TokenOptions.DefaultPhoneProvider;
    option.Tokens.AuthenticatorTokenProvider = TokenOptions.DefaultAuthenticatorProvider;
    option.Lockout.AllowedForNewUsers = true;
    option.Lockout.MaxFailedAccessAttempts = 3;
    option.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);

    // Password complexity requirements
    option.Password.RequireDigit = true;
    option.Password.RequireLowercase = true;
    option.Password.RequireUppercase = true;
    option.Password.RequireNonAlphanumeric = true;
    option.Password.RequiredLength = 8;
    option.Password.RequiredUniqueChars = 1;
})
.AddEntityFrameworkStores<CommerceDb>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(o =>
{
    o.RequireHttpsMetadata = false;
    o.SaveToken = false;
    var jwtKey = Configuration["JWT:Key"];
    if (string.IsNullOrEmpty(jwtKey))
        throw new InvalidOperationException("JWT:Key configuration value is missing or null.");
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidIssuer = Configuration["JWT:Issuer"],
        ValidAudience = Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});

// Add API Logging Service
builder.Services.AddScoped<IApiLogService, ApiLogService>();
builder.Services.AddScoped<IAuthServices, AuthService>();
builder.Services.AddScoped<IMailServices, MailServices>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IAlbumService, AlbumService>();
builder.Services.AddScoped<IContentManage, ContentManage>();
builder.Services.AddScoped<ITicketManagement, TicketManagement>();
builder.Services.AddScoped<IQuoteService, QuoteService>();
builder.Services.AddScoped<TokenBlacklistService>();

builder.Services.Configure<Jwt>(Configuration.GetSection("JWT"));
builder.Services.Configure<MailSettings>(Configuration.GetSection(nameof(MailSettings)));

// Add global request size limits to prevent DoS attacks
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 200 * 1024 * 1024; // 200MB global limit
    options.ValueLengthLimit = 10 * 1024 * 1024; // 10MB per field
    options.ValueCountLimit = 1024; // Maximum number of form fields
});

// Add request size limits for Kestrel
builder.Services.Configure<Microsoft.AspNetCore.Server.Kestrel.Core.KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = 200 * 1024 * 1024; // 200MB
});

// Add Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    // Global rate limiter for authenticated users
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
    {
        var username = httpContext.User?.Identity?.Name ?? httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous";
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: username,
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1)
            });
    });

    // Stricter rate limiter for authentication endpoints
    options.AddPolicy("AuthPolicy", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1)
            }));

    // Rate limiter for file upload endpoints
    options.AddPolicy("UploadPolicy", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.User?.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1)
            }));

    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = 429;
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            Message = "Too many requests. Please try again later."
        }, cancellationToken: token);
    };
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
        //.AllowCredentials()
        //.WithMethods("GET", "POST", "PUT", "DELETE")
        //.WithHeaders("Authorization", "Content-Type");
    });
});

// Add services to the container.

builder.Services.AddControllers();

//// Add Anti-Forgery Token support for CSRF protection
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "__RequestVerificationToken";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.Cookie.SameSite = SameSiteMode.Strict;
});

var app = builder.Build();


//
// Allow static files from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();
// Allow static files from custom "uploads" folder (outside wwwroot)
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "uploads")),
    RequestPath = "/uploads"
});

// Configure the HTTP request pipeline.
app.UseCors();

// Add Security Headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    // Content Security Policy: strict (script-src 'none') for API and uploads; relaxed for SPA routes
    var path = context.Request.Path.Value ?? "";
    var strictCsp = "default-src 'self'; script-src 'none'; style-src 'self'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';";
    var relaxedCsp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://mohandes-insurance.com https://www.mohandes-insurance.com; frame-ancestors 'none';";
    var csp = (path.StartsWith("/api/", StringComparison.OrdinalIgnoreCase) || path.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
        ? strictCsp
        : relaxedCsp;
    context.Response.Headers["Content-Security-Policy"] = csp;

    // Remove server header
    context.Response.Headers.Remove("Server");

    await next();
});

// Only redirect to HTTPS in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseRateLimiter();
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();
app.UseMiddleware<ApiLoggingMiddleware>();
app.UseMiddleware<TokenBlacklistMiddleware>();

app.UseAuthentication();
app.UseAuthorization();
// React app under /cp path (build output: wwwroot/cp)
app.MapWhen(ctx => ctx.Request.Path.StartsWithSegments("/cp") && !ctx.Request.Path.Value!.Contains('.'),
    spaApp =>
    {
        spaApp.Run(async context =>
        {
            context.Response.ContentType = "text/html";
            await context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath, "cp", "index.html"));
        });
    });

// React app at root / webApp (build output: wwwroot)
app.MapWhen(ctx =>
{
    var path = ctx.Request.Path.Value ?? "";
    return !path.StartsWith("/api", StringComparison.OrdinalIgnoreCase)
        && !path.StartsWith("/cp", StringComparison.OrdinalIgnoreCase)
        && !path.StartsWith("/uploads", StringComparison.OrdinalIgnoreCase)
        && !path.Contains('.');
},
spaApp =>
{
    spaApp.Run(async context =>
    {
        context.Response.ContentType = "text/html";
        await context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath, "index.html"));
    });
});


app.MapControllers();
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
app.Run();
