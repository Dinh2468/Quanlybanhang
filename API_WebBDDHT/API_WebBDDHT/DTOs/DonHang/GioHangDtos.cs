using API_WebBDDHT.DTOs.Common;

namespace API_WebBDDHT.DTOs.DonHang
{
    // DTO tổng thể giỏ hàng
    public record GioHangDto
    {
        public int MaGH { get; set; }
        public int? MaKH { get; set; }
        public decimal TongTien { get; set; }
        public int PhanTramVIP { get; set; } = 0;
        public decimal GiamGiaVIP { get; set; } = 0;
        public decimal TongTienCuoiCung { get; set; } = 0;
        public DateTime? NgayCapNhat { get; set; }
        public List<SanPhamLineItemDto> DanhSachSanPham { get; set; } = new();
    }

    // DTO thêm sản phẩm vào giỏ hàng
    public record ThemGioHangDto
    {
        public int MaSP { get; set; }
        public int SoLuong { get; set; }
        public string? CartToken { get; set; }
    }

    // DTO cập nhật số lượng sản phẩm trong giỏ hàng
    public class CapNhatGioHangDto
    {
        public int MaSP { get; set; }
        public int SoLuong { get; set; }
    }
}
