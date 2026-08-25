using System.ComponentModel.DataAnnotations;

namespace API_WebBDDHT.DTOs.Auth
{
    public class GoogleLoginDto
    {
        [Required]
        public string IdToken { get; set; } = string.Empty;
    }
}
