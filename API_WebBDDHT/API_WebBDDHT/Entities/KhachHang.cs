using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("KhachHang")]
    public class KhachHang
    {
        [Key]
        [Column("MaKH")]
        public int MaKH { get; set; }

        [Required]
        [StringLength(100)]
        [Column("HoTen")]
        public string HoTen { get; set; } = null!;

        [StringLength(20)]
        [Column("SDT")]
        public string? SDT { get; set; }

        [Column("DiaChi")]
        public string? DiaChi { get; set; }

        [Column("MaTK")]
        public int? MaTK { get; set; }

        // Navigation Property trỏ về Tài Khoản
        [ForeignKey("MaTK")]
        public virtual TaiKhoan? TaiKhoan { get; set; }

        [Column("DiemTichLuy")]
        public int DiemTichLuy { get; set; } = 0; 

        [Column("MaHang")]
        public int? MaHang { get; set; }

        // Navigation Property trỏ về Hạng Khách Hàng
        [ForeignKey("MaHang")]
        public virtual HangKhachHang? HangKhachHang { get; set; }
    }
}
