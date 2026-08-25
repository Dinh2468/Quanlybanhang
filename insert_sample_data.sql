USE [quanlybanhang]
GO

-- ============================================================
-- XOA DU LIEU CU (thu tu nguoc voi FK de tranh loi)
-- ============================================================
DELETE FROM [dbo].[sp_km]
DELETE FROM [dbo].[DanhGia]
DELETE FROM [dbo].[ChiTietNhapHang]
DELETE FROM [dbo].[ChiTietGioHang]
DELETE FROM [dbo].[ChiTietDonHang]
DELETE FROM [dbo].[NhapHang]
DELETE FROM [dbo].[DonHang]
DELETE FROM [dbo].[GioHang]
DELETE FROM [dbo].[KhuyenMai]
DELETE FROM [dbo].[SanPham]
DELETE FROM [dbo].[LoaiSP]
DELETE FROM [dbo].[ThuongHieu]
DELETE FROM [dbo].[NhaCungCap]
DELETE FROM [dbo].[PhuongThucThanhToan]
DELETE FROM [dbo].[NhanVien]
DELETE FROM [dbo].[KhachHang]
DELETE FROM [dbo].[HangKhachHang]
DELETE FROM [dbo].[TaiKhoan]

-- Reset IDENTITY
DBCC CHECKIDENT ('[dbo].[TaiKhoan]',          RESEED, 0)
DBCC CHECKIDENT ('[dbo].[HangKhachHang]',     RESEED, 0)
DBCC CHECKIDENT ('[dbo].[KhachHang]',         RESEED, 0)
DBCC CHECKIDENT ('[dbo].[NhanVien]',          RESEED, 0)
DBCC CHECKIDENT ('[dbo].[NhaCungCap]',        RESEED, 0)
DBCC CHECKIDENT ('[dbo].[ThuongHieu]',        RESEED, 0)
DBCC CHECKIDENT ('[dbo].[LoaiSP]',            RESEED, 0)
DBCC CHECKIDENT ('[dbo].[SanPham]',           RESEED, 0)
DBCC CHECKIDENT ('[dbo].[PhuongThucThanhToan]',RESEED, 0)
DBCC CHECKIDENT ('[dbo].[KhuyenMai]',         RESEED, 0)
DBCC CHECKIDENT ('[dbo].[GioHang]',           RESEED, 0)
DBCC CHECKIDENT ('[dbo].[DonHang]',           RESEED, 0)
DBCC CHECKIDENT ('[dbo].[NhapHang]',          RESEED, 0)
DBCC CHECKIDENT ('[dbo].[DanhGia]',           RESEED, 0)
GO

-- ============================================================
-- 1. TaiKhoan
-- ============================================================
INSERT INTO [dbo].[TaiKhoan] ([TenDangNhap],[MatKhau],[Email],[VaiTro],[TrangThai],[Avatar]) VALUES
('admin',   '$2a$11$hashedpwadmin111111111u', 'admin@dchoc.vn',       N'Admin',     1, NULL),
('nv001',   '$2a$11$hashedpwnv001111111111u', 'nv001@dchoc.vn',       N'NhanVien',  1, NULL),
('nv002',   '$2a$11$hashedpwnv002111111111u', 'nv002@dchoc.vn',       N'NhanVien',  1, NULL),
('nv003',   '$2a$11$hashedpwnv003111111111u', 'nv003@dchoc.vn',       N'NhanVien',  1, NULL),
('hocsinh01','$2a$11$hashedpwkh001111111111u','hs01@gmail.com',        N'KhachHang', 1, NULL),
('hocsinh02','$2a$11$hashedpwkh002111111111u','hs02@gmail.com',        N'KhachHang', 1, NULL),
('giaovien01','$2a$11$hashedpwkh003111111111u','gv01@gmail.com',       N'KhachHang', 1, NULL),
('phuhuynh01','$2a$11$hashedpwkh004111111111u','ph01@gmail.com',       N'KhachHang', 1, NULL),
('hocsinh03','$2a$11$hashedpwkh005111111111u','hs03@gmail.com',        N'KhachHang', 1, NULL),
('hocsinh04','$2a$11$hashedpwkh006111111111u','hs04@gmail.com',        N'KhachHang', 0, NULL)
GO

