using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("ChiTietDonHang")]
    public class ChiTietDonHang
    {
        [Column("MaDH")]
        public int MaDH { get; set; }

        [Column("MaSP")]
        public int MaSP { get; set; }

        [Column("SoLuong")]
        public int SoLuong { get; set; }

        [Column("DonGia")]
        public decimal DonGia { get; set; }

        [ForeignKey("MaDH")]
        public virtual DonHang DonHang { get; set; } = null!;

        [ForeignKey("MaSP")]
        public virtual SanPham SanPham { get; set; } = null!;
    }
}
