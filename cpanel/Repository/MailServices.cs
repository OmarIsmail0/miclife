using MailKit.Net.Smtp;
using MailKit.Security;
using micpanel.ModelDto;
using Microsoft.Extensions.Options;
using MimeKit;


namespace micpanel.Repository
{
    public class MailServices:IMailServices
    {
        private readonly MailSettings _mailSettings;

        public MailServices(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public async Task<string> SendEmailAsync(string mailto, string subject, string body, IList<IFormFile>? attachments = null)
        {
            var email = new MimeMessage
            {
                Sender = MailboxAddress.Parse(_mailSettings.Email),
                Subject = subject
            };

            email.To.Add(MailboxAddress.Parse(mailto));
            var builder = new BodyBuilder();
            if (attachments != null)
            {
                byte[] filebytes;
                foreach (var attachment in attachments)
                {
                    if (attachment.Length > 0)
                    {
                        using var ms = new MemoryStream();
                        attachment.CopyTo(ms);
                        filebytes = ms.ToArray();
                        builder.Attachments.Add(attachment.FileName, filebytes, ContentType.Parse(attachment.ContentType));
                    }
                }
            }
            builder.HtmlBody = body;
            email.Body = builder.ToMessageBody();
            email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Email));

            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Email, _mailSettings.Password);
            var result = await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
            return result;
        }

        public async Task<string> SendOtpEmailAsync(string mailto, string otpCode)
        {
            // Replace this URL with the actual logo URL or a base64 image if needed
            string logoUrl = "https://i.ibb.co/NG6KJXT/Logo.png";
            string htmlBody = $@"
                <div style='font-family: Arial, sans-serif; text-align: center;'>
                    <img src='{logoUrl}' alt='Mohandes Insurance Logo' style='max-width: 250px; margin-bottom: 20px;' />
                    <h2>One-Time Password (OTP)</h2>
                    <p>Your verification code is:</p>
                    <div style='font-size: 2em; font-weight: bold; color: #005baa; margin: 20px 0;'>{otpCode}</div>
                    <p>Please use this code to complete your authentication. This code is valid for a limited time only.</p>
                    <br/>
                    <p style='color: #888;'>If you did not request this code, please ignore this email.</p>
                </div>";

            var email = new MimeMessage
            {
                Sender = MailboxAddress.Parse(_mailSettings.Email),
                Subject = "Your OTP Code - Mohandes Insurance"
            };
            email.To.Add(MailboxAddress.Parse(mailto));
            var builder = new BodyBuilder
            {
                HtmlBody = htmlBody
            };
            email.Body = builder.ToMessageBody();
            email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Email));

            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Email, _mailSettings.Password);
            var result = await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
            return result;
        }

        public async Task<string> SendTemplatedEmailAsync(string mailto, string subject, string bodyContent)
        {
            string logoUrl = "https://i.ibb.co/NG6KJXT/Logo.png";
            string htmlBody = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;'>
                    <div style='background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>
                        <div style='text-align: center; margin-bottom: 30px;'>
                            <img src='{logoUrl}' alt='Mohandes Insurance Logo' style='max-width: 200px;' />
                        </div>
                        <div style='color: #333; line-height: 1.6;'>
                            {bodyContent}
                        </div>
                        <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;'>
                            <p style='color: #888; font-size: 14px; margin: 0;'>
                                Best regards,<br/>
                                Mohandes Insurance Team
                            </p>
                        </div>
                    </div>
                </div>";

            var email = new MimeMessage
            {
                Sender = MailboxAddress.Parse(_mailSettings.Email),
                Subject = subject
            };
            email.To.Add(MailboxAddress.Parse(mailto));
            var builder = new BodyBuilder
            {
                HtmlBody = htmlBody
            };
            email.Body = builder.ToMessageBody();
            email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Email));

            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Email, _mailSettings.Password);
            var result = await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
            return result;
        }
    }
}