-- ============================================================
-- 2. HangKhachHang
-- ============================================================
INSERT INTO [dbo].[HangKhachHang] ([TenHang],[DiemToiThieu],[PhanTramUuDai]) VALUES

(N'Đồng',        0,    0),
(N'Bạc',         1000, 5),
(N'Vàng',        5000, 10),
(N'Bạch Kim',     7000, 20),
(N'Kim Cương',    10000, 30)

GO

-- ============================================================
-- 3. KhachHang (phu thuoc TaiKhoan, HangKhachHang)
-- ============================================================
INSERT INTO [dbo].[KhachHang] ([HoTen],[SDT],[DiaChi],[MaTK],[DiemTichLuy],[MaHang]) VALUES
(N'Nguyễn Thị Lan',    '0901234561', N'12 Lê Lợi, Q.1, TP.HCM',              5,    850,  3),
(N'Trần Văn Minh',     '0901234562', N'45 Trần Hưng Đạo, Q.5, TP.HCM',       6,    120,  1),
(N'Lê Thị Hoa',        '0901234563', N'78 Nguyễn Huệ, Q.1, TP.HCM',          7,    3200, 5),
(N'Phạm Quốc Tuấn',    '0901234564', N'23 Hoàng Diệu, Q.4, TP.HCM',          8,    560,  2),
(N'Võ Thị Kim',        '0901234565', N'56 Bà Triệu, Hoàn Kiếm, Hà Nội',      9,    2100, 4),
(N'Đặng Văn Long',     '0901234566', N'90 Đinh Tiên Hoàng, Q.Bình Thạnh',    10,   0,    1),
(N'Hoàng Thị Mai',     '0901234567', N'34 Lý Thường Kiệt, Q.10, TP.HCM',     NULL, 450,  2),
(N'Bùi Quang Dũng',    '0901234568', N'67 Pasteur, Q.3, TP.HCM',             NULL, 1600, 4),
(N'Ngô Thị Thu',       '0901234569', N'11 Ngô Quyền, Hai Bà Trưng, Hà Nội', NULL, 80,   1),
(N'Đinh Văn Hùng',     '0901234570', N'29 Trần Phú, Hải Châu, Đà Nẵng',     NULL, 2900, 5)
GO

-- ============================================================
-- 4. NhanVien (phu thuoc TaiKhoan)
-- ============================================================
INSERT INTO [dbo].[NhanVien] ([MaSoNhanVien],[HoTen],[GioiTinh],[NgaySinh],[SDT],[DiaChi],[MaTK]) VALUES
('NV00001', N'Trần Thị Bích',   N'Nữ',  '1995-03-15', '0911111101', N'15 Hai Bà Trưng, Q.1, TP.HCM',    1),
('NV00002', N'Lê Quang Huy',    N'Nam', '1993-07-22', '0911111102', N'42 Phạm Ngũ Lão, Q.1, TP.HCM',    2),
('NV00003', N'Phạm Thị Ngọc',   N'Nữ',  '1997-11-08', '0911111103', N'88 CMT8, Q.3, TP.HCM',            3),
('NV00004', N'Nguyễn Văn Đức',  N'Nam', '1990-05-30', '0911111104', N'7 Nguyễn Trãi, Q.5, TP.HCM',      4),
('NV00005', N'Võ Thị Thảo',     N'Nữ',  '1999-01-14', '0911111105', N'33 Điện Biên Phủ, Bình Thạnh',    NULL),
('NV00006', N'Đỗ Minh Khoa',    N'Nam', '1994-09-27', '0911111106', N'55 Lý Tự Trọng, Q.1, TP.HCM',     NULL),
('NV00007', N'Bùi Thị Thanh',   N'Nữ',  '1996-04-03', '0911111107', N'19 Trường Chinh, Tân Bình',       NULL),
('NV00008', N'Phan Quốc Bảo',   N'Nam', '1992-12-19', '0911111108', N'62 Phan Đình Phùng, Phú Nhuận',   NULL),
('NV00009', N'Lý Thị Phương',   N'Nữ',  '1998-06-11', '0911111109', N'31 Hoàng Văn Thụ, Phú Nhuận',     NULL),
('NV00010', N'Trương Văn Kiên', N'Nam', '1991-08-24', '0911111110', N'75 Nơ Trang Long, Bình Thạnh',    NULL)
GO

