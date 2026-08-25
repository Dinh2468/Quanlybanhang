using System.ComponentModel.DataAnnotations;

namespace API_WebBDDHT.DTOs.SanPham
{
    // DTO trả về thông tin đánh giá
    public record DanhGiaDto
    {
        public int MaDG { get; set; }
        public int? SoSao { get; set; }
        public string? NoiDung { get; set; }
        public DateTime? NgayDG { get; set; }
        public string TenKhachHang { get; set; } = null!; // Lấy từ bảng KhachHang liên kết
    }

    // DTO nhận dữ liệu khi khách viết đánh giá
    public record VietDanhGiaDto
    {
        [Required]
        public int MaSP { get; set; }

        [Required]
        public int MaDH { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Số sao đánh giá phải nằm trong khoảng từ 1 đến 5 sao")]
        public int SoSao { get; set; }

        [StringLength(1000, ErrorMessage = "Nội dung bình luận không được vượt quá 1000 ký tự")]
        public string? NoiDung { get; set; }
    }
}
