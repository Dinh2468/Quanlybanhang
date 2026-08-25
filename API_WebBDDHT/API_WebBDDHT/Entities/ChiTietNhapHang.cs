using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("ChiTietNhapHang")]
    public class ChiTietNhapHang
    {
        [Column("MaNH")]
        public int MaNH { get; set; }

        [Column("MaSP")]
        public int MaSP { get; set; }

        [Column("SoLuong")]
        public int? SoLuong { get; set; }

        [Column("SoLuongConLai")]
        public int? SoLuongConLai { get; set; }
        [Column("DonGia")]
        public decimal? DonGia { get; set; }

        [ForeignKey("MaNH")]
        public virtual NhapHang NhapHang { get; set; } = null!;

        [ForeignKey("MaSP")]
        public virtual SanPham SanPham { get; set; } = null!;
    }
}
