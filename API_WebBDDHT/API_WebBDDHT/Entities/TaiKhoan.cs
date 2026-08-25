
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("TaiKhoan")]
    public class TaiKhoan
    {
        [Key]
        [Column("MaTK")]
        public int MaTK { get; set; }

        [Required]
        [StringLength(50)]
        [Column("TenDangNhap")]
        public string TenDangNhap { get; set; } = null!;

        [Required]
        [StringLength(255)]
        [Column("MatKhau")]
        public string MatKhau { get; set; } = null!;

        [StringLength(100)]
        [Column("Email")]
        public string? Email { get; set; }

        [StringLength(50)]
        [Column("VaiTro")]
        public string? VaiTro { get; set; }

        [Column("TrangThai")]
        public bool TrangThai { get; set; } = true; 

        [Column("Avatar")]
        [StringLength(255)]
        public string? Avatar { get; set; }

        [Column("ResetToken")]
        [StringLength(10)]
        public string? ResetToken { get; set; }

        [Column("ResetTokenExpiry")]
        public DateTime? ResetTokenExpiry { get; set; }

        // Navigation Properties cho mối quan hệ 1-1 ẩn
        public virtual KhachHang? KhachHang { get; set; }
        public virtual NhanVien? NhanVien { get; set; }
    }
}