-- ============================================================
-- 5. NhaCungCap (nha cung cap dung cu hoc tap)
-- ============================================================
INSERT INTO [dbo].[NhaCungCap] ([TenNCC],[DiaChi],[SDT],[Email]) VALUES
(N'Công ty CP Thiên Long',          N'126 Nguyễn Thị Thập, Q.7, TP.HCM',         '02838500007', 'kinhdoanh@thienlonggroup.com'),
(N'Công ty CP Hồng Hà',            N'25 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',     '02439362699', 'info@honghavietnam.vn'),
(N'Công ty TNHH Stabilo Việt Nam',  N'Lô E2, KCN Biên Hòa 2, Đồng Nai',         '02511834600', 'stab.vietnam@stabilo.com'),
(N'Công ty Casio Việt Nam',         N'31 Lê Duẩn, Q.1, TP.HCM',                 '02838294444', 'info@casio.com.vn'),
(N'Công ty TNHH UNI Việt Nam',      N'KCN Tân Tạo, Q.Bình Tân, TP.HCM',         '02837506666', 'uni.vietnam@mitsubishi.com'),
(N'Công ty CP Deli Việt Nam',       N'89 Cộng Hòa, Q.Tân Bình, TP.HCM',         '02836363636', 'deli.vn@deli.com'),
(N'Công ty TNHH Faber-Castell VN',  N'KCN Long Thành, Đồng Nai',                '02513562200', 'info@faber-castell.com.vn'),
(N'Công ty CP Văn Phòng Phẩm Hòa Phát',N'455 Hoàng Quốc Việt, Cầu Giấy, HN',   '02432123456', 'hoaphat.vpp@hoaphat.com.vn'),
(N'Công ty TNHH 3M Việt Nam',       N'29 Bạch Đằng, Q.Tân Bình, TP.HCM',        '02838482020', 'info.vn@mmm.com'),
(N'Công ty CP Ánh Dương',           N'112 Đinh Tiên Hoàng, Q.Bình Thạnh, HCM',  '02835124567', 'anhduong.vpp@gmail.com')
GO

-- ============================================================
-- 6. ThuongHieu (thuong hieu van phong pham / dung cu hoc tap)
-- ============================================================
INSERT INTO [dbo].[ThuongHieu] ([TenTH],[QuocGia],[MoTa]) VALUES
(N'Thiên Long',    N'Việt Nam',     N'Thương hiệu bút và dụng cụ học tập hàng đầu Việt Nam'),
(N'Hồng Hà',      N'Việt Nam',     N'Nhà sản xuất vở, giấy và văn phòng phẩm nổi tiếng'),
(N'Stabilo',       N'Đức',          N'Bút highlight và bút màu chất lượng châu Âu'),
(N'Casio',         N'Nhật Bản',     N'Máy tính và thiết bị điện tử học tập'),
(N'Uni',           N'Nhật Bản',     N'Bút bi, bút gel cao cấp Mitsubishi'),
(N'Deli',          N'Trung Quốc',   N'Dụng cụ văn phòng và học tập đa dạng'),
(N'Faber-Castell', N'Đức',          N'Bút chì, màu vẽ và dụng cụ mỹ thuật'),
(N'Kangaro',       N'Ấn Độ',        N'Dập ghim, bấm lỗ và dụng cụ văn phòng'),
(N'3M',            N'Mỹ',           N'Giấy nhớ Post-it và sản phẩm dán'),
(N'Pentel',        N'Nhật Bản',     N'Bút lông, bút màu và dụng cụ vẽ')
GO

