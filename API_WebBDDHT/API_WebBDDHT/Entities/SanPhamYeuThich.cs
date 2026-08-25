using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("SanPhamYeuThich")]
    public class SanPhamYeuThich
    {
        [Column("MaTK")]
        public int MaTK { get; set; }

        [Column("MaSP")]
        public int MaSP { get; set; }

        [Column("NgayThem")]
        public DateTime NgayThem { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("MaTK")]
        public virtual TaiKhoan? TaiKhoan { get; set; }

        [ForeignKey("MaSP")]
        public virtual SanPham? SanPham { get; set; }
    }
}
