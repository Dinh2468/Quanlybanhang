using API_WebBDDHT.DTOs.Common;

namespace API_WebBDDHT.DTOs.DonHang
{
    // DTO nhận dữ liệu khi đặt hàng
    public record DatHangDto
    {
        public string HoTenNguoiNhan { get; set; } = null!;
        public string SDTNguoiNhan { get; set; } = null!;
        public string DiaChiGiaoHang { get; set; } = null!;
        public string? GhiChu { get; set; }
        public int MaPTTT { get; set; } 
        public string? CartToken { get; set; } // Truyền lên nếu là khách vãng lai đặt hàng công cộng
        public List<int>? SelectedMaSPs { get; set; } // Danh sách mã sản phẩm được chọn để thanh toán
        public decimal PhiVanChuyen { get; set; } = 0; // Phí vận chuyển từ GHN API
        public int? MaQuanHuyen { get; set; }
        public string? MaPhuongXa { get; set; }
    }

    // DTO hiển thị lịch sử đơn hàng
    public record DonHangLichSuDto
    {
        public int MaDH { get; set; }
        public DateTime? NgayDat { get; set; }
        public decimal TongTien { get; set; }
        public string? TrangThai { get; set; }
        public string? TrangThaiThanhToan { get; set; }
        public string? TenPhuongThucThanhToan { get; set; } // Lấy từ bảng PhuongThucThanhToan

        // Bổ sung thông tin món đầu tiên để hiện UI chuẩn
        public string? TenSanPhamDauTien { get; set; }
        public string? HinhAnhSanPhamDauTien { get; set; }
        public int SoLuongSanPhamDauTien { get; set; }
        public int TongSoLoaiSanPham { get; set; }
        public bool DaDanhGia { get; set; } // Cờ đánh dấu xem khách hàng đã đánh giá đơn hàng này chưa
    }

    // DTO tổng thể chứa toàn bộ thông tin giao nhận và sản phẩm của Đơn hàng
    public record ChiTietDonHangResponseDto
    {
        public int MaDH { get; set; }
        public DateTime? NgayDat { get; set; }
        public decimal TongTien { get; set; }
        public string? TrangThai { get; set; }
        public string? TrangThaiThanhToan { get; set; }
        public string? TenPhuongThucThanhToan { get; set; }
        public string? MaVanDonGHN { get; set; }
        public string HoTenNguoiNhan { get; set; } = null!;
        public string SDTNguoiNhan { get; set; } = null!;
        public string DiaChiGiaoHang { get; set; } = null!;
        public string? GhiChu { get; set; }
        public int? MaQuanHuyen { get; set; }
        public string? MaPhuongXa { get; set; }
        public List<ChiTietDonHangDto> DanhSachSanPham { get; set; } = new();
    }
}
