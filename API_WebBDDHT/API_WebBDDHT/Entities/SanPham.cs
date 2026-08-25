using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("SanPham")]
    public class SanPham
    {
        [Key]
        [Column("MaSP")]
        public int MaSP { get; set; }

        [Required]
        [StringLength(100)]
        [Column("TenSP")]
        public string TenSP { get; set; } = null!;

        [Column("MoTa")]
        public string? MoTa { get; set; }

        [Column("Gia")]
        public decimal? Gia { get; set; }

        [Column("SoLuongTon")]
        public int SoLuongTon { get; set; } = 0;

        [Column("HinhAnh")]
        public string? HinhAnh { get; set; }

        [Column("CanNang")]
        public int CanNang { get; set; } = 300; // Đơn vị: gram, mặc định 300g

        [Column("MaLoai")]
        public int? MaLoai { get; set; }

        [Column("MaTH")]
        public int? MaTH { get; set; }

        // Khai báo mối quan hệ ngược lại: Một sản phẩm chỉ thuộc về một loại sản phẩm cố định
        [ForeignKey("MaLoai")]
        public virtual LoaiSP? LoaiSP { get; set; }

        [ForeignKey("MaTH")]
        public virtual ThuongHieu? ThuongHieu { get; set; }

        // Chứa danh sách các chương trình khuyến mãi áp dụng cho sản phẩm này
        public virtual ICollection<KhuyenMai> KhuyenMais { get; set; } = new List<KhuyenMai>();

        [Column("TrangThaiHienThi")]
        public bool TrangThaiHienThi { get; set; } = true;
    }
}
