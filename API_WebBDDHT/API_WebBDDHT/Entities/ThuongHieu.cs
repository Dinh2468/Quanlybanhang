using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("ThuongHieu")]
    public class ThuongHieu
    {
        [Key]
        [Column("MaTH")]
        public int MaTH { get; set; }

        [Required]
        [StringLength(100)]
        [Column("TenTH")]
        public string TenTH { get; set; } = null!;

        [StringLength(100)]
        [Column("QuocGia")]
        public string? QuocGia { get; set; }

        [Column("MoTa")]
        public string? MoTa { get; set; }

        // Mối quan hệ: Một thương hiệu có nhiều sản phẩm
        public virtual ICollection<SanPham> SanPhams { get; set; } = new List<SanPham>();
    }
}
