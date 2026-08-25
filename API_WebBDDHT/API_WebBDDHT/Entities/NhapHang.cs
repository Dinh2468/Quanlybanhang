using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("NhapHang")]
    public class NhapHang
    {
        [Key]
        [Column("MaNH")]
        public int MaNH { get; set; }

        [Column("MaNV")]
        public int? MaNV { get; set; }

        [Column("MaNCC")]
        public int? MaNCC { get; set; }

        [Column("NgayNhap")]
        public DateTime? NgayNhap { get; set; }

        [Column("TongTien")]
        public decimal? TongTien { get; set; }
        [Required]
        [StringLength(50)]
        [Column("TrangThai")]
        public string TrangThai { get; set; } = "Chờ Xác Nhận"; // "Chờ Xác Nhận", "Hoàn thành", "Đã hủy"

        [Required]
        [StringLength(50)]
        [Column("LoaiPhieu")]
        public string LoaiPhieu { get; set; } = "Nhập hàng"; // "Nhập hàng", "Điều chỉnh tăng", "Điều chỉnh giảm"
        // Khóa ngoại liên kết tới Nhân viên thực hiện nhập kho
        [ForeignKey("MaNV")]
        public virtual NhanVien? NhanVien { get; set; }

        // Khóa ngoại liên kết tới Nhà cung cấp giao hàng
        [ForeignKey("MaNCC")]
        public virtual NhaCungCap? NhaCungCap { get; set; }

        // Danh sách các mặt hàng nằm trong phiếu nhập này
        public virtual ICollection<ChiTietNhapHang> ChiTietNhapHangs { get; set; } = new List<ChiTietNhapHang>();


    }
}
