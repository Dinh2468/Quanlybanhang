using System.ComponentModel.DataAnnotations;

namespace API_WebBDDHT.DTOs.SanPham
{
    // DTO trả về thông tin sản phẩm cho giao diện
    public record SanPhamDto(
        int MaSP,
        string TenSP,
        string? MoTa,
        decimal? Gia,
        int SoLuongTon,
        string? HinhAnh,
        int? MaLoaiSP,
        string TenLoaiSP,
        int? MaTH,
        string? TenTH
    )
    {
        public double Rating { get; set; } = 5.0;
        public int ReviewCount { get; set; } = 0;
        public int? PhanTramGiam { get; set; }
        public decimal? GiaGiam { get; set; }
        public bool TrangThaiHienThi { get; set; }
    }

    // DTO nhận dữ liệu khi Thêm hoặc Cập nhật sản phẩm
    public class LuuSanPhamDto
    {
        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        [StringLength(100, ErrorMessage = "Tên sản phẩm không được vượt quá 100 ký tự")]
        public string TenSP { get; set; } = null!;

        public string? MoTa { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Giá sản phẩm không được âm")]
        public decimal? Gia { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn kho không được âm")]
        public int SoLuongTon { get; set; } = 0;

        public int? MaLoai { get; set; }
        public int? MaTH { get; set; }

        // Nhận mảng file ảnh vật lý từ giao diện React gửi lên
        public List<IFormFile>? FileHinhAnhs { get; set; }
        
        // Nhận chuỗi các ảnh cũ còn giữ lại (khi Update)
        public string? AnhCuConLai { get; set; }

        public bool TrangThaiHienThi { get; set; } = true;
    }
}