-- ============================================================
-- 7. LoaiSP (danh muc dung cu hoc tap)
-- ============================================================
INSERT INTO [dbo].[LoaiSP] ([TenLoai],[MoTa]) VALUES
(N'Bút viết',           N'Bút bi, bút gel, bút mực, bút máy các loại'),
(N'Vở & Sổ',            N'Vở học sinh, sổ tay, tập học sinh'),
(N'Dụng cụ vẽ & Màu',   N'Màu sáp, màu nước, bút chì màu, cọ vẽ'),
(N'Máy tính',           N'Máy tính cầm tay, máy tính khoa học'),
(N'Dụng cụ hình học',   N'Thước kẻ, compa, eke, thước đo góc'),
(N'Balo & Túi',         N'Balo học sinh, túi đựng bút, hộp bút'),
(N'Giấy & Bìa',         N'Giấy A4, giấy note, bìa hồ sơ, giấy màu'),
(N'Văn phòng phẩm',     N'Kéo, dao rọc giấy, băng keo, ghim, kẹp'),
(N'Sách & Tham khảo',   N'Từ điển, sách bài tập, sách tham khảo'),
(N'Dụng cụ lưu trữ',    N'Kệ sách, hộp đựng tài liệu, file bìa')
GO

-- ============================================================
-- 8. SanPham (dung cu hoc tap thuc te)
-- Columns: TenSP, MoTa, Gia, SoLuongTon, HinhAnh, MaLoai, MaNCC, MaTH
-- ============================================================
INSERT INTO [dbo].[SanPham] ([TenSP],[MoTa],[Gia],[SoLuongTon],[HinhAnh],[MaLoai],[MaNCC],[MaTH]) VALUES
(N'Bút bi Thiên Long TL-027',     N'Bút bi ngòi 0.7mm, mực xanh/đen/đỏ, viết trơn tru, bền màu',                    5000,   500, NULL, 1,  1,  1),
(N'Vở ô ly Hồng Hà 96 trang',    N'Vở kẻ ô ly 5mm, giấy trắng sáng, bìa cứng đẹp, 96 trang',                       12000,  300, NULL, 2,  2,  2),
(N'Bộ bút highlight Stabilo Boss',N'Hộp 6 màu highlight không thấm ngược, màu tươi sáng, dùng cho sách giáo khoa',   55000,  150, NULL, 1,  3,  3),
(N'Máy tính Casio FX-580VN X',   N'Máy tính khoa học 580 hàm, màn hình Natural VPAM, pin năng lượng mặt trời',      320000, 80,  NULL, 4,  4,  4),
(N'Bút gel Uni-ball Signo 0.5mm', N'Bút gel cao cấp Nhật Bản, mực đậm đều, khô nhanh, không lem',                   18000,  200, NULL, 1,  5,  5),
(N'Compa vẽ tròn Deli',          N'Compa kim loại chính xác, vẽ đường kính tối đa 26cm, có lò xo điều chỉnh',        35000,  120, NULL, 5,  6,  6),
(N'Hộp màu chì Faber-Castell 24 màu',N'24 màu chì lục giác, lõi mịn, màu tươi chuẩn, không gãy khi gọt',           85000,  100, NULL, 3,  7,  7),
(N'Balo học sinh chống gù lưng', N'Balo có thanh chống gù, ngăn laptop 15.6 inch, chất liệu chống thấm nước',        350000, 60,  NULL, 6,  10, 2),
(N'Giấy note Post-it 3M 3x3"',   N'100 tờ/xấp, giấy dán tái sử dụng, màu vàng, dán nhiều bề mặt',                  25000,  250, NULL, 7,  9,  9),
(N'Thước kẻ nhựa 30cm Thiên Long',N'Thước kẻ trong suốt, vạch chia mm rõ ràng, cạnh chắc không cong vênh',           8000,   400, NULL, 5,  1,  1)
GO

