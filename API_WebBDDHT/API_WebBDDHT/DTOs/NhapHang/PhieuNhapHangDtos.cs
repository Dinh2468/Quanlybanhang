using System.ComponentModel.DataAnnotations;
using API_WebBDDHT.DTOs.Common;

namespace API_WebBDDHT.DTOs.NhapHang
{
    // DTO nhận từng dòng sản phẩm khi nhập hàng
    public record ChiTietNhapInputDto
    {
        [Required]
        public int MaSP { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Số lượng nhập phải lớn hơn 0")]
        public int SoLuong { get; set; }
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Đơn giá nhập không được âm")]
        public decimal DonGia { get; set; }
    }

    // DTO nhận dữ liệu tổng thể để tạo phiếu nhập
    public record TaoPhieuNhapDto
    {
        public int? MaNCC { get; set; }
        public string LoaiPhieu { get; set; } = "Nhập hàng"; // "Nhập hàng", "Điều chỉnh tăng", "Điều chỉnh giảm"
        public List<ChiTietNhapInputDto> ChiTietNhapHangs { get; set; } = new();
    }

    // DTO cập nhật trạng thái phiếu nhập
    public record CapNhatTrangThaiNhapDto
    {
        [Required(ErrorMessage = "Trạng thái không được để trống")]
        public string TrangThai { get; set; } = null!; // "Chờ nhận hàng", "Hoàn thành", "Đã hủy"
    }

    // DTO trả về thông tin phiếu nhập
    public record PhieuNhapDto
    {
        public int MaNH { get; set; }
        public int? MaNV { get; set; }
        public string? TenNhanVien { get; set; }
        public int? MaNCC { get; set; }
        public string? TenNCC { get; set; }
        public DateTime? NgayNhap { get; set; }
        public decimal? TongTien { get; set; }
        public string TrangThai { get; set; } = null!;
        public string LoaiPhieu { get; set; } = null!;
        public List<SanPhamLineItemDto> DanhSachSanPham { get; set; } = new();
    }
}
