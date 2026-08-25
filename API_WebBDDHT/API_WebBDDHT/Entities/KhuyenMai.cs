using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("KhuyenMai")]
    public class KhuyenMai
    {
        [Key]
        [Column("MaKM")]
        public int MaKM { get; set; }

        [StringLength(100)]
        [Column("TenKM")]
        public string? TenKM { get; set; }

        [Column("NgayBatDau")]
        public DateTime? NgayBatDau { get; set; }

        [Column("NgayKetThuc")]
        public DateTime? NgayKetThuc { get; set; }

        [Column("PhanTramGiam")]
        public int? PhanTramGiam { get; set; }

        [Column("DieuKienApDung")]
        public string? DieuKienApDung { get; set; }

        // Mối quan hệ Nhiều - Nhiều với Sản Phẩm sẽ thông qua bảng trung gian được cấu hình ở DbContext
        public virtual ICollection<SanPham> SanPhams { get; set; } = new List<SanPham>();
    }
}