-- ============================================================
-- 9. PhuongThucThanhToan
-- ============================================================
INSERT INTO [dbo].[PhuongThucThanhToan] ([TenPhuongThuc],[MaCode],[HinhAnh],[GhiChu],[TrangThai]) VALUES
(N'Tiền mặt',               'CASH',        NULL, N'Thanh toán khi nhận hàng (COD)',               1),
(N'VNPay',                  'VNPAY',       NULL, N'Thanh toán qua ví điện tử VNPay',              1),
(N'MoMo',                   'MOMO',        NULL, N'Thanh toán qua ví điện tử MoMo',               1)
GO

-- ============================================================
-- 10. KhuyenMai (khuyen mai danh cho cua hang dung cu hoc tap)
-- ============================================================
INSERT INTO [dbo].[KhuyenMai] ([TenKM],[NgayBatDau],[NgayKetThuc],[PhanTramGiam],[DieuKienApDung]) VALUES
(N'Khai giảng năm học 2025-2026',  '2025-08-01', '2025-09-15', 20, N'Tất cả sản phẩm, áp dụng đầu năm học'),
(N'Sale tết Nguyên Đán 2026',      '2026-01-20', '2026-02-10', 15, N'Áp dụng cho đơn từ 100.000đ'),
(N'Ưu đãi mùa thi học kỳ 1',      '2025-12-01', '2025-12-31', 10, N'Áp dụng cho máy tính, bút viết'),
(N'Ngày Nhà giáo 20/11',          '2025-11-18', '2025-11-22', 25, N'Ưu đãi đặc biệt cho giáo viên'),
(N'Flash sale cuối tuần',          '2026-06-28', '2026-06-29', 30, N'Chỉ từ 8h-12h thứ 7, chủ nhật'),
(N'Mua sắm thông minh tháng 6',    '2026-06-01', '2026-06-30', 12, N'Áp dụng cho vở và dụng cụ hình học'),
(N'Ưu đãi hội viên Giáo Viên',     '2026-01-01', '2026-12-31', 10, N'Dành cho hạng Giáo Viên trở lên'),
(N'Mừng khai trương cơ sở mới',    '2026-03-01', '2026-03-31', 18, N'Tất cả sản phẩm tại cửa hàng'),
(N'Back to School 2026',           '2026-07-15', '2026-09-05', 22, N'Chuẩn bị đồ dùng học tập mùa khai giảng'),
(N'Tri ân khách hàng thân thiết',  '2026-06-15', '2026-06-25', 8,  N'Áp dụng cho khách hàng từ hạng Thân Thiết')
GO

-- ============================================================
-- 11. GioHang (phu thuoc KhachHang)
-- ============================================================
INSERT INTO [dbo].[GioHang] ([MaKH],[NgayCapNhat],[TongTien]) VALUES
(1,  '2026-06-20', 73000),
(2,  '2026-06-21', 12000),
(3,  '2026-06-22', 455000),
(4,  '2026-06-23', 35000),
(5,  '2026-06-24', 370000),
(6,  '2026-06-24', 320000),
(7,  '2026-06-23', 85000),
(8,  '2026-06-22', 350000),
(9,  '2026-06-25', 25000),
(10, '2026-06-25', 108000)
GO

-- ============================================================
-- 12. DonHang (phu thuoc KhachHang, PhuongThucThanhToan)
-- Luu y: Bo cot [MaGiaoD?chNgoai] (ten Unicode bi loi encoding trong file),
-- cot nay nullable nen SQL Server tu dien NULL, ket qua tuong duong.
-- ============================================================
INSERT INTO [dbo].[DonHang]
    ([MaKH],[HoTenNguoiNhan],[SDTNguoiNhan],[NgayDat],[TrangThai],[TongTien],
     [DiaChiGiaoHang],[GhiChu],[MaPTTT],[TrangThaiThanhToan])
