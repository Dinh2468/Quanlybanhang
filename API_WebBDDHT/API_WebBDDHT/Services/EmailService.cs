using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System.Threading.Tasks;
using System;

namespace API_WebBDDHT.Services
{
    /// <summary>
    /// Dịch vụ gửi email sử dụng thư viện MailKit.
    /// </summary>
    /// <remarks>
    /// Cấu hình email (sender, password, v.v.) được lấy từ IConfiguration.
    /// </remarks>
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        /// <summary>
        /// Khởi tạo EmailService với cấu hình được cung cấp.
        /// </summary>
        /// <param name="config">Cấu hình ứng dụng, chứa các thiết lập email.</param>
        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Gửi email bất đồng bộ.
        /// </summary>
        /// <param name="toEmail">Địa chỉ email người nhận.</param>
        /// <param name="subject">Tiêu đề email.</param>
        /// <param name="body">Nội dung HTML của email.</param>
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                // Tạo đối tượng email mới
                var emailMessage = new MimeMessage();
                
                var senderEmail = _config["EmailSettings:SenderEmail"] ?? "your-email@gmail.com";
                var senderName = _config["EmailSettings:SenderName"] ?? "WebBDDHT Admin";
                var password = _config["EmailSettings:Password"] ?? "your-app-password";
                
                emailMessage.From.Add(new MailboxAddress(senderName, senderEmail));
                emailMessage.To.Add(new MailboxAddress("", toEmail));
                emailMessage.Subject = subject;

                var bodyBuilder = new BodyBuilder { HtmlBody = body };
                emailMessage.Body = bodyBuilder.ToMessageBody();

                // Khởi tạo client SMTP để gửi email
                using (var client = new SmtpClient())
                {
                    // For Gmail
                    await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                    
                    // Note: only needed if the SMTP server requires authentication
                    await client.AuthenticateAsync(senderEmail, password);
                    
                    await client.SendAsync(emailMessage);
                    await client.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                // Log exception
                Console.WriteLine($"Lỗi khi gửi email: {ex.Message}");
                throw;
            }
        }
    }
}
