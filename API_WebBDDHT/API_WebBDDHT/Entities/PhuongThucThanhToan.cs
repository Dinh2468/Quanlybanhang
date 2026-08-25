using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("PhuongThucThanhToan")]
    public class PhuongThucThanhToan
    {
        [Key]
        [Column("MaPTTT")]
        public int MaPTTT { get; set; }

        [Required]
        [StringLength(100)]
        [Column("TenPhuongThuc")]
        public string TenPhuongThuc { get; set; } = null!; 

        [Required]
        [StringLength(50)]
        [Column("MaCode")]
        public string MaCode { get; set; } = null!; // "COD", "VNPAY", "MOMO" -> Dùng để check logic trong code C#

        [StringLength(255)]
        [Column("HinhAnh")]
        public string? HinhAnh { get; set; } // Link ảnh logo lưu trên Cloudinary

        [Column("GhiChu")]
        public string? GhiChu { get; set; } // Hướng dẫn thanh toán nếu có

        [Column("TrangThai")]
        public bool TrangThai { get; set; } = true; // true: Đang bật, false: Tạm khóa bảo trì

        // Mối quan hệ: Một phương thức thanh toán có thể áp dụng cho nhiều Đơn hàng
        public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();
    }
}