VALUES
(1, N'Nguyễn Thị Lan',   '0901234561', '2026-05-10', N'Đã giao',         73000,  N'12 Lê Lợi, Q.1, TP.HCM',             NULL,                  4, N'Đã thanh toán'),
(2, N'Trần Văn Minh',    '0901234562', '2026-05-15', N'Đã giao',         12000,  N'45 Trần Hưng Đạo, Q.5, TP.HCM',      NULL,                  1, N'Đã thanh toán'),
(3, N'Lê Thị Hoa',       '0901234563', '2026-05-20', N'Đã giao',         455000, N'78 Nguyễn Huệ, Q.1, TP.HCM',         N'Giao giờ hành chính',3, N'Đã thanh toán'),
(4, N'Phạm Quốc Tuấn',   '0901234564', '2026-05-25', N'Đã giao',         35000,  N'23 Hoàng Diệu, Q.4, TP.HCM',         NULL,                  1, N'Đã thanh toán'),
(5, N'Võ Thị Kim',       '0901234565', '2026-06-01', N'Đã giao',         370000, N'56 Bà Triệu, Hoàn Kiếm, Hà Nội',    NULL,                  3, N'Đã thanh toán'),
(1, N'Nguyễn Thị Lan',   '0901234561', '2026-06-10', N'Đã giao',         320000, N'12 Lê Lợi, Q.1, TP.HCM',             NULL,                  4, N'Đã thanh toán'),
(6, N'Đặng Văn Long',    '0901234566', '2026-06-15', N'Đang vận chuyển', 85000,  N'90 Đinh Tiên Hoàng, Q.Bình Thạnh',  NULL,                  1, N'Chưa thanh toán'),
(7, N'Hoàng Thị Mai',    '0901234567', '2026-06-18', N'Đang xử lý',      350000, N'34 Lý Thường Kiệt, Q.10, TP.HCM',  N'Gọi trước khi giao', 2, N'Chưa thanh toán'),
(3, N'Lê Thị Hoa',       '0901234563', '2026-06-20', N'Đã xác nhận',     25000,  N'78 Nguyễn Huệ, Q.1, TP.HCM',         NULL,                  4, N'Đã thanh toán'),
(8, N'Bùi Quang Dũng',   '0901234568', '2026-06-22', N'Chờ xác nhận',    108000, N'67 Pasteur, Q.3, TP.HCM',            NULL,                  3, N'Chưa thanh toán')
GO

-- ============================================================
-- 13. NhapHang (phu thuoc NhanVien, NhaCungCap)
-- ============================================================
INSERT INTO [dbo].[NhapHang] ([MaNV],[MaNCC],[NgayNhap],[TongTien],[TrangThai]) VALUES
(1, 1, '2026-04-01', 5000000,  N'Đã nhập'),
(2, 2, '2026-04-05', 3600000,  N'Đã nhập'),
(1, 3, '2026-04-10', 2750000,  N'Đã nhập'),
(3, 4, '2026-04-15', 9600000,  N'Đã nhập'),
(2, 5, '2026-04-20', 1800000,  N'Đã nhập'),
(1, 6, '2026-05-01', 4200000,  N'Đã nhập'),
(4, 7, '2026-05-08', 8500000,  N'Đã nhập'),
(3, 8, '2026-05-15', 2100000,  N'Chờ duyệt'),
(2, 9, '2026-06-01', 3750000,  N'Đã nhập'),
(1, 10,'2026-06-10', 7000000,  N'Chờ duyệt')
GO

