using System.ComponentModel.DataAnnotations;

namespace API_WebBDDHT.DTOs.Auth
{
    // Base record dùng chung cho thông tin cá nhân
    public abstract record ThongTinCaNhanBase(
        string HoTen,
        string? SoDienThoai,
        string? DiaChi,
        string? Email
    );

    public record DangKyDto(
        string HoTen,
        string TenDangNhap,
        string Email,
        string MatKhau,
        [RegularExpression(@"^0(3|5|7|8|9)\d{8}$", ErrorMessage = "Số điện thoại không hợp lệ (phải bắt đầu bằng 03, 05, 07, 08, 09 và đủ 10 số).")]
        string? SoDienThoai,
        string? DiaChi
    ) : ThongTinCaNhanBase(HoTen, SoDienThoai, DiaChi, Email);

    public record DangNhapDto(
        string TenDangNhap,
        string MatKhau
    );

    public record DangNhapResultDto(
        string Token,
        string TenDangNhap,
        string? Email,
        string VaiTro,
        int MaTK,
        int? MaNguoiDung,
        string HoTen,
        string? Avatar
    );
}
