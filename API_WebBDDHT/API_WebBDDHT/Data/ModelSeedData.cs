using API_WebBDDHT.Entities;
using Microsoft.EntityFrameworkCore;

namespace API_WebBDDHT.Data
{
    public static class ModelSeedData
    {
        public static void SeedData(this ModelBuilder modelBuilder)
        {
            // =========================================================================
            // 1. TAIKHOAN (10 mẫu)
            // =========================================================================
            modelBuilder.Entity<TaiKhoan>().HasData(
                new TaiKhoan { MaTK = 1, TenDangNhap = "admin", MatKhau = "hashed_pwd_1", Email = "admin@vpp.com", VaiTro = "Quản trị viên", TrangThai = true },
                new TaiKhoan { MaTK = 2, TenDangNhap = "nv_dung", MatKhau = "hashed_pwd_2", Email = "dung@vpp.com", VaiTro = "Nhân viên", TrangThai = true },
                new TaiKhoan { MaTK = 3, TenDangNhap = "kh_lan", MatKhau = "hashed_pwd_3", Email = "lan@gmail.com", VaiTro = "Khách hàng", TrangThai = true },
                new TaiKhoan { MaTK = 4, TenDangNhap = "kh_nam", MatKhau = "hashed_pwd_4", Email = "nam@gmail.com", VaiTro = "Khách hàng", TrangThai = true },
                new TaiKhoan { MaTK = 5, TenDangNhap = "nv_hoa", MatKhau = "hashed_pwd_5", Email = "hoa@vpp.com", VaiTro = "Nhân viên", TrangThai = true },
                new TaiKhoan { MaTK = 6, TenDangNhap = "nv_minh", MatKhau = "hashed_pwd_6", Email = "minh@vpp.com", VaiTro = "Nhân viên", TrangThai = true },
                new TaiKhoan { MaTK = 7, TenDangNhap = "kh_vy", MatKhau = "hashed_pwd_7", Email = "vy@gmail.com", VaiTro = "Khách hàng", TrangThai = true },
                new TaiKhoan { MaTK = 8, TenDangNhap = "kh_tu", MatKhau = "hashed_pwd_8", Email = "tu@gmail.com", VaiTro = "Khách hàng", TrangThai = true },
                new TaiKhoan { MaTK = 9, TenDangNhap = "kh_linh", MatKhau = "hashed_pwd_9", Email = "linh@gmail.com", VaiTro = "Khách hàng", TrangThai = true },
                new TaiKhoan { MaTK = 10, TenDangNhap = "kh_khoi", MatKhau = "hashed_pwd_10", Email = "khoi@gmail.com", VaiTro = "Khách hàng", TrangThai = true }
            );

            // =========================================================================
            // 2. HANGKHACHHANG (10 mẫu)
            // =========================================================================
            modelBuilder.Entity<HangKhachHang>().HasData(
                new HangKhachHang { MaHang = 1, TenHang = "Đồng", DiemToiThieu = 0, PhanTramUuDai = 0 },
                new HangKhachHang { MaHang = 2, TenHang = "Bạc", DiemToiThieu = 100, PhanTramUuDai = 2 },
                new HangKhachHang { MaHang = 3, TenHang = "Vàng", DiemToiThieu = 500, PhanTramUuDai = 5 },
                new HangKhachHang { MaHang = 4, TenHang = "Bạch Kim", DiemToiThieu = 1000, PhanTramUuDai = 7 },
                new HangKhachHang { MaHang = 5, TenHang = "Kim Cương", DiemToiThieu = 2000, PhanTramUuDai = 10 },
                new HangKhachHang { MaHang = 6, TenHang = "Sử dụng thử", DiemToiThieu = -1, PhanTramUuDai = 0 },
                new HangKhachHang { MaHang = 7, TenHang = "Thành viên mới", DiemToiThieu = 1, PhanTramUuDai = 1 },
                new HangKhachHang { MaHang = 8, TenHang = "Thân thiết", DiemToiThieu = 300, PhanTramUuDai = 3 },
                new HangKhachHang { MaHang = 9, TenHang = "VIP Độc Quyền", DiemToiThieu = 5000, PhanTramUuDai = 12 },
                new HangKhachHang { MaHang = 10, TenHang = "Đối tác doanh nghiệp", DiemToiThieu = 10000, PhanTramUuDai = 15 }
            );

            // =========================================================================
            // 3. KHACHHANG (10 mẫu - Kết nối chéo với MaTK 3,4,7,8,9,10 và MaHang)
            // =========================================================================
            modelBuilder.Entity<KhachHang>().HasData(
                new KhachHang { MaKH = 1, HoTen = "Nguyễn Thúy Lan", SDT = "0901234567", DiaChi = "123 Nguyễn Trãi, Q5, HCM", MaTK = 3, DiemTichLuy = 150, MaHang = 2 },
                new KhachHang { MaKH = 2, HoTen = "Trần Hoàng Nam", SDT = "0918889999", DiaChi = "456 Lê Lợi, Q1, HCM", MaTK = 4, DiemTichLuy = 20, MaHang = 1 },
                new KhachHang { MaKH = 3, HoTen = "Phạm Thúy Vy", SDT = "0933111222", DiaChi = "789 Điện Biên Phủ, Bình Thạnh, HCM", MaTK = 7, DiemTichLuy = 600, MaHang = 3 },
                new KhachHang { MaKH = 4, HoTen = "Hoàng Anh Tú", SDT = "0944222333", DiaChi = "321 Trần Hưng Đạo, Q1, HCM", MaTK = 8, DiemTichLuy = 1200, MaHang = 4 },
                new KhachHang { MaKH = 5, HoTen = "Đỗ Thùy Linh", SDT = "0955333444", DiaChi = "159 Lý Thường Kiệt, Q11, HCM", MaTK = 9, DiemTichLuy = 2500, MaHang = 5 },
                new KhachHang { MaKH = 6, HoTen = "Nguyễn Minh Khôi", SDT = "0966444555", DiaChi = "753 Lê Văn Sỹ, Q3, HCM", MaTK = 10, DiemTichLuy = 5, MaHang = 7 },
                new KhachHang { MaKH = 7, HoTen = "Lê Thị Mai", SDT = "0977555666", DiaChi = "852 Hùng Vương, Q5, HCM", MaTK = null, DiemTichLuy = 350, MaHang = 8 },
                new KhachHang { MaKH = 8, HoTen = "Vũ Hoàng Long", SDT = "0988666777", DiaChi = "963 Nguyễn Kiệm, Gò Vấp, HCM", MaTK = null, DiemTichLuy = 0, MaHang = 1 },
                new KhachHang { MaKH = 9, HoTen = "Ngô Quốc Bảo", SDT = "0999777888", DiaChi = "147 Cộng Hòa, Tân Bình, HCM", MaTK = null, DiemTichLuy = 5200, MaHang = 9 },
                new KhachHang { MaKH = 10, HoTen = "Bùi Kim Yến", SDT = "0909888999", DiaChi = "369 Trường Chinh, Tân Bình, HCM", MaTK = null, DiemTichLuy = 10500, MaHang = 10 }
            );

            // =========================================================================
            // 4. NHANVIEN (10 mẫu - Kết nối với MaTK 2,5,6)
            // =========================================================================
            modelBuilder.Entity<NhanVien>().HasData(
                new NhanVien { MaNV = 1, MaSoNhanVien = "NV001", HoTen = "Lê Văn Dũng", GioiTinh = "Nam", NgaySinh = new DateTime(1995, 5, 20), SDT = "0987654321", DiaChi = "789 Cách Mạng Tháng 8, HCM", MaTK = 2 },
                new NhanVien { MaNV = 2, MaSoNhanVien = "NV002", HoTen = "Nguyễn Thị Hoa", GioiTinh = "Nữ", NgaySinh = new DateTime(1997, 8, 15), SDT = "0912345678", DiaChi = "12 Lạc Long Quân, Q11, HCM", MaTK = 5 },
                new NhanVien { MaNV = 3, MaSoNhanVien = "NV003", HoTen = "Trần Quang Minh", GioiTinh = "Nam", NgaySinh = new DateTime(1993, 12, 10), SDT = "0934567890", DiaChi = "45 Phan Đăng Lưu, Phú Nhuận, HCM", MaTK = 6 },
                new NhanVien { MaNV = 4, MaSoNhanVien = "NV004", HoTen = "Phạm Minh Tuấn", GioiTinh = "Nam", NgaySinh = new DateTime(1994, 3, 22), SDT = "0967890123", DiaChi = "150 Khánh Hội, Q4, HCM", MaTK = null },
                new NhanVien { MaNV = 5, MaSoNhanVien = "NV005", HoTen = "Lê Thùy Dương", GioiTinh = "Nữ", NgaySinh = new DateTime(1998, 10, 5), SDT = "0978901234", DiaChi = "88 Ba Tháng Hai, Q10, HCM", MaTK = null },
                new NhanVien { MaNV = 6, MaSoNhanVien = "NV006", HoTen = "Đặng Hoàng Long", GioiTinh = "Nam", NgaySinh = new DateTime(1991, 1, 30), SDT = "0989012345", DiaChi = "202 Phạm Văn Đồng, Thủ Đức, HCM", MaTK = null },
                new NhanVien { MaNV = 7, MaSoNhanVien = "NV007", HoTen = "Bùi Tuyết Nhung", GioiTinh = "Nữ", NgaySinh = new DateTime(1996, 7, 18), SDT = "0923456789", DiaChi = "315 Võ Văn Kiệt, Q1, HCM", MaTK = null },
                new NhanVien { MaNV = 8, MaSoNhanVien = "NV008", HoTen = "Vũ Anh Đức", GioiTinh = "Nam", NgaySinh = new DateTime(1992, 11, 25), SDT = "0945678901", DiaChi = "14 Nguyễn Văn Cừ, Q5, HCM", MaTK = null },
                new NhanVien { MaNV = 9, MaSoNhanVien = "NV009", HoTen = "Nguyễn Thu Hà", GioiTinh = "Nữ", NgaySinh = new DateTime(1999, 4, 12), SDT = "0956789012", DiaChi = "67 Hoàng Văn Thụ, Tân Bình, HCM", MaTK = null },
                new NhanVien { MaNV = 10, MaSoNhanVien = "NV010", HoTen = "Đỗ Quốc Huy", GioiTinh = "Nam", NgaySinh = new DateTime(1995, 9, 8), SDT = "0901234544", DiaChi = "99 Nguyễn Oanh, Gò Vấp, HCM", MaTK = null }
            );

            // =========================================================================
            // 5. LOAISP (10 mẫu)
            // =========================================================================
            modelBuilder.Entity<LoaiSP>().HasData(
                new LoaiSP { MaLoaiSP = 1, TenLoai = "Bút - Viết", MoTa = "Các loại bút bi, bút chì, dạ quang" },
                new LoaiSP { MaLoaiSP = 2, TenLoai = "Sổ - Tập - Vở", MoTa = "Sổ tay, tập học sinh" },
                new LoaiSP { MaLoaiSP = 3, TenLoai = "Giấy các loại", MoTa = "Giấy in A4, giấy note" },
                new LoaiSP { MaLoaiSP = 4, TenLoai = "Dụng cụ học tập & Máy tính", MoTa = "Máy tính Casio, thước kẻ, gôm" },
                new LoaiSP { MaLoaiSP = 5, TenLoai = "Bìa hồ sơ & Lưu trữ", MoTa = "Bìa lá, bìa còng, cặp nhựa lưu tài liệu" },
                new LoaiSP { MaLoaiSP = 6, TenLoai = "Băng keo & Hồ dán", MoTa = "Băng keo trong, hồ khô, hồ nước" },
                new LoaiSP { MaLoaiSP = 7, TenLoai = "Dụng cụ văn phòng vỏ gỗ/kim loại", MoTa = "Bàn ghim, bấm kim, đục lỗ, kẹp bướm" },
                new LoaiSP { MaLoaiSP = 8, TenLoai = "Mực & Nhu yếu phẩm văn phòng", MoTa = "Mực dấu, mực viết máy, mực máy in" },
                new LoaiSP { MaLoaiSP = 9, TenLoai = "Quà tặng & Đồ lưu niệm", MoTa = "Bút ký cao cấp, hộp quà, thiệp chúc mừng" },
                new LoaiSP { MaLoaiSP = 10, TenLoai = "Thiết bị điện văn phòng nhỏ", MoTa = "Máy ép nhựa, máy hủy giấy mini, đèn bàn" }
            );

            // =========================================================================
            // 6. THUONGHIEU (10 mẫu)
            // =========================================================================
            modelBuilder.Entity<ThuongHieu>().HasData(
                new ThuongHieu { MaTH = 1, TenTH = "Thiên Long", QuocGia = "Việt Nam", MoTa = "Văn phòng phẩm quốc dân" },
                new ThuongHieu { MaTH = 2, TenTH = "Casio", QuocGia = "Nhật Bản", MoTa = "Máy tính bỏ túi hàng đầu" },
                new ThuongHieu { MaTH = 3, TenTH = "Double A", QuocGia = "Thái Lan", MoTa = "Giấy in cao cấp" },
                new ThuongHieu { MaTH = 4, TenTH = "Campus", QuocGia = "Nhật Bản", MoTa = "Tập sổ tay chất lượng cao" },
                new ThuongHieu { MaTH = 5, TenTH = "Plus", QuocGia = "Nhật Bản", MoTa = "Bấm kim, xóa kéo văn phòng" },
                new ThuongHieu { MaTH = 6, TenTH = "Deli", QuocGia = "Trung Quốc", MoTa = "Hệ sinh thái đồ dùng văn phòng giá tốt" },
                new ThuongHieu { MaTH = 7, TenTH = "Pentel", QuocGia = "Nhật Bản", MoTa = "Bút chì kim và mực cao cấp" },
                new ThuongHieu { MaTH = 8, TenTH = "PaperOne", QuocGia = "Indonesia", MoTa = "Giấy in văn phòng thân thiện môi trường" },
                new ThuongHieu { MaTH = 9, TenTH = "Parker", QuocGia = "Mỹ", MoTa = "Thương hiệu bút ký sang trọng cao cấp" },
                new ThuongHieu { MaTH = 10, TenTH = "Kế Thành", QuocGia = "Việt Nam", MoTa = "Sản xuất bìa da và sổ lưu trữ" }
            );

            // =========================================================================
            // 7. NHACUNGCAP (10 mẫu)
            // =========================================================================
            modelBuilder.Entity<NhaCungCap>().HasData(
                new NhaCungCap { MaNCC = 1, TenNCC = "Công ty CP Tập đoàn Thiên Long", DiaChi = "KCN Tân Tạo, Bình Tân, HCM", SDT = "02837505555", Email = "info@thienlong.vn" },
                new NhaCungCap { MaNCC = 2, TenNCC = "Nhà phân phối VPP Toàn Cầu", DiaChi = "P10, Q.Gò Vấp, HCM", SDT = "0944555666", Email = "toancauvpp@gmail.com" },
                new NhaCungCap { MaNCC = 3, TenNCC = "Công ty TNHH Deli Việt Nam", DiaChi = "KCN Đại Đồng, Bắc Ninh", SDT = "0243123456", Email = "contact@deli.vn" },
                new NhaCungCap { MaNCC = 4, TenNCC = "Tổng đại lý Giấy Hoàng Phát", DiaChi = "184 Quốc lộ 13, Thủ Đức, HCM", SDT = "0902445566", Email = "hoangphatpaper@gmail.com" },
                new NhaCungCap { MaNCC = 5, TenNCC = "Văn phòng phẩm Hồng Hà chi nhánh Nam", DiaChi = "Quận Tân Phú, HCM", SDT = "0283811223", Email = "mientay@hongha.vn" },
                new NhaCungCap { MaNCC = 6, TenNCC = "Công ty Thiết bị giáo dục Minh Đức", DiaChi = "Quận Liên Chiểu, Đà Nẵng", SDT = "0236355667", Email = "minhduc.edu@gmail.com" },
                new NhaCungCap { MaNCC = 7, TenNCC = "Nhà sách & Phân phối VPP Fahasa", DiaChi = "Nguyễn Huệ, Q1, HCM", SDT = "0283822544", Email = "import@fahasa.com" },
                new NhaCungCap { MaNCC = 8, TenNCC = "Cty TNHH Thương mại Phú Đạt", DiaChi = "Quận Hoàng Mai, Hà Nội", SDT = "0243999888", Email = "phudatvpp@yahoo.com" },
                new NhaCungCap { MaNCC = 9, TenNCC = "Doanh nghiệp Tư nhân Thành Công", DiaChi = "Ninh Kiều, Cần Thơ", SDT = "0292377788", Email = "thanhcongvpp@gmail.com" },
                new NhaCungCap { MaNCC = 10, TenNCC = "Công ty TNHH Xuất Nhập Khẩu Đại Dương", DiaChi = "Quận Hải An, Hải Phòng", SDT = "0225366677", Email = "oceanimex@vnn.vn" }
            );

            // =========================================================================
            // 8. SANPHAM (10 mẫu)
            // =========================================================================
            modelBuilder.Entity<SanPham>().HasData(
                new SanPham { MaSP = 1, TenSP = "Bút Bi Thiên Long TL-027", MoTa = "Bút bi bấm truyền thống, mực đều", Gia = 4000, SoLuongTon = 500, HinhAnh = "tl027.jpg", MaLoai = 1, MaTH = 1 },
                new SanPham { MaSP = 2, TenSP = "Sổ lò xo Campus A5 160 trang", MoTa = "Giấy chống lóa mắt, lò xo kép", Gia = 25000, SoLuongTon = 150, HinhAnh = "so_campus_a5.jpg", MaLoai = 2, MaTH = 4 },
                new SanPham { MaSP = 3, TenSP = "Thùng Giấy Double A A4 70gsm", MoTa = "Giấy in văn phòng trắng đẹp", Gia = 345000, SoLuongTon = 80, HinhAnh = "giay_double_a.jpg", MaLoai = 3, MaTH = 3 },
                new SanPham { MaSP = 4, TenSP = "Máy tính khoa học Casio FX-580VN X", MoTa = "Hỗ trợ 521 tính năng", Gia = 650000, SoLuongTon = 50, HinhAnh = "casio_580vnx.jpg", MaLoai = 4, MaTH = 2 },
                new SanPham { MaSP = 5, TenSP = "Bìa Còng Nhựa Plus A4 5cm", MoTa = "Lưu trữ hồ sơ số lượng lớn tiện lợi", Gia = 45000, SoLuongTon = 200, HinhAnh = "biacong_plus.jpg", MaLoai = 5, MaTH = 5 },
                new SanPham { MaSP = 6, TenSP = "Băng keo trong Deli 5cm x 100yard", MoTa = "Độ dính cao, dẻo dai chống rách", Gia = 15000, SoLuongTon = 400, HinhAnh = "bangkeo_deli.jpg", MaLoai = 6, MaTH = 6 },
                new SanPham { MaSP = 7, TenSP = "Bấm kim số 10 Deli kèm kim", MoTa = "Chất liệu thép không gỉ cán nhựa êm tay", Gia = 32000, SoLuongTon = 120, HinhAnh = "bamkim_deli.jpg", MaLoai = 7, MaTH = 6 },
                new SanPham { MaSP = 8, TenSP = "Hộp Mực Dấu Shiny SP-2 Đỏ", MoTa = "Mực đậm nét, lâu phai, không độc hại", Gia = 28000, SoLuongTon = 90, HinhAnh = "mucdau_shiny.jpg", MaLoai = 8, MaTH = 6 },
                new SanPham { MaSP = 9, TenSP = "Bút Ký Cao Cấp Parker IM Black GT", MoTa = "Vỏ sơn mài đen, cài bút mạ vàng sang trọng", Gia = 950000, SoLuongTon = 15, HinhAnh = "parker_im_black.jpg", MaLoai = 9, MaTH = 9 },
                new SanPham { MaSP = 10, TenSP = "Máy hủy giấy mini Deli 9911", MoTa = "Hủy vụn tài liệu bảo mật cao công suất nhỏ", Gia = 1850000, SoLuongTon = 10, HinhAnh = "mayhuygiay_deli.jpg", MaLoai = 10, MaTH = 6 }
            );

            // =========================================================================
            // 9. KHUYENMAI (10 mẫu)
            // =========================================================================
            modelBuilder.Entity<KhuyenMai>().HasData(
                new KhuyenMai { MaKM = 1, TenKM = "Chào Hè Rực Rỡ", NgayBatDau = new DateTime(2026, 6, 1), NgayKetThuc = new DateTime(2026, 6, 30), PhanTramGiam = 10, DieuKienApDung = "Áp dụng bút và tập" },
                new KhuyenMai { MaKM = 2, TenKM = "Mùa Tựu Trường", NgayBatDau = new DateTime(2026, 8, 1), NgayKetThuc = new DateTime(2026, 9, 5), PhanTramGiam = 15, DieuKienApDung = "Giảm giá máy tính" },
                new KhuyenMai { MaKM = 3, TenKM = "Ưu đãi Doanh Nghiệp Mới", NgayBatDau = new DateTime(2026, 1, 1), NgayKetThuc = new DateTime(2026, 12, 31), PhanTramGiam = 8, DieuKienApDung = "Đơn hàng giấy in từ 2 thùng" },
                new KhuyenMai { MaKM = 4, TenKM = "Xả Kho Cuối Quý 2", NgayBatDau = new DateTime(2026, 6, 15), NgayKetThuc = new DateTime(2026, 6, 25), PhanTramGiam = 20, DieuKienApDung = "Các dòng bìa hồ sơ nhựa" },
                new KhuyenMai { MaKM = 5, TenKM = "Ngày Hội Thương Hiệu Deli", NgayBatDau = new DateTime(2026, 7, 7), NgayKetThuc = new DateTime(2026, 7, 9), PhanTramGiam = 12, DieuKienApDung = "Tất cả sản phẩm thương hiệu Deli" },
                new KhuyenMai { MaKM = 6, TenKM = "Tri Ân Khách Hàng VIP", NgayBatDau = new DateTime(2026, 5, 1), NgayKetThuc = new DateTime(2026, 5, 5), PhanTramGiam = 5, DieuKienApDung = "Dành riêng cho hạng Vàng trở lên" },
                new KhuyenMai { MaKM = 7, TenKM = "Black Friday VPP", NgayBatDau = new DateTime(2026, 11, 20), NgayKetThuc = new DateTime(2026, 11, 27), PhanTramGiam = 30, DieuKienApDung = "Sản phẩm chọn lọc" },
                new KhuyenMai { MaKM = 8, TenKM = "Mừng Giáng Sinh", NgayBatDau = new DateTime(2026, 12, 20), NgayKetThuc = new DateTime(2026, 12, 25), PhanTramGiam = 10, DieuKienApDung = "Áp dụng mục Quà tặng lưu niệm" },
                new KhuyenMai { MaKM = 9, TenKM = "Flash Sale Đầu Tháng", NgayBatDau = new DateTime(2026, 7, 1), NgayKetThuc = new DateTime(2026, 7, 2), PhanTramGiam = 5, DieuKienApDung = "Đơn hàng đặt trên Website" },
                new KhuyenMai { MaKM = 10, TenKM = "Khai Xuân Như Ý", NgayBatDau = new DateTime(2026, 2, 10), NgayKetThuc = new DateTime(2026, 2, 20), PhanTramGiam = 15, DieuKienApDung = "Toàn bộ danh mục cửa hàng" }
            );

            // =========================================================================
            // 10. Bảng trung gian sp_km (10 mẫu liên kết MaSP và MaKM)
            // =========================================================================
            modelBuilder.Entity("sp_km").HasData(
                new { MaSP = 1, MaKM = 1 },
                new { MaSP = 2, MaKM = 1 },
                new { MaSP = 4, MaKM = 2 },
                new { MaSP = 3, MaKM = 3 },
                new { MaSP = 5, MaKM = 4 },
                new { MaSP = 6, MaKM = 5 },
                new { MaSP = 7, MaKM = 5 },
                new { MaSP = 9, MaKM = 8 },
                new { MaSP = 10, MaKM = 5 },
                new { MaSP = 4, MaKM = 10 }
            );

            // =========================================================================
            // 11. PHUONGTHUCTHANHTOAN (10 mẫu)
            // =========================================================================
            modelBuilder.Entity<PhuongThucThanhToan>().HasData(
                new PhuongThucThanhToan { MaPTTT = 1, TenPhuongThuc = "Thanh toán khi nhận hàng (COD)", MaCode = "COD", HinhAnh = "cod.png", GhiChu = "Tiền mặt shipper", TrangThai = true },
                new PhuongThucThanhToan { MaPTTT = 2, TenPhuongThuc = "Ví điện tử MoMo", MaCode = "MOMO", HinhAnh = "momo.png", GhiChu = "Quét mã QR MoMo", TrangThai = true },
                new PhuongThucThanhToan { MaPTTT = 3, TenPhuongThuc = "Cổng thanh toán VNPAY", MaCode = "VNPAY", HinhAnh = "vnpay.png", GhiChu = "ATM/Thẻ quốc tế/QR", TrangThai = true },
                new PhuongThucThanhToan { MaPTTT = 4, TenPhuongThuc = "Chuyển khoản Ngân hàng (24/7)", MaCode = "BANK_TRANSFER", HinhAnh = "bank.png", GhiChu = "Chuyển khoản Vietcombank", TrangThai = true },
                new PhuongThucThanhToan { MaPTTT = 5, TenPhuongThuc = "Ví điện tử ZaloPay", MaCode = "ZALOPAY", HinhAnh = "zalopay.png", GhiChu = "Thanh toán qua app ZaloPay", TrangThai = true },
                new PhuongThucThanhToan { MaPTTT = 6, TenPhuongThuc = "Ví ShopeePay", MaCode = "SHOPEEPAY", HinhAnh = "shopeepay.png", GhiChu = "Thanh toán ví Shopee", TrangThai = false },
                new PhuongThucThanhToan { MaPTTT = 7, TenPhuongThuc = "Thanh toán qua Thẻ Tín Dụng Quốc Tế", MaCode = "CREDIT_CARD", HinhAnh = "visa_master.png", GhiChu = "Hỗ trợ Visa/Mastercard/JCB", TrangThai = true },
                new PhuongThucThanhToan { MaPTTT = 8, TenPhuongThuc = "Trả góp qua thẻ tín dụng MuatruocTrasau", MaCode = "BNPL", HinhAnh = "bnpl.png", GhiChu = "Liên kết công ty tài chính Kredivo", TrangThai = true },
                new PhuongThucThanhToan { MaPTTT = 9, TenPhuongThuc = "Thanh toán bằng Thẻ Thành Viên / Voucher", MaCode = "VOUCHER", HinhAnh = "voucher.png", GhiChu = "Trừ tiền tích lũy trực tiếp", TrangThai = true },
                new PhuongThucThanhToan { MaPTTT = 10, TenPhuongThuc = "Công nợ Doanh Nghiệp (B2B)", MaCode = "DEBT_B2B", HinhAnh = "debt.png", GhiChu = "Thanh toán theo hợp đồng định kỳ cuối tháng", TrangThai = true }
            );

            // =========================================================================
            // 12. GIOHANG (10 mẫu - Kết nối với MaKH từ 1 đến 10)
            // =========================================================================
            modelBuilder.Entity<GioHang>().HasData(
                new GioHang { MaGH = 1, MaKH = 1, NgayCapNhat = new DateTime(2026, 5, 26), TongTien = 29000 },
                new GioHang { MaGH = 2, MaKH = 2, NgayCapNhat = new DateTime(2026, 6, 1), TongTien = 650000 },
                new GioHang { MaGH = 3, MaKH = 3, NgayCapNhat = new DateTime(2026, 6, 2), TongTien = 45000 },
                new GioHang { MaGH = 4, MaKH = 4, NgayCapNhat = new DateTime(2026, 6, 5), TongTien = 345000 },
                new GioHang { MaGH = 5, MaKH = 5, NgayCapNhat = new DateTime(2026, 6, 10), TongTien = 950000 },
                new GioHang { MaGH = 6, MaKH = 6, NgayCapNhat = new DateTime(2026, 6, 12), TongTien = 15000 },
                new GioHang { MaGH = 7, MaKH = 7, NgayCapNhat = new DateTime(2026, 6, 15), TongTien = 32000 },
                new GioHang { MaGH = 8, MaKH = 8, NgayCapNhat = new DateTime(2026, 6, 20), TongTien = 28000 },
                new GioHang { MaGH = 9, MaKH = 9, NgayCapNhat = new DateTime(2026, 6, 22), TongTien = 1850000 },
                new GioHang { MaGH = 10, MaKH = 10, NgayCapNhat = new DateTime(2026, 6, 24), TongTien = 8000 }
            );

            // =========================================================================
            // 13. CHITIETGIOHANG (10 mẫu - Kết nối với các MaGH tương ứng)
            // =========================================================================
            modelBuilder.Entity<ChiTietGioHang>().HasData(
                new ChiTietGioHang { MaGH = 1, MaSP = 1, SoLuong = 1, DonGia = 4000 },
                new ChiTietGioHang { MaGH = 1, MaSP = 2, SoLuong = 1, DonGia = 25000 },
                new ChiTietGioHang { MaGH = 2, MaSP = 4, SoLuong = 1, DonGia = 650000 },
                new ChiTietGioHang { MaGH = 3, MaSP = 5, SoLuong = 1, DonGia = 45000 },
                new ChiTietGioHang { MaGH = 4, MaSP = 3, SoLuong = 1, DonGia = 345000 },
                new ChiTietGioHang { MaGH = 5, MaSP = 9, SoLuong = 1, DonGia = 950000 },
                new ChiTietGioHang { MaGH = 6, MaSP = 6, SoLuong = 1, DonGia = 15000 },
                new ChiTietGioHang { MaGH = 7, MaSP = 7, SoLuong = 1, DonGia = 32000 },
                new ChiTietGioHang { MaGH = 8, MaSP = 8, SoLuong = 1, DonGia = 28000 },
                new ChiTietGioHang { MaGH = 9, MaSP = 10, SoLuong = 1, DonGia = 1850000 }
            );

            // =========================================================================
            // 14. DONHANG (10 mẫu - Kết nối MaKH và MaPTTT hợp lệ)
            // =========================================================================
            modelBuilder.Entity<DonHang>().HasData(
                new DonHang { MaDH = 1, MaKH = 1, HoTenNguoiNhan = "Nguyễn Thúy Lan", SDTNguoiNhan = "0901234567", NgayDat = new DateTime(2026, 5, 25), TrangThai = "Đang giao", TongTien = 675000, DiaChiGiaoHang = "123 Nguyễn Trãi, Q5, HCM", GhiChu = "Giao giờ hành chính", MaGiaoDichNgoai = "VNPAY12345", MaPTTT = 3, TrangThaiThanhToan = "Đã thanh toán" },
                new DonHang { MaDH = 2, MaKH = 2, HoTenNguoiNhan = "Trần Hoàng Nam", SDTNguoiNhan = "0918889999", NgayDat = new DateTime(2026, 5, 26), TrangThai = "Đã giao", TongTien = 345000, DiaChiGiaoHang = "456 Lê Lợi, Q1, HCM", GhiChu = "Gọi trước khi giao", MaGiaoDichNgoai = null, MaPTTT = 1, TrangThaiThanhToan = "Đã thanh toán" },
                new DonHang { MaDH = 3, MaKH = 3, HoTenNguoiNhan = "Phạm Thúy Vy", SDTNguoiNhan = "0933111222", NgayDat = new DateTime(2026, 5, 27), TrangThai = "Chờ xử lý", TongTien = 950000, DiaChiGiaoHang = "789 Điện Biên Phủ, HCM", GhiChu = "", MaGiaoDichNgoai = "MOMO8888", MaPTTT = 2, TrangThaiThanhToan = "Đã thanh toán" },
                new DonHang { MaDH = 4, MaKH = 4, HoTenNguoiNhan = "Hoàng Anh Tú", SDTNguoiNhan = "0944222333", NgayDat = new DateTime(2026, 5, 28), TrangThai = "Đã hủy", TongTien = 45000, DiaChiGiaoHang = "321 Trần Hưng Đạo, Q1, HCM", GhiChu = "Khách hủy", MaGiaoDichNgoai = null, MaPTTT = 1, TrangThaiThanhToan = "Chưa thanh toán" },
                new DonHang { MaDH = 5, MaKH = 5, HoTenNguoiNhan = "Đỗ Thùy Linh", SDTNguoiNhan = "0955333444", NgayDat = new DateTime(2026, 5, 29), TrangThai = "Đang giao", TongTien = 1850000, DiaChiGiaoHang = "159 Lý Thường Kiệt, HCM", GhiChu = "Giao lầu 3", MaGiaoDichNgoai = "BANK999", MaPTTT = 4, TrangThaiThanhToan = "Đã thanh toán" },
                new DonHang { MaDH = 6, MaKH = 6, HoTenNguoiNhan = "Nguyễn Minh Khôi", SDTNguoiNhan = "0966444555", NgayDat = new DateTime(2026, 5, 30), TrangThai = "Đã giao", TongTien = 32000, DiaChiGiaoHang = "753 Lê Văn Sỹ, Q3, HCM", GhiChu = "", MaGiaoDichNgoai = null, MaPTTT = 1, TrangThaiThanhToan = "Đã thanh toán" },
                new DonHang { MaDH = 7, MaKH = 7, HoTenNguoiNhan = "Lê Thị Mai", SDTNguoiNhan = "0977555666", NgayDat = new DateTime(2026, 6, 1), TrangThai = "Chờ xử lý", TongTien = 15000, DiaChiGiaoHang = "852 Hùng Vương, Q5, HCM", GhiChu = "", MaGiaoDichNgoai = "ZALO555", MaPTTT = 5, TrangThaiThanhToan = "Đã thanh toán" },
                new DonHang { MaDH = 8, MaKH = 8, HoTenNguoiNhan = "Vũ Hoàng Long", SDTNguoiNhan = "0988666777", NgayDat = new DateTime(2026, 6, 2), TrangThai = "Đang giao", TongTien = 28000, DiaChiGiaoHang = "963 Nguyễn Kiệm, HCM", GhiChu = "Ship tối", MaGiaoDichNgoai = null, MaPTTT = 1, TrangThaiThanhToan = "Chưa thanh toán" },
                new DonHang { MaDH = 9, MaKH = 9, HoTenNguoiNhan = "Ngô Quốc Bảo", SDTNguoiNhan = "0999777888", NgayDat = new DateTime(2026, 6, 3), TrangThai = "Đã giao", TongTien = 40000, DiaChiGiaoHang = "147 Cộng Hòa, HCM", GhiChu = "Đơn hàng doanh nghiệp", MaGiaoDichNgoai = "DEBT001", MaPTTT = 10, TrangThaiThanhToan = "Chưa thanh toán" },
                new DonHang { MaDH = 10, MaKH = 10, HoTenNguoiNhan = "Bùi Kim Yến", SDTNguoiNhan = "0909888999", NgayDat = new DateTime(2026, 6, 4), TrangThai = "Đã giao", TongTien = 650000, DiaChiGiaoHang = "369 Trường Chinh, HCM", GhiChu = "", MaGiaoDichNgoai = "CREDIT777", MaPTTT = 7, TrangThaiThanhToan = "Đã thanh toán" }
            );

            // =========================================================================
            // 15. CHITIETDONHANG (10 mẫu - Kết nối chéo MaDH và MaSP)
            // =========================================================================
            modelBuilder.Entity<ChiTietDonHang>().HasData(
                new ChiTietDonHang { MaDH = 1, MaSP = 2, SoLuong = 1, DonGia = 25000 },
                new ChiTietDonHang { MaDH = 1, MaSP = 4, SoLuong = 1, DonGia = 650000 },
                new ChiTietDonHang { MaDH = 2, MaSP = 3, SoLuong = 1, DonGia = 345000 },
                new ChiTietDonHang { MaDH = 3, MaSP = 9, SoLuong = 1, DonGia = 950000 },
                new ChiTietDonHang { MaDH = 4, MaSP = 5, SoLuong = 1, DonGia = 45000 },
                new ChiTietDonHang { MaDH = 5, MaSP = 10, SoLuong = 1, DonGia = 1850000 },
                new ChiTietDonHang { MaDH = 6, MaSP = 7, SoLuong = 1, DonGia = 32000 },
                new ChiTietDonHang { MaDH = 7, MaSP = 6, SoLuong = 1, DonGia = 15000 },
                new ChiTietDonHang { MaDH = 8, MaSP = 8, SoLuong = 1, DonGia = 28000 },
                new ChiTietDonHang { MaDH = 9, MaSP = 1, SoLuong = 10, DonGia = 4000 }
            );

            // =========================================================================
            // 16. DANHGIA (10 mẫu)
            // =========================================================================
            modelBuilder.Entity<DanhGia>().HasData(
                new DanhGia { MaDG = 1, MaKH = 1, MaSP = 4, MaDH = 1, SoSao = 5, NoiDung = "Máy tính xịn, đóng gói cẩn thận.", NgayDG = new DateTime(2026, 5, 27) },
                new DanhGia { MaDG = 2, MaKH = 2, MaSP = 3, MaDH = 2, SoSao = 4, NoiDung = "Giấy trắng, dày dặn, in rất mượt.", NgayDG = new DateTime(2026, 5, 28) },
                new DanhGia { MaDG = 3, MaKH = 3, MaSP = 9, MaDH = 3, SoSao = 5, NoiDung = "Bút ký cầm rất đầm tay, sang trọng.", NgayDG = new DateTime(2026, 5, 30) },
                new DanhGia { MaDG = 4, MaKH = 6, MaSP = 7, MaDH = 6, SoSao = 4, NoiDung = "Bấm kim chắc chắn, xài tốt.", NgayDG = new DateTime(2026, 6, 1) },
                new DanhGia { MaDG = 5, MaKH = 7, MaSP = 6, MaDH = 7, SoSao = 5, NoiDung = "Băng keo dính tốt, giá hợp lý.", NgayDG = new DateTime(2026, 6, 3) },
                new DanhGia { MaDG = 6, MaKH = 1, MaSP = 2, MaDH = 1, SoSao = 5, NoiDung = "Sổ Campus viết êm, không lem mực.", NgayDG = new DateTime(2026, 5, 28) },
                new DanhGia { MaDG = 7, MaKH = 10, MaSP = 4, MaDH = 10, SoSao = 4, NoiDung = "Giao hàng hơi chậm tí nhưng sản phẩm OK.", NgayDG = new DateTime(2026, 6, 6) },
                new DanhGia { MaDG = 8, MaKH = 5, MaSP = 10, MaDH = 5, SoSao = 5, NoiDung = "Máy hủy giấy chạy êm, hủy vụn rất bảo mật.", NgayDG = new DateTime(2026, 6, 2) },
                new DanhGia { MaDG = 9, MaKH = 2, MaSP = 1, MaDH = 2, SoSao = 3, NoiDung = "Mực viết ra đều nhưng vỏ hơi trầy xước nhẹ.", NgayDG = new DateTime(2026, 5, 29) },
                new DanhGia { MaDG = 10, MaKH = 9, MaSP = 1, MaDH = 9, SoSao = 5, NoiDung = "Mua số lượng lớn viết rất tốt, giá sỉ rẻ.", NgayDG = new DateTime(2026, 6, 5) }
            );

            // =========================================================================
            // 17. NHAPHANG (10 mẫu - Kết nối MaNV 1,2,3 và MaNCC hợp lệ)
            // =========================================================================
            modelBuilder.Entity<NhapHang>().HasData(
                new NhapHang { MaNH = 1, MaNV = 1, MaNCC = 2, NgayNhap = new DateTime(2026, 5, 24), TongTien = 10000000, TrangThai = "Đã hoàn thành" },
                new NhapHang { MaNH = 2, MaNV = 2, MaNCC = 1, NgayNhap = new DateTime(2026, 5, 25), TongTien = 5000000, TrangThai = "Đã hoàn thành" },
                new NhapHang { MaNH = 3, MaNV = 3, MaNCC = 3, NgayNhap = new DateTime(2026, 5, 26), TongTien = 12000000, TrangThai = "Đã hoàn thành" },
                new NhapHang { MaNH = 4, MaNV = 1, MaNCC = 4, NgayNhap = new DateTime(2026, 5, 28), TongTien = 15000000, TrangThai = "Yêu cầu xử lý" },
                new NhapHang { MaNH = 5, MaNV = 2, MaNCC = 5, NgayNhap = new DateTime(2026, 5, 30), TongTien = 4500000, TrangThai = "Đã hoàn thành" },
                new NhapHang { MaNH = 6, MaNV = 3, MaNCC = 6, NgayNhap = new DateTime(2026, 6, 1), TongTien = 3500000, TrangThai = "Đã hoàn thành" },
                new NhapHang { MaNH = 7, MaNV = 1, MaNCC = 7, NgayNhap = new DateTime(2026, 6, 2), TongTien = 9500000, TrangThai = "Đã hủy" },
                new NhapHang { MaNH = 8, MaNV = 2, MaNCC = 8, NgayNhap = new DateTime(2026, 6, 3), TongTien = 7800000, TrangThai = "Đã hoàn thành" },
                new NhapHang { MaNH = 9, MaNV = 3, MaNCC = 9, NgayNhap = new DateTime(2026, 6, 5), TongTien = 2200000, TrangThai = "Đã hoàn thành" },
                new NhapHang { MaNH = 10, MaNV = 1, MaNCC = 10, NgayNhap = new DateTime(2026, 6, 7), TongTien = 18500000, TrangThai = "Đã hoàn thành" }
            );

            // =========================================================================
            // 18. CHITIETNHAPHANG (10 mẫu - Kết nối MaNH và MaSP hợp lệ)
            // =========================================================================
            modelBuilder.Entity<ChiTietNhapHang>().HasData(
                new ChiTietNhapHang { MaNH = 1, MaSP = 3, SoLuong = 30, DonGia = 300000 },
                new ChiTietNhapHang { MaNH = 2, MaSP = 1, SoLuong = 1000, DonGia = 3000 },
                new ChiTietNhapHang { MaNH = 3, MaSP = 6, SoLuong = 500, DonGia = 10000 },
                new ChiTietNhapHang { MaNH = 4, MaSP = 3, SoLuong = 40, DonGia = 310000 },
                new ChiTietNhapHang { MaNH = 5, MaSP = 5, SoLuong = 100, DonGia = 35000 },
                new ChiTietNhapHang { MaNH = 6, MaSP = 2, SoLuong = 150, DonGia = 18000 },
                new ChiTietNhapHang { MaNH = 7, MaSP = 9, SoLuong = 10, DonGia = 800000 },
                new ChiTietNhapHang { MaNH = 8, MaSP = 7, SoLuong = 200, DonGia = 25000 },
                new ChiTietNhapHang { MaNH = 9, MaSP = 8, SoLuong = 100, DonGia = 20000 },
                new ChiTietNhapHang { MaNH = 10, MaSP = 10, SoLuong = 10, DonGia = 1500000 }
            );
        }
    }
}