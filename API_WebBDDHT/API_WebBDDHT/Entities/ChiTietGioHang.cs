using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("ChiTietGioHang")]
    public class ChiTietGioHang
    {
        [Column("MaGH")]
        public int MaGH { get; set; }

        [Column("MaSP")]
        public int MaSP { get; set; }

        [Column("SoLuong")]
        public int? SoLuong { get; set; }

        [Column("DonGia")]
        public decimal? DonGia { get; set; }

        [ForeignKey("MaGH")]
        public virtual GioHang GioHang { get; set; } = null!;
      
        [ForeignKey("MaSP")]
        public virtual SanPham SanPham { get; set; } = null!;
    }
}
