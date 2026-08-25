using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("LoaiSP")]
    public class LoaiSP
    {
        [Key]
        [Column("MaLoaiSP")]
        public int MaLoaiSP { get; set; }

        [Required]
        [StringLength(100)]
        [Column("TenLoai")]
        public string TenLoai { get; set; } = null!;

        [Column("MoTa")]
        public string? MoTa { get; set; }

        // Mối quan hệ: Một loại sản phẩm có thể chứa nhiều sản phẩm bên trong
        public virtual ICollection<SanPham> SanPhams { get; set; } = new List<SanPham>();
    }
}
