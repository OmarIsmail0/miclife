namespace micpanel.Repository
{
    public interface IMailServices
    {
        Task<string> SendEmailAsync(string mailto, string subject, string body, IList<IFormFile>? attachments = null);
        Task<string> SendOtpEmailAsync(string mailto, string otpCode);
        Task<string> SendTemplatedEmailAsync(string mailto, string subject, string bodyContent);
    }
}
