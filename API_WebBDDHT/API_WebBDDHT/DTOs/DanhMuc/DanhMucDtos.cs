using System.ComponentModel.DataAnnotations;

namespace API_WebBDDHT.DTOs.DanhMuc
{
    // ==================== Loại sản phẩm ====================

    // DTO dùng để hứng dữ liệu đầu vào khi Thêm hoặc Sửa loại sản phẩm
    public record LuuLoaiSPDto
    {
        [Required(ErrorMessage = "Tên loại sản phẩm không được để trống")]
        [StringLength(100, ErrorMessage = "Tên loại không được vượt quá 100 ký tự")]
        public string TenLoai { get; set; } = null!;
        public string? MoTa { get; set; }
    }

    // DTO trả về dữ liệu sạch cho khách hàng xem ngoài giao diện
    public record LoaiSPDto
    {
        public int MaLoai { get; set; }
        public string TenLoai { get; set; } = null!;
        public string? MoTa { get; set; }
    }

    // ==================== Thương hiệu ====================

    public record LuuThuongHieuDto
    {
        [Required(ErrorMessage = "Tên thương hiệu không được để trống")]
        [StringLength(100, ErrorMessage = "Tên thương hiệu không được vượt quá 100 ký tự")]
        public string TenTH { get; set; } = null!;
        [Required(ErrorMessage = "Quốc gia không được để trống")]
        [StringLength(100, ErrorMessage = "Tên quốc gia không được vượt quá 100 ký tự")]
        public string? QuocGia { get; set; }
        public string? MoTa { get; set; }
    }

    public record ThuongHieuDto
    {
        public int MaTH { get; set; }
        public string TenTH { get; set; } = null!;
        public string? QuocGia { get; set; }
        public string? MoTa { get; set; }
    }

    // ==================== Nhà cung cấp ====================

    // DTO nhận dữ liệu từ Frontend khi Thêm mới hoặc Cập nhật Nhà cung cấp
    public record LuuNhaCungCapDto
    {
        [Required(ErrorMessage = "Tên nhà cung cấp không được để trống")]
        [StringLength(100, ErrorMessage = "Tên nhà cung cấp không được vượt quá 100 ký tự")]
        public string TenNCC { get; set; } = null!;

        public string? DiaChi { get; set; }

        [StringLength(20, ErrorMessage = "Số điện thoại không được vượt quá 20 ký tự")]
        [Phone(ErrorMessage = "Số điện thoại không đúng định dạng")]
        public string? SDT { get; set; }

        [StringLength(100, ErrorMessage = "Email không được vượt quá 100 ký tự")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string? Email { get; set; }
    }

    // DTO đóng gói dữ liệu trả về cho Frontend React hiển thị lên UI
    public record NhaCungCapDto
    {
        public int MaNCC { get; set; }
        public string TenNCC { get; set; } = null!;
        public string? DiaChi { get; set; }
        public string? SDT { get; set; }
        public string? Email { get; set; }
    }

    // ==================== Hạng khách hàng ====================

    public record LuuHangKhachHangDto
    {
        [Required(ErrorMessage = "Tên hạng khách hàng không được để trống")]
        [StringLength(50, ErrorMessage = "Tên hạng không được vượt quá 50 ký tự")]
        public string TenHang { get; set; } = null!;

        [Range(0, int.MaxValue, ErrorMessage = "Điểm tối thiểu không được là số âm")]
        public int DiemToiThieu { get; set; }

        [Range(0, 100, ErrorMessage = "Phần trăm ưu đãi phải nằm trong khoảng từ 0% đến 100%")]
        public int PhanTramUuDai { get; set; }
    }

    // DTO đóng gói dữ liệu sạch gửi về Frontend hiển thị
    public record HangKhachHangDto
    {
        public int MaHang { get; set; }
        public string TenHang { get; set; } = null!;
        public int DiemToiThieu { get; set; }
        public int PhanTramUuDai { get; set; }
    }
}
