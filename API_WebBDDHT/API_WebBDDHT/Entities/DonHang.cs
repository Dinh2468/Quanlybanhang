using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("DonHang")]
    public class DonHang
    {
        [Key]
        [Column("MaDH")]
        public int MaDH { get; set; }

        [Column("MaKH")]
        public int? MaKH { get; set; }

        [StringLength(100)]
        [Column("HoTenNguoiNhan")]
        public string? HoTenNguoiNhan { get; set; }

        [StringLength(20)]
        [Column("SDTNguoiNhan")]
        public string? SDTNguoiNhan { get; set; }

        [Column("NgayDat")]
        public DateTime? NgayDat { get; set; }

        [StringLength(50)]
        [Column("TrangThai")]
        public string? TrangThai { get; set; }

        [Column("TongTien")]
        public decimal? TongTien { get; set; }

        [Column("DiaChiGiaoHang")]
        public string? DiaChiGiaoHang { get; set; }

        [Column("GhiChu")]
        public string? GhiChu { get; set; }

        [ForeignKey("MaKH")]
        public virtual KhachHang? KhachHang { get; set; }

        public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();
        public virtual ICollection<DanhGia> DanhGias { get; set; } = new List<DanhGia>();

        [Column("MaPTTT")]
        public int? MaPTTT { get; set; } // Khóa ngoại trỏ sang bảng phương thức thanh toán

        [StringLength(50)]
        [Column("TrangThaiThanhToan")]
        public string TrangThaiThanhToan { get; set; } = "Chưa thanh toán"; // "Chưa thanh toán", "Đã thanh toán", "Đang xử lý"

        [ForeignKey("MaPTTT")]
        public virtual PhuongThucThanhToan? PhuongThucThanhToan { get; set; }

        [StringLength(100)]
        [Column("MaGiaoDịchNgoai")]
        public string? MaGiaoDichNgoai { get; set; } // Lưu mã giao dịch trả về từ VNPAY/MoMo để sau này đối soát tiền

        [StringLength(100)]
        [Column("MaVanDonGHN")]
        public string? MaVanDonGHN { get; set; } // Lưu mã vận đơn Giao Hàng Nhanh

        [Column("MaQuanHuyen")]
        public int? MaQuanHuyen { get; set; } // Mã Quận/Huyện GHN

        [StringLength(50)]
        [Column("MaPhuongXa")]
        public string? MaPhuongXa { get; set; } // Mã Phường/Xã GHN
    }
}
