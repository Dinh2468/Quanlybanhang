using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("NhanVien")]
    public class NhanVien
    {
        [Key]
        [Column("MaNV")]
        public int MaNV { get; set; }

        // Mã số nhân viên để hiển thị "NV001", "NV002", ... thay vì số nguyên tự tăng giúp hiển thị đẹp hơn 
        [Required]
        [StringLength(20)]
        [Column("MaSoNhanVien")]
        public string MaSoNhanVien { get; set; } = null!;


        [Required]
        [StringLength(100)]
        [Column("HoTen")]
        public string HoTen { get; set; } = null!;

        [StringLength(10)]
        [Column("GioiTinh")]
        public string? GioiTinh { get; set; }

        [Column("NgaySinh")]
        public DateTime? NgaySinh { get; set; } // Kiểu DATE trong SQL ánh xạ thành DateTime trong C#

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
    }
}
