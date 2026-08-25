using System.ComponentModel.DataAnnotations;

namespace API_WebBDDHT.DTOs.KhuyenMai
{
    // DTO hứng dữ liệu khi Thêm mới hoặc Cập nhật Khuyến mãi
    public record LuuKhuyenMaiDto
    {
        [Required(ErrorMessage = "Tên chương trình khuyến mãi không được để trống")]
        [StringLength(100, ErrorMessage = "Tên khuyến mãi không được vượt quá 100 ký tự")]
        public string TenKM { get; set; } = null!;

        [Required(ErrorMessage = "Ngày bắt đầu không được để trống")]
        public DateTime NgayBatDau { get; set; }

        [Required(ErrorMessage = "Ngày kết thúc không được để trống")]
        public DateTime NgayKetThuc { get; set; }

        [Range(1, 100, ErrorMessage = "Phần trăm giảm phải nằm trong khoảng từ 1% đến 100%")]
        public int PhanTramGiam { get; set; }

        public string? DieuKienApDung { get; set; }

        // Danh sách mã sản phẩm được áp dụng chương trình khuyến mãi này (Nếu có)
        public List<int> MaSanPhams { get; set; } = new();
    }

    // DTO trả về thông tin sạch hiển thị lên giao diện
    public record KhuyenMaiDto
    {
        public int MaKM { get; set; }
        public string? TenKM { get; set; }
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public int? PhanTramGiam { get; set; }
        public string? DieuKienApDung { get; set; }
        public List<int> SanPhams { get; set; } = new();
    }
}
