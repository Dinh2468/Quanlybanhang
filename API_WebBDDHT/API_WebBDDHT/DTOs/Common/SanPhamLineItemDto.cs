namespace API_WebBDDHT.DTOs.Common
{
    // Base record chung cho dòng sản phẩm (dùng trong giỏ hàng, đơn hàng, phiếu nhập)
    public record SanPhamLineItemDto
    {
        public int MaSP { get; set; }
        public string TenSP { get; set; } = null!;
        public string? HinhAnh { get; set; }
        public int? SoLuong { get; set; }
        public decimal? DonGia { get; set; }
        public decimal ThanhTien => (SoLuong ?? 0) * (DonGia ?? 0);
    }

    // Kế thừa khi cần thêm field đánh giá (dùng cho chi tiết đơn hàng phía khách hàng)
    public record ChiTietDonHangDto : SanPhamLineItemDto
    {
        public bool DaDanhGia { get; set; }
    }
}
