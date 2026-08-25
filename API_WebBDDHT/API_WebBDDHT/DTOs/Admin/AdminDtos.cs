using API_WebBDDHT.DTOs.Common;

using System.ComponentModel.DataAnnotations;

namespace API_WebBDDHT.DTOs.Admin
{
    // DTO hiển thị danh sách đơn hàng phía Admin
    public record AdminDonHangDto
    {
        public int MaDH { get; set; }
        public int? MaKH { get; set; }
        public string? TenKhachHang { get; set; }
        public string? HoTenNguoiNhan { get; set; }
        public string? SDTNguoiNhan { get; set; }
        public DateTime? NgayDat { get; set; }
        public string? TrangThai { get; set; }
        public decimal? TongTien { get; set; }
        public string? DiaChiGiaoHang { get; set; }
        public string? TenPhuongThucThanhToan { get; set; }
        public string? TrangThaiThanhToan { get; set; }
        public string? MaGiaoDichNgoai { get; set; }
        public string? MaVanDonGHN { get; set; }
    }

    // DTO nhận dữ liệu thay đổi trạng thái từ Admin Dashboard gửi lên
    public record CapNhatTrangThaiDonHangDto
    {
        public string? TrangThai { get; set; } // Ví dụ: "Đang giao", "Đã giao", "Đã hủy"
        public string? TrangThaiThanhToan { get; set; } // Ví dụ: "Chưa thanh toán", "Đã thanh toán"
        public string? MaVanDonGHN { get; set; }
    }

    // DTO chi tiết đơn hàng phía Admin
    public record AdminChiTietDonHangDto
    {
        public int MaDH { get; set; }
        public int? MaKH { get; set; }
        public string? TenKhachHang { get; set; }
        public string? EmailKhachHang { get; set; }
        public string? HoTenNguoiNhan { get; set; }
        public string? SDTNguoiNhan { get; set; }
        public DateTime? NgayDat { get; set; }
        public string? TrangThai { get; set; }
        public decimal? TongTien { get; set; }
        public string? DiaChiGiaoHang { get; set; }
        public string? GhiChu { get; set; }
        public string? TenPhuongThucThanhToan { get; set; }
        public string? TrangThaiThanhToan { get; set; }
        public string? MaGiaoDichNgoai { get; set; }
        public string? MaVanDonGHN { get; set; }
        public List<SanPhamLineItemDto> ChiTietDonHangs { get; set; } = new();
    }

    // DTO hiển thị khách hàng phía Admin
    public record AdminKhachHangDto
    {
        public int MaKH { get; set; }
        public string HoTen { get; set; } = null!;
        public string? SDT { get; set; }
        public string? DiaChi { get; set; }
        public int? MaTK { get; set; }
        public string? TenDangNhap { get; set; }
        public string? Email { get; set; }
        public int DiemTichLuy { get; set; }
        public int? MaHang { get; set; }
        public string? TenHangThanhVien { get; set; }
        public bool TrangThai { get; set; }
    }

    // DTO hiển thị nhân viên phía Admin
    public record AdminNhanVienDto
    {
        public int MaNV { get; set; }
        public string MaSoNhanVien { get; set; } = null!;
        public string HoTen { get; set; } = null!;
        public string? GioiTinh { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string? SDT { get; set; }
        public string? DiaChi { get; set; }
        public int? MaTK { get; set; }
        public string? TenDangNhap { get; set; }
        public string? Email { get; set; }
        public string? VaiTro { get; set; }
        public string? TrangThai { get; set; }
        public string? Avatar { get; set; }
    }

    // DTO nhận dữ liệu khi Admin tạo nhân viên mới
    public class AdminTaoNhanVienDto
    {
        public string HoTen { get; set; } = null!;
        public string TenDangNhap { get; set; } = null!;
        public string Email { get; set; } = null!;
        
        [RegularExpression(@"^0(3|5|7|8|9)\d{8}$", ErrorMessage = "Số điện thoại không hợp lệ (phải bắt đầu bằng 03, 05, 07, 08, 09 và đủ 10 số).")]
        public string? SoDienThoai { get; set; }
        public string? DiaChi { get; set; }
        public string? GioiTinh { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string VaiTro { get; set; } = "Nhân viên";
        public string? MatKhau { get; set; }
        public string TrangThai { get; set; } = "Đang hoạt động";
    }

    // DTO chi tiết khách hàng phía Admin
    public record AdminChiTietKhachHangDto
    {
        public int MaKH { get; set; }
        public string HoTen { get; set; } = null!;
        public string? SDT { get; set; }
        public string? DiaChi { get; set; }
        public int? MaTK { get; set; }
        public string? TenDangNhap { get; set; }
        public string? Email { get; set; }
        public int DiemTichLuy { get; set; }
        public int? MaHang { get; set; }
        public string? TenHangThanhVien { get; set; }
        public string? Avatar { get; set; }
        public List<AdminDonHangDto> LichSuDonHangs { get; set; } = new();
    }
}
