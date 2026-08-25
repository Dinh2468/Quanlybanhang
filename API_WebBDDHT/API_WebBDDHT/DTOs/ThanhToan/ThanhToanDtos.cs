namespace API_WebBDDHT.DTOs.ThanhToan
{
    public record PhuongThucThanhToanDto
    {
        public int MaPTTT { get; set; }
        public string TenPhuongThuc { get; set; } = null!;
        public string MaCode { get; set; } = null!;
        public string? HinhAnh { get; set; }
        public string? GhiChu { get; set; }
    }
}