-- ============================================================
-- 14. ChiTietDonHang (phu thuoc DonHang, SanPham)
-- ============================================================
INSERT INTO [dbo].[ChiTietDonHang] ([MaDH],[MaSP],[SoLuong],[DonGia]) VALUES
(1,  1,  3,  5000),
(1,  2,  2,  12000),
(1,  10, 3,  8000),
(2,  2,  1,  12000),
(3,  4,  1,  320000),
(3,  5,  5,  18000),
(3,  10, 5,  8000),
(4,  6,  1,  35000),
(5,  8,  1,  350000),
(6,  3,  1,  55000)
GO

-- ============================================================
-- 15. ChiTietGioHang (phu thuoc GioHang, SanPham)
-- ============================================================
INSERT INTO [dbo].[ChiTietGioHang] ([MaGH],[MaSP],[SoLuong],[DonGia]) VALUES
(1,  1,  5,  5000),
(1,  10, 3,  8000),
(2,  2,  1,  12000),
(3,  4,  1,  320000),
(3,  5,  5,  18000),
(4,  6,  1,  35000),
(5,  8,  1,  350000),
(6,  7,  1,  85000),
(7,  9,  1,  25000),
(8,  3,  2,  55000)
GO

-- ============================================================
-- 16. ChiTietNhapHang (phu thuoc NhapHang, SanPham)
-- ============================================================
INSERT INTO [dbo].[ChiTietNhapHang] ([MaNH],[MaSP],[SoLuong],[DonGia]) VALUES
(1,  1,  200, 4000),
(1,  10, 200, 6000),
(2,  2,  100, 9500),
(3,  3,  50,  42000),
(4,  4,  30,  280000),
(5,  5,  100, 15000),
(6,  6,  60,  28000),
(7,  7,  50,  68000),
(8,  8,  20,  290000),
(9,  9,  150, 20000)
GO

-- ============================================================
-- 17. DanhGia (phu thuoc KhachHang, SanPham, DonHang)
-- ============================================================
INSERT INTO [dbo].[DanhGia] ([MaKH],[MaSP],[MaDH],[SoSao],[NoiDung],[NgayDG]) VALUES
(1, 1,  1,  5, N'Bút bi viết rất trơn, mực ra đều, dùng được lâu. Sẽ mua lại!',              '2026-05-13'),
(2, 2,  2,  4, N'Vở giấy trắng sáng, dòng kẻ rõ ràng, bìa cứng chắc chắn.',                 '2026-05-18'),
(3, 4,  3,  5, N'Máy tính Casio chính hãng, tính nhanh, màn hình rõ. Học thi rất ổn!',       '2026-05-24'),
(4, 6,  4,  5, N'Compa vẽ rất chính xác, kim chắc không trượt, đáng mua.',                   '2026-05-28'),
(5, 8,  5,  4, N'Balo đẹp, chống gù tốt, nhiều ngăn tiện. Hơi nặng một chút.',              '2026-06-04'),
(1, 3,  6,  5, N'Bút highlight màu đẹp, không lem mực in, highlight giáo khoa rất tốt.',    '2026-06-13'),
(6, 1,  1,  3, N'Bút viết ổn nhưng mực hơi nhạt so với kỳ vọng.',                           '2026-06-17'),
(7, 8,  8,  5, N'Balo chắc chắn, đeo nhẹ dù đầy sách vở. Rất hài lòng!',                   '2026-06-20'),
(3, 5,  3,  5, N'Bút gel Uni viết rất mượt, mực đen đậm, khô nhanh không lem bài.',         '2026-06-21'),
(5, 8,  5,  4, N'Hàng đúng mô tả, giao nhanh. Balo bền chắc, con trai dùng rất thích.',    '2026-06-22')
GO

-- ============================================================
-- 18. sp_km (phu thuoc SanPham, KhuyenMai)
-- ============================================================
INSERT INTO [dbo].[sp_km] ([MaSP],[MaKM]) VALUES
(1,  1),
(2,  1),
(3,  3),
(4,  3),
(5,  6),
(6,  6),
(7,  8),
(8,  9),
(9,  10),
(10, 5)
GO

PRINT N'=== Insert 10 mau du lieu DUNG CU HOC TAP thanh cong! ==='
GO
