using Microsoft.EntityFrameworkCore;
using API_WebBDDHT.Entities;

namespace API_WebBDDHT.Data
{
    public class AppDbContext:DbContext
    {
        // Định nghĩa DbSet cho các thực thể của bạn
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<LoaiSP> LoaiSps { get; set; }
        public DbSet<SanPham> SanPhams { get; set; }
        public DbSet<TaiKhoan> TaiKhoans { get; set; }
        public DbSet<KhachHang> KhachHangs { get; set; }
        public DbSet<NhanVien> NhanViens { get; set; }
        public DbSet<ThuongHieu> ThuongHieus { get; set; }
        public DbSet<NhaCungCap> NhaCungCaps { get; set; }
        public DbSet<KhuyenMai> KhuyenMais { get; set; }
        public DbSet<GioHang> GioHangs { get; set; }
        public DbSet<ChiTietGioHang> ChiTietGioHangs { get; set; }
        public DbSet<DonHang> DonHangs { get; set; }
        public DbSet<ChiTietDonHang> ChiTietDonHangs { get; set; }
        public DbSet<DanhGia> DanhGias { get; set; }
        public DbSet<NhapHang> NhapHangs { get; set; }
        public DbSet<ChiTietNhapHang> ChiTietNhapHangs { get; set; }
        public DbSet<HangKhachHang> HangKhachHangs { get; set; }
        public DbSet<PhuongThucThanhToan> PhuongThucThanhToans { get; set; }
        public DbSet<SanPhamYeuThich> SanPhamYeuThiches { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình bảng SanPhamYeuThich
            modelBuilder.Entity<SanPhamYeuThich>()
                .HasKey(e => new { e.MaTK, e.MaSP });

            // Cấu hình bảng loaisp
            modelBuilder.Entity<LoaiSP>(entity =>
            {
                entity.HasKey(e => e.MaLoaiSP);
                entity.Property(e => e.MaLoaiSP).ValueGeneratedOnAdd(); // Tương đương IDENTITY(1,1)
                entity.Property(e => e.MoTa).HasColumnType("nvarchar(max)");
            });

            // Cấu hình bảng sanpham
            modelBuilder.Entity<SanPham>(entity =>
            {
                entity.HasKey(e => e.MaSP);
                entity.Property(e => e.MaSP).ValueGeneratedOnAdd();
                entity.Property(e => e.MoTa).HasColumnType("nvarchar(max)");

                // Định dạng tiền tệ VNĐ (không lấy số thập phân)
                entity.Property(e => e.Gia).HasColumnType("decimal(18,0)");
                entity.Property(e => e.HinhAnh).HasColumnType("nvarchar(max)");

                // Cấu hình tường minh mối quan hệ 1 - Nhiều bảo vệ toàn vẹn dữ liệu
                entity.HasOne(d => d.LoaiSP)
                      .WithMany(p => p.SanPhams)
                      .HasForeignKey(d => d.MaLoai)
                      .OnDelete(DeleteBehavior.Restrict);

                // THÊM: Khóa ngoại tới ThuongHieu
                entity.HasOne(d => d.ThuongHieu)
                      .WithMany(p => p.SanPhams)
                      .HasForeignKey(d => d.MaTH)
                      .OnDelete(DeleteBehavior.Restrict);
            });
            // Cấu hình bảng thuonghieu
            modelBuilder.Entity<ThuongHieu>(entity => {
                entity.HasKey(e => e.MaTH);
                entity.Property(e => e.MaTH).ValueGeneratedOnAdd();
                entity.Property(e => e.TenTH).IsRequired().HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(e => e.QuocGia).HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(e => e.MoTa).HasColumnType("nvarchar(max)");
            });
            // Cấu hình bảng nhacungcap
            modelBuilder.Entity<NhaCungCap>(entity => {
                entity.HasKey(e => e.MaNCC);
                entity.Property(e => e.MaNCC).ValueGeneratedOnAdd();
                entity.Property(e => e.TenNCC).IsRequired().HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(e => e.DiaChi).HasColumnType("nvarchar(max)");
                entity.Property(e => e.SDT).HasMaxLength(20).IsUnicode(false);
                entity.Property(e => e.Email).HasMaxLength(100).IsUnicode(false);
            });
            // Cấu hình bảng khuyenmai và mối quan hệ Nhiều - Nhiều với sanpham thông qua bảng trung gian sp_km
            modelBuilder.Entity<KhuyenMai>(entity => {
                entity.HasKey(e => e.MaKM);
                entity.Property(e => e.MaKM).ValueGeneratedOnAdd();
                entity.Property(e => e.TenKM).HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(e => e.NgayBatDau).HasColumnType("date");
                entity.Property(e => e.NgayKetThuc).HasColumnType("date");
                entity.Property(e => e.DieuKienApDung).HasColumnType("nvarchar(max)");

                // Thiết lập mối quan hệ Nhiều - Nhiều bằng Fluent API cực kỳ chuyên nghiệp
                entity.HasMany(d => d.SanPhams)
                      .WithMany(p => p.KhuyenMais)
                      .UsingEntity<Dictionary<string, object>>(
                          "sp_km", // Tên bảng trung gian khớp y chang DB cũ
                          l => l.HasOne<SanPham>().WithMany().HasForeignKey("MaSP").OnDelete(DeleteBehavior.Cascade),
                          r => r.HasOne<KhuyenMai>().WithMany().HasForeignKey("MaKM").OnDelete(DeleteBehavior.Cascade),
                          je => {
                              je.HasKey("MaSP", "MaKM"); // Tạo khóa chính phức hợp
                          });
            });
            // Cấu hình bảng taikhoan
            modelBuilder.Entity<TaiKhoan>(entity =>
            {
                entity.HasKey(e => e.MaTK);
                entity.Property(e => e.MaTK).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.TenDangNhap).IsUnique(); // Tạo chỉ mục UNIQUE chống trùng lặp tài khoản
                entity.Property(e => e.TenDangNhap).HasMaxLength(50).IsUnicode(false); // Lưu chuỗi ASCII không dấu
                entity.Property(e => e.MatKhau).HasMaxLength(255).IsUnicode(false);
                entity.Property(e => e.Email).HasMaxLength(100).IsUnicode(false);
                entity.Property(e => e.VaiTro).HasMaxLength(50).HasColumnType("nvarchar(50)");
                entity.Property(e => e.TrangThai).HasDefaultValue(true); // Mặc định tài khoản được kích hoạt (1)
                entity.Property(e => e.Avatar).HasMaxLength(255).IsUnicode(false);
            });
            // Cấu hình bảng khachhang
            modelBuilder.Entity<KhachHang>(entity =>
            {
                entity.HasKey(e => e.MaKH);
                entity.Property(e => e.MaKH).ValueGeneratedOnAdd();
                entity.Property(e => e.HoTen).IsRequired().HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(e => e.SDT).HasMaxLength(20).IsUnicode(false);
                entity.Property(e => e.DiaChi).HasColumnType("nvarchar(max)");        
                entity.Property(e => e.DiemTichLuy).HasDefaultValue(0);

                // Thiết lập khóa ngoại tới bảng HangKhachHang
                entity.HasOne(d => d.HangKhachHang)
                      .WithMany(p => p.KhachHangs)
                      .HasForeignKey(d => d.MaHang)
                      .OnDelete(DeleteBehavior.Restrict); // Tránh xóa nhầm hạng làm mất data khách
           
                // Cấu hình mối quan hệ: Khi xóa tài khoản, hồ sơ khách hàng tự động đặt MaTK về NULL (Tránh lỗi cascade delete lồng nhau)
                entity.HasOne(d => d.TaiKhoan)
                      .WithOne(p => p.KhachHang)
                      .HasForeignKey<KhachHang>(d => d.MaTK)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Cấu hình bảng nhanvien
            modelBuilder.Entity<NhanVien>(entity =>
            {
                entity.HasKey(e => e.MaNV);
                entity.Property(e => e.MaNV).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.MaSoNhanVien).IsUnique();
                entity.Property(e => e.MaSoNhanVien).HasMaxLength(20).IsUnicode(false);
                entity.Property(e => e.HoTen).IsRequired().HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(e => e.GioiTinh).HasMaxLength(10).HasColumnType("nvarchar(10)");
                entity.Property(e => e.NgaySinh).HasColumnType("date"); // Ép kiểu xuống đúng định dạng DATE (không lấy giờ) trong SQL
                entity.Property(e => e.SDT).HasMaxLength(20).IsUnicode(false);
                entity.Property(e => e.DiaChi).HasColumnType("nvarchar(max)");

                // Cấu hình mối quan hệ tương tự cho Nhân viên
                entity.HasOne(d => d.TaiKhoan)
                      .WithOne(p => p.NhanVien)
                      .HasForeignKey<NhanVien>(d => d.MaTK)
                      .OnDelete(DeleteBehavior.SetNull);
            });
            // Cấu hình bảng giohang
            modelBuilder.Entity<GioHang>(entity => {
                entity.HasKey(e => e.MaGH);
                entity.Property(e => e.MaGH).ValueGeneratedOnAdd();
                entity.Property(e => e.TongTien).HasColumnType("decimal(18,0)");
                entity.Property(e => e.NgayCapNhat).HasColumnType("date");
                entity.Property(e => e.CartToken).HasMaxLength(100).IsUnicode(false);

                entity.HasOne(d => d.KhachHang)
                      .WithMany() // Một khách hàng có thể có nhiều giỏ lịch sử (hoặc đổi thành WithOne tùy ý)
                      .HasForeignKey(d => d.MaKH)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Cấu hình bảng chitietgh (Khóa chính phức hợp)
            modelBuilder.Entity<ChiTietGioHang>(entity => {
                entity.HasKey(e => new { e.MaGH, e.MaSP }); // Thiết lập khóa chính gồm 2 cột
                entity.Property(e => e.DonGia).HasColumnType("decimal(18,0)");

                entity.HasOne(d => d.GioHang)
                      .WithMany(p => p.ChiTietGioHangs)
                      .HasForeignKey(d => d.MaGH)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.SanPham)
                      .WithMany()
                      .HasForeignKey(d => d.MaSP)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Cấu hình bảng donhang
            modelBuilder.Entity<DonHang>(entity => {
                entity.HasKey(e => e.MaDH);
                entity.Property(e => e.MaDH).ValueGeneratedOnAdd();
                entity.Property(e => e.HoTenNguoiNhan).HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(e => e.SDTNguoiNhan).HasMaxLength(20).IsUnicode(false);
                entity.Property(e => e.TrangThai).HasMaxLength(50).HasColumnType("nvarchar(50)");
                entity.Property(e => e.TongTien).HasColumnType("decimal(18,0)");
                entity.Property(e => e.NgayDat).HasColumnType("datetime");
                entity.Property(e => e.DiaChiGiaoHang).HasColumnType("nvarchar(max)");
                entity.Property(e => e.GhiChu).HasColumnType("nvarchar(max)");
                entity.Property(e => e.TrangThaiThanhToan).HasMaxLength(50).HasColumnType("nvarchar(50)").HasDefaultValue("Chưa thanh toán");

                entity.HasOne(d => d.KhachHang)
                      .WithMany()
                      .HasForeignKey(d => d.MaKH)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.KhachHang)
                      .WithMany()
                      .HasForeignKey(d => d.MaKH)
                      .OnDelete(DeleteBehavior.Restrict); // Dùng Restrict để tránh lỗi nhiều đường dẫn Cascade của SQL Server
            });

            // Cấu hình bảng chitietdh (Khóa chính phức hợp) 
            modelBuilder.Entity<ChiTietDonHang>(entity => {
                entity.HasKey(e => new { e.MaDH, e.MaSP });
                entity.Property(e => e.DonGia).HasColumnType("decimal(18,0)");

                entity.HasOne(d => d.DonHang)
                      .WithMany(p => p.ChiTietDonHangs)
                      .HasForeignKey(d => d.MaDH)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.SanPham)
                      .WithMany()
                      .HasForeignKey(d => d.MaSP)
                      .OnDelete(DeleteBehavior.Restrict);
            });
            // Cấu hình bảng danhgia
            modelBuilder.Entity<DanhGia>(entity => {
                entity.HasKey(e => e.MaDG);
                entity.Property(e => e.MaDG).ValueGeneratedOnAdd(); // IDENTITY(1,1)
                entity.Property(e => e.NoiDung).HasColumnType("nvarchar(max)");
                entity.Property(e => e.NgayDG).HasColumnType("date");

                // Ràng buộc tới bảng Khách Hàng
                entity.HasOne(d => d.KhachHang)
                      .WithMany()
                      .HasForeignKey(d => d.MaKH)
                      .OnDelete(DeleteBehavior.Restrict);

                // Ràng buộc tới bảng Sản Phẩm
                entity.HasOne(d => d.SanPham)
                      .WithMany()
                      .HasForeignKey(d => d.MaSP)
                      .OnDelete(DeleteBehavior.Restrict);

                // Ràng buộc tới bảng Đơn Hàng (Khi xóa Đơn hàng thì xóa luôn Đánh giá liên quan)
                entity.HasOne(d => d.DonHang)
                      .WithMany(p => p.DanhGias)
                      .HasForeignKey(d => d.MaDH)
                      .OnDelete(DeleteBehavior.Cascade);
            });
            // Cấu hình bảng nhaphang
            modelBuilder.Entity<NhapHang>(entity => {
                entity.HasKey(e => e.MaNH);
                entity.Property(e => e.MaNH).ValueGeneratedOnAdd();
                entity.Property(e => e.NgayNhap).HasColumnType("date");
                entity.Property(e => e.TongTien).HasColumnType("decimal(18,0)"); // Tiền tệ VNĐ

                entity.HasOne(d => d.NhanVien)
                      .WithMany()
                      .HasForeignKey(d => d.MaNV)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.NhaCungCap)
                      .WithMany()
                      .HasForeignKey(d => d.MaNCC)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Cấu hình bảng chitietnh (Khóa chính phức hợp gồm MaNH và MaSP)
            modelBuilder.Entity<ChiTietNhapHang>(entity => {
                entity.HasKey(e => new { e.MaNH, e.MaSP });
                entity.Property(e => e.DonGia).HasColumnType("decimal(18,0)");

                entity.HasOne(d => d.NhapHang)
                      .WithMany(p => p.ChiTietNhapHangs)
                      .HasForeignKey(d => d.MaNH)
                      .OnDelete(DeleteBehavior.Cascade); // Khi xóa phiếu nhập chính, tự động xóa sạch các dòng chi tiết của phiếu đó

                entity.HasOne(d => d.SanPham)
                      .WithMany()
                      .HasForeignKey(d => d.MaSP)
                      .OnDelete(DeleteBehavior.Restrict);
            });
            // Cấu hình bảng hangkhachhang
            modelBuilder.Entity<HangKhachHang>(entity => {
                entity.HasKey(e => e.MaHang);
                entity.Property(e => e.MaHang).ValueGeneratedOnAdd();
                entity.Property(e => e.TenHang).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
                entity.Property(e => e.DiemToiThieu).HasDefaultValue(0);
                entity.Property(e => e.PhanTramUuDai).HasDefaultValue(0);
            });
            // Cấu hình bảng phuongthucthanhtoan
            modelBuilder.Entity<PhuongThucThanhToan>(entity => {
                entity.HasKey(e => e.MaPTTT);
                entity.Property(e => e.MaPTTT).ValueGeneratedOnAdd(); // IDENTITY(1,1)

                entity.Property(e => e.TenPhuongThuc).IsRequired().HasMaxLength(100).HasColumnType("nvarchar(100)");

                // Tạo Index UNIQUE cho MaCode để code Backend kiểm tra không bị trùng lắp (COD, VNPAY, MOMO)
                entity.HasIndex(e => e.MaCode).IsUnique();
                entity.Property(e => e.MaCode).IsRequired().HasMaxLength(50).IsUnicode(false);

                entity.Property(e => e.HinhAnh).HasMaxLength(255).IsUnicode(false);
                entity.Property(e => e.GhiChu).HasColumnType("nvarchar(max)");
                entity.Property(e => e.TrangThai).HasDefaultValue(true); // Mặc định là cho phép hoạt động
            });

            // Gọi phương thức SeedData để thêm dữ liệu mẫu vào cơ sở dữ liệu
            modelBuilder.SeedData();
        }
    }
}
