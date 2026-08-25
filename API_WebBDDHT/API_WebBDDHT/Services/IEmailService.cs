using System.Threading.Tasks;

namespace API_WebBDDHT.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }
}
