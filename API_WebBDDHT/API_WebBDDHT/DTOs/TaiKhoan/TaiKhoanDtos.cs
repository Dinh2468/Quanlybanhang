using System.ComponentModel.DataAnnotations;
using API_WebBDDHT.DTOs.Auth;

namespace API_WebBDDHT.DTOs.TaiKhoan
{
    public class CapNhapThongTinDto
    {
        public string HoTen { get; set; } = null!;
        
        [RegularExpression(@"^0(3|5|7|8|9)\d{8}$", ErrorMessage = "Số điện thoại không hợp lệ (phải bắt đầu bằng 03, 05, 07, 08, 09 và đủ 10 số).")]
        public string? SoDienThoai { get; set; }
        public string? DiaChi { get; set; }
        public string? Email { get; set; }

        // Khai báo đúng kiểu dữ liệu IFormFile để nhận file ảnh vật lý
        public IFormFile? FileAvatar { get; set; }
    }

    public record ThongTinTaiKhoanDto(
        int MaTK,
        string TenDangNhap,
        string VaiTro,
        string HoTen,
        string? SoDienThoai,
        string? DiaChi,
        string? Email,
        string? DiemTichLuy,
        string? TenHangThanhVien,
        string? Avatar
    ) : ThongTinCaNhanBase(HoTen, SoDienThoai, DiaChi, Email);

    public class DoiMatKhauDto
    {
        public string MatKhauCu { get; set; } = string.Empty;
        public string MatKhauMoi { get; set; } = string.Empty;
    }
}
