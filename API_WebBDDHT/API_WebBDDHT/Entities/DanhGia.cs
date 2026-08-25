using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("DanhGia")]
    public class DanhGia
    {
        [Key]
        [Column("MaDG")]
        public int MaDG { get; set; }

        [Column("MaKH")]
        public int? MaKH { get; set; }

        [Column("MaSP")]
        public int? MaSP { get; set; }

        [Required]
        [Column("MaDH")]
        public int MaDH { get; set; }

        [Column("SoSao")]
        public int? SoSao { get; set; }

        [Column("NoiDung")]
        public string? NoiDung { get; set; }

        [Column("NgayDG")]
        public DateTime? NgayDG { get; set; }

        // Navigation Properties kết nối khóa ngoại
        [ForeignKey("MaKH")]
        public virtual KhachHang? KhachHang { get; set; }

        [ForeignKey("MaSP")]
        public virtual SanPham? SanPham { get; set; }

        [ForeignKey("MaDH")]
        public virtual DonHang DonHang { get; set; } = null!;
    }
}
