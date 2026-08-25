using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("HangKhachHang")]
    public class HangKhachHang
    {
        [Key]
        [Column("MaHang")]
        public int MaHang { get; set; }

        [Required]
        [StringLength(50)]
        [Column("TenHang")]
        public string TenHang { get; set; } = null!; // "Đồng", "Bạc", "Vàng", "Kim cương"

        [Column("DiemToiThieu")]
        public int DiemToiThieu { get; set; } 

        [Column("PhanTramUuDai")]
        public int PhanTramUuDai { get; set; } = 0; 

        // Mối quan hệ: Một hạng có thể áp dụng cho nhiều khách hàng
        public virtual ICollection<KhachHang> KhachHangs { get; set; } = new List<KhachHang>();
    }
}
