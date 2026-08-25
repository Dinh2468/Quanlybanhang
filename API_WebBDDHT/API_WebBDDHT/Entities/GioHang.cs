using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("GioHang")]
    public class GioHang
    {
        [Key]
        [Column("MaGH")]
        public int MaGH { get; set; }

        [Column("MaKH")]
        public int? MaKH { get; set; }

        [Column("CartToken")]
        public string? CartToken { get; set; }

        [Column("NgayCapNhat")]
        public DateTime? NgayCapNhat { get; set; }

        [Column("TongTien")]
        public decimal TongTien { get; set; } = 0;

        [ForeignKey("MaKH")]
        public virtual KhachHang? KhachHang { get; set; }

        public virtual ICollection<ChiTietGioHang> ChiTietGioHangs { get; set; } = new List<ChiTietGioHang>();

    }
}
