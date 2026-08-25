/* ==================================================================
   SCRIPT THÊM DỮ LIỆU MẪU CHO DATABASE [quanlybanhang]
   ------------------------------------------------------------------
   - Bảng dữ liệu "lớn" (khách hàng, sản phẩm, đơn hàng, giỏ hàng,
     nhập hàng, đánh giá, tài khoản, yêu thích, sản phẩm-khuyến mãi):
     mỗi bảng được thêm ĐÚNG 50 dòng mới, ID tiếp nối ID lớn nhất hiện có.
   - Bảng danh mục/cấu hình có bản chất ít thay đổi (LoaiSP, ThuongHieu,
     NhaCungCap, NhanVien, HangKhachHang, PhuongThucThanhToan, KhuyenMai):
     được thêm một số lượng hợp lý (không ép đúng 50) vì thêm 50 dòng vào
     các bảng này sẽ không thực tế (VD: 50 "hạng khách hàng" là vô lý).
     Có ghi chú rõ tại từng phần.
   - Script dùng SET IDENTITY_INSERT để giữ đúng ID tự tăng.
   - Chạy script này SAU KHI đã chạy file tạo cấu trúc + dữ liệu gốc
     (db_.sql) vì nó phụ thuộc dữ liệu ID hiện có trong các bảng đó.
   - Trước khi chạy: USE [quanlybanhang]
   ================================================================== */

USE [quanlybanhang]
GO

-- ============================================================
-- 1) TAIKHOAN: +50 tài khoản khách hàng mới (MaTK 16 -> 65)
-- ============================================================
SET IDENTITY_INSERT [dbo].[TaiKhoan] ON
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (16, N'khachhang016', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang016@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (17, N'khachhang017', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang017@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (18, N'khachhang018', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang018@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (19, N'khachhang019', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang019@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (20, N'khachhang020', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang020@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (21, N'khachhang021', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang021@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (22, N'khachhang022', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang022@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (23, N'khachhang023', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang023@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (24, N'khachhang024', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang024@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (25, N'khachhang025', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang025@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (26, N'khachhang026', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang026@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (27, N'khachhang027', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang027@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (28, N'khachhang028', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang028@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (29, N'khachhang029', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang029@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (30, N'khachhang030', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang030@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (31, N'khachhang031', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang031@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (32, N'khachhang032', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang032@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (33, N'khachhang033', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang033@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (34, N'khachhang034', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang034@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (35, N'khachhang035', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang035@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (36, N'khachhang036', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang036@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (37, N'khachhang037', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang037@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (38, N'khachhang038', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang038@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (39, N'khachhang039', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang039@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (40, N'khachhang040', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang040@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (41, N'khachhang041', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang041@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (42, N'khachhang042', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang042@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (43, N'khachhang043', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang043@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (44, N'khachhang044', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang044@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (45, N'khachhang045', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang045@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (46, N'khachhang046', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang046@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (47, N'khachhang047', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang047@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (48, N'khachhang048', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang048@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (49, N'khachhang049', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang049@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (50, N'khachhang050', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang050@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (51, N'khachhang051', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang051@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (52, N'khachhang052', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang052@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (53, N'khachhang053', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang053@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (54, N'khachhang054', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang054@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (55, N'khachhang055', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang055@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (56, N'khachhang056', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang056@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (57, N'khachhang057', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang057@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (58, N'khachhang058', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang058@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (59, N'khachhang059', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang059@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (60, N'khachhang060', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang060@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (61, N'khachhang061', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang061@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (62, N'khachhang062', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang062@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (63, N'khachhang063', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang063@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (64, N'khachhang064', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang064@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
INSERT [dbo].[TaiKhoan] ([MaTK], [TenDangNhap], [MatKhau], [Email], [VaiTro], [TrangThai], [Avatar], [ResetToken], [ResetTokenExpiry]) VALUES (65, N'khachhang065', N'$2a$11$/uM0ATBN/cqUzc1uevkv8e/XjGBerRihmX1WUj0GnrfvQ0N6gFxXm', N'khachhang065@gmail.com', N'KhachHang', 1, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[TaiKhoan] OFF
GO

-- ============================================================
-- 2) KHACHHANG: +50 khách hàng mới (MaKH 13 -> 62), gắn với TaiKhoan 16 -> 65
-- ============================================================
SET IDENTITY_INSERT [dbo].[KhachHang] ON
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (13, N'Nguyễn Diễm Trang', N'0939958838', N'72 Trần Hưng Đạo, Q.Phú Nhuận, TP.HCM', 16, 4837, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (14, N'Nguyễn Hữu Long', N'0941227216', N'259 Võ Văn Tần, Q.1, Bình Dương', 17, 1628, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (15, N'Ngô Kim My', N'0989089901', N'143 Lê Lợi, Q.5, Đồng Nai', 18, 3462, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (16, N'Hoàng Công Vinh', N'0955176955', N'53 Trần Hưng Đạo, Q.Tân Bình, TP.HCM', 19, 2940, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (17, N'Võ Thị Xuân', N'0971662963', N'275 Trần Hưng Đạo, Q.Tân Bình, TP.HCM', 20, 4522, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (18, N'Đỗ Trọng Long', N'0919335534', N'24 Cách Mạng Tháng 8, Q.10, TP.HCM', 21, 1907, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (19, N'Hồ Diễm My', N'0995320121', N'187 Nguyễn Trãi, Q.Bình Thạnh, Đà Nẵng', 22, 1716, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (20, N'Lê Tuyết Vy', N'0932969840', N'274 Cách Mạng Tháng 8, Q.5, Cần Thơ', 23, 3108, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (21, N'Vũ Minh Quân', N'0917507864', N'118 Lê Lợi, Q.Bình Thạnh, Cần Thơ', 24, 2193, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (22, N'Bùi Công Hải', N'0977005685', N'203 Phan Xích Long, Q.5, Đà Nẵng', 25, 1143, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (23, N'Võ Trọng Phong', N'0988320463', N'205 Hai Bà Trưng, Q.7, Hà Nội', 26, 4174, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (24, N'Trần Hữu Dũng', N'0994214382', N'82 Nguyễn Thị Minh Khai, TP.Thủ Đức, TP.HCM', 27, 3152, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (25, N'Dương Tuấn Sơn', N'0984252722', N'6 Trần Hưng Đạo, Q.Phú Nhuận, Đà Nẵng', 28, 5250, 5)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (26, N'Đặng Thành Dũng', N'0970897765', N'2 Điện Biên Phủ, Q.Phú Nhuận, Hà Nội', 29, 4158, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (27, N'Đặng Mai Yến', N'0936697396', N'79 Hai Bà Trưng, Q.5, Bình Dương', 30, 4344, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (28, N'Bùi Thu Lan', N'0925014631', N'186 Điện Biên Phủ, Q.7, TP.HCM', 31, 1973, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (29, N'Lê Ngọc Xuân', N'0975228535', N'36 Lý Thường Kiệt, Q.5, Hà Nội', 32, 5404, 5)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (30, N'Huỳnh Quang Bình', N'0991415657', N'217 Cách Mạng Tháng 8, Q.Phú Nhuận, Đồng Nai', 33, 5651, 5)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (31, N'Đặng Thành Hải', N'0997225156', N'192 Phan Xích Long, Q.Phú Nhuận, Cần Thơ', 34, 991, 3)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (32, N'Lê Minh Nam', N'0988961459', N'284 Cách Mạng Tháng 8, TP.Thủ Đức, Hà Nội', 35, 58, 1)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (33, N'Trần Công Hùng', N'0914216175', N'170 Trần Hưng Đạo, Q.Phú Nhuận, Hà Nội', 36, 2281, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (34, N'Phan Mai Linh', N'0986644106', N'296 Phan Xích Long, Q.7, Cần Thơ', 37, 3334, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (35, N'Phạm Thành Khoa', N'0966851760', N'211 Phan Xích Long, Q.1, Đồng Nai', 38, 5353, 5)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (36, N'Phạm Thị Chi', N'0955540424', N'56 Cách Mạng Tháng 8, Q.7, Hà Nội', 39, 4393, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (37, N'Ngô Đức Sơn', N'0972092888', N'128 Trần Hưng Đạo, Q.Gò Vấp, Bình Dương', 40, 802, 3)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (38, N'Nguyễn Hữu Toàn', N'0941726318', N'86 Nguyễn Thị Minh Khai, Q.Gò Vấp, Cần Thơ', 41, 1751, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (39, N'Trần Thanh Chi', N'0910289289', N'200 Điện Biên Phủ, Q.Gò Vấp, Đà Nẵng', 42, 3465, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (40, N'Lý Thanh Trang', N'0949823450', N'112 Lê Lợi, TP.Thủ Đức, Đồng Nai', 43, 4441, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (41, N'Bùi Văn Nam', N'0988406989', N'245 Lý Thường Kiệt, Q.Phú Nhuận, Hà Nội', 44, 465, 3)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (42, N'Lê Thanh Hoa', N'0989864260', N'35 Cách Mạng Tháng 8, Q.Tân Bình, TP.HCM', 45, 4666, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (43, N'Trần Trọng Hùng', N'0966267415', N'299 Võ Văn Tần, Q.Phú Nhuận, Đà Nẵng', 46, 2136, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (44, N'Bùi Công Sơn', N'0963121477', N'68 Điện Biên Phủ, Q.Gò Vấp, Đà Nẵng', 47, 594, 3)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (45, N'Phạm Hữu Bình', N'0938609087', N'260 Điện Biên Phủ, Q.5, Đà Nẵng', 48, 563, 3)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (46, N'Đỗ Diễm Linh', N'0968812137', N'279 Điện Biên Phủ, TP.Thủ Đức, Đồng Nai', 49, 4333, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (47, N'Đặng Hữu Toàn', N'0928024248', N'136 Trần Hưng Đạo, Q.3, Đồng Nai', 50, 4532, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (48, N'Đặng Trọng Long', N'0956020613', N'105 Điện Biên Phủ, Q.Phú Nhuận, Cần Thơ', 51, 2057, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (49, N'Trần Ngọc Vy', N'0966851377', N'142 Lê Lợi, Q.1, Đà Nẵng', 52, 1071, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (50, N'Võ Thanh Xuân', N'0969302158', N'283 Nguyễn Thị Minh Khai, Q.Phú Nhuận, TP.HCM', 53, 916, 3)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (51, N'Hoàng Tuấn Nam', N'0959555330', N'299 Lý Thường Kiệt, Q.5, Cần Thơ', 54, 1044, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (52, N'Đỗ Văn Toàn', N'0958024342', N'108 Cách Mạng Tháng 8, Q.3, Đà Nẵng', 55, 4586, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (53, N'Ngô Tuyết Xuân', N'0930743797', N'122 Nguyễn Trãi, Q.5, Cần Thơ', 56, 203, 2)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (54, N'Bùi Thành Vinh', N'0999913412', N'128 Điện Biên Phủ, Q.5, Đồng Nai', 57, 885, 3)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (55, N'Trần Anh Long', N'0936786211', N'236 Hai Bà Trưng, Q.10, Hà Nội', 58, 1826, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (56, N'Phan Thành Khoa', N'0947393469', N'36 Điện Biên Phủ, Q.Bình Thạnh, Đồng Nai', 59, 4173, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (57, N'Bùi Văn Hùng', N'0945059710', N'92 Võ Văn Tần, Q.10, TP.HCM', 60, 888, 3)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (58, N'Đỗ Hồng Chi', N'0991363974', N'262 Trần Hưng Đạo, Q.Tân Bình, Bình Dương', 61, 1557, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (59, N'Ngô Văn Bình', N'0982269803', N'101 Hai Bà Trưng, Q.Tân Bình, TP.HCM', 62, 5441, 5)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (60, N'Bùi Ngọc Xuân', N'0950308572', N'260 Điện Biên Phủ, Q.Tân Bình, Đà Nẵng', 63, 3296, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (61, N'Hoàng Kim Chi', N'0999245317', N'195 Nguyễn Trãi, TP.Thủ Đức, Bình Dương', 64, 2465, 4)
INSERT [dbo].[KhachHang] ([MaKH], [HoTen], [SDT], [DiaChi], [MaTK], [DiemTichLuy], [MaHang]) VALUES (62, N'Nguyễn Quang Sơn', N'0938210242', N'221 Võ Văn Tần, TP.Thủ Đức, Đồng Nai', 65, 2639, 4)
SET IDENTITY_INSERT [dbo].[KhachHang] OFF
GO

-- ============================================================
-- 3) NHANVIEN: +15 nhân viên mới (MaNV 12 -> 26)
--    (Ghi chú: không thêm đủ 50 vì đây là bảng nhân sự nội bộ, số lượng lớn sẽ không thực tế)
-- ============================================================
SET IDENTITY_INSERT [dbo].[NhanVien] ON
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (12, N'NV00012', N'Dương Công Bình', N'Nam', CAST(N'2000-12-06' AS Date), N'0998429450', N'44 Điện Biên Phủ, Q.Phú Nhuận, Đồng Nai', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (13, N'NV00013', N'Bùi Ngọc Hạnh', N'Nữ', CAST(N'1992-11-10' AS Date), N'0940150759', N'102 Nguyễn Trãi, Q.1, TP.HCM', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (14, N'NV00014', N'Lý Trọng Quân', N'Nam', CAST(N'1987-08-14' AS Date), N'0994525678', N'295 Cách Mạng Tháng 8, Q.Tân Bình, Cần Thơ', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (15, N'NV00015', N'Hoàng Văn Toàn', N'Nam', CAST(N'1988-07-08' AS Date), N'0933607110', N'266 Phan Xích Long, Q.1, Bình Dương', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (16, N'NV00016', N'Phạm Anh Dũng', N'Nam', CAST(N'1999-11-17' AS Date), N'0985017682', N'163 Phan Xích Long, TP.Thủ Đức, Đồng Nai', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (17, N'NV00017', N'Ngô Mai My', N'Nữ', CAST(N'1990-12-28' AS Date), N'0973709724', N'231 Điện Biên Phủ, Q.7, Đồng Nai', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (18, N'NV00018', N'Lý Công Sơn', N'Nam', CAST(N'1999-02-23' AS Date), N'0948349783', N'121 Điện Biên Phủ, Q.Bình Thạnh, Đà Nẵng', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (19, N'NV00019', N'Lê Thanh Linh', N'Nữ', CAST(N'1992-07-23' AS Date), N'0930509175', N'110 Trần Hưng Đạo, Q.Tân Bình, Cần Thơ', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (20, N'NV00020', N'Dương Thành Nam', N'Nam', CAST(N'1991-07-13' AS Date), N'0988393811', N'11 Võ Văn Tần, Q.Tân Bình, Cần Thơ', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (21, N'NV00021', N'Đỗ Quang Vinh', N'Nam', CAST(N'1997-07-18' AS Date), N'0983300637', N'113 Phan Xích Long, Q.7, Đà Nẵng', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (22, N'NV00022', N'Nguyễn Thành Khoa', N'Nam', CAST(N'1997-12-06' AS Date), N'0972732043', N'66 Võ Văn Tần, Q.Phú Nhuận, TP.HCM', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (23, N'NV00023', N'Nguyễn Ngọc Vy', N'Nữ', CAST(N'1998-03-28' AS Date), N'0971968116', N'94 Lê Lợi, Q.10, Cần Thơ', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (24, N'NV00024', N'Dương Minh Khoa', N'Nam', CAST(N'1997-05-25' AS Date), N'0966581473', N'130 Trần Hưng Đạo, Q.Gò Vấp, TP.HCM', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (25, N'NV00025', N'Trần Hồng Trang', N'Nữ', CAST(N'1987-11-02' AS Date), N'0914164775', N'127 Cách Mạng Tháng 8, Q.1, Bình Dương', NULL)
INSERT [dbo].[NhanVien] ([MaNV], [MaSoNhanVien], [HoTen], [GioiTinh], [NgaySinh], [SDT], [DiaChi], [MaTK]) VALUES (26, N'NV00026', N'Hoàng Anh Hải', N'Nam', CAST(N'1988-10-07' AS Date), N'0972415804', N'132 Hai Bà Trưng, Q.5, Bình Dương', NULL)
SET IDENTITY_INSERT [dbo].[NhanVien] OFF
GO

-- ============================================================
-- 4) NHACUNGCAP: +15 nhà cung cấp mới (MaNCC 11 -> 25)
--    (Ghi chú: bảng danh mục nhà cung cấp, +15 là mức hợp lý; có thể tự nhân thêm nếu cần đúng 50)
-- ============================================================
SET IDENTITY_INSERT [dbo].[NhaCungCap] ON
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (11, N'Công ty CP Văn phòng phẩm Bến Nghé', N'59 Nguyễn Trãi, Q.10, TP.HCM', N'02839708718', N'contact11@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (12, N'Công ty TNHH Vĩnh Tiến', N'14 Điện Biên Phủ, TP.Thủ Đức, Đồng Nai', N'02836296605', N'contact12@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (13, N'Công ty CP Giấy Sài Gòn', N'204 Cách Mạng Tháng 8, Q.3, Bình Dương', N'02834074336', N'contact13@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (14, N'Công ty TNHH Deli Việt Nam', N'53 Điện Biên Phủ, TP.Thủ Đức, TP.HCM', N'02839494772', N'contact14@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (15, N'Công ty CP VPP Hải Long', N'22 Hai Bà Trưng, Q.Phú Nhuận, Cần Thơ', N'02836217147', N'contact15@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (16, N'Công ty TNHH Colokit', N'36 Lý Thường Kiệt, Q.Bình Thạnh, TP.HCM', N'02837047416', N'contact16@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (17, N'Công ty CP Bảo Ngọc', N'251 Trần Hưng Đạo, Q.Tân Bình, Đà Nẵng', N'02837713146', N'contact17@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (18, N'Công ty TNHH Kim Đan', N'79 Nguyễn Thị Minh Khai, Q.5, Đồng Nai', N'02838753457', N'contact18@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (19, N'Công ty CP Song Nguyên', N'139 Võ Văn Tần, Q.Phú Nhuận, Cần Thơ', N'02837799287', N'contact19@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (20, N'Công ty TNHH VPP Minh Phát', N'224 Võ Văn Tần, Q.10, Đà Nẵng', N'02834118725', N'contact20@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (21, N'Công ty CP Đại Á', N'45 Điện Biên Phủ, Q.Gò Vấp, Hà Nội', N'02837796514', N'contact21@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (22, N'Công ty TNHH Thành Phát', N'292 Võ Văn Tần, Q.Tân Bình, Đà Nẵng', N'02830481506', N'contact22@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (23, N'Công ty CP Nam Việt', N'254 Hai Bà Trưng, Q.5, Cần Thơ', N'02833558780', N'contact23@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (24, N'Công ty TNHH Á Đông', N'182 Điện Biên Phủ, Q.Bình Thạnh, Đà Nẵng', N'02834635017', N'contact24@vpp.com.vn')
INSERT [dbo].[NhaCungCap] ([MaNCC], [TenNCC], [DiaChi], [SDT], [Email]) VALUES (25, N'Công ty CP Toàn Cầu VPP', N'285 Lê Lợi, Q.Phú Nhuận, Hà Nội', N'02831436347', N'contact25@vpp.com.vn')
SET IDENTITY_INSERT [dbo].[NhaCungCap] OFF
GO

-- ============================================================
-- 5) THUONGHIEU: +10 thương hiệu mới (MaTH 11 -> 20)
-- ============================================================
SET IDENTITY_INSERT [dbo].[ThuongHieu] ON
INSERT [dbo].[ThuongHieu] ([MaTH], [TenTH], [QuocGia], [MoTa]) VALUES (11, N'Bến Nghé', N'Việt Nam', N'Thương hiệu văn phòng phẩm Bến Nghé')
INSERT [dbo].[ThuongHieu] ([MaTH], [TenTH], [QuocGia], [MoTa]) VALUES (12, N'Vĩnh Tiến', N'Việt Nam', N'Thương hiệu văn phòng phẩm Vĩnh Tiến')
INSERT [dbo].[ThuongHieu] ([MaTH], [TenTH], [QuocGia], [MoTa]) VALUES (13, N'Deli', N'Trung Quốc', N'Thương hiệu văn phòng phẩm Deli')
INSERT [dbo].[ThuongHieu] ([MaTH], [TenTH], [QuocGia], [MoTa]) VALUES (14, N'Colokit', N'Việt Nam', N'Thương hiệu văn phòng phẩm Colokit')
INSERT [dbo].[ThuongHieu] ([MaTH], [TenTH], [QuocGia], [MoTa]) VALUES (15, N'Kim Đan', N'Việt Nam', N'Thương hiệu văn phòng phẩm Kim Đan')
INSERT [dbo].[ThuongHieu] ([MaTH], [TenTH], [QuocGia], [MoTa]) VALUES (16, N'Camlin', N'Ấn Độ', N'Thương hiệu văn phòng phẩm Camlin')
INSERT [dbo].[ThuongHieu] ([MaTH], [TenTH], [QuocGia], [MoTa]) VALUES (17, N'Zebra', N'Nhật Bản', N'Thương hiệu văn phòng phẩm Zebra')
INSERT [dbo].[ThuongHieu] ([MaTH], [TenTH], [QuocGia], [MoTa]) VALUES (18, N'Faber-Castell', N'Đức', N'Thương hiệu văn phòng phẩm Faber-Castell')
INSERT [dbo].[ThuongHieu] ([MaTH], [TenTH], [QuocGia], [MoTa]) VALUES (19, N'Stabilo', N'Đức', N'Thương hiệu văn phòng phẩm Stabilo')
INSERT [dbo].[ThuongHieu] ([MaTH], [TenTH], [QuocGia], [MoTa]) VALUES (20, N'Maped', N'Pháp', N'Thương hiệu văn phòng phẩm Maped')
SET IDENTITY_INSERT [dbo].[ThuongHieu] OFF
GO
-- ============================================================
-- 6) LOAISP: +8 loại sản phẩm mới (MaLoaiSP 11 -> 18)
--    (Ghi chú: bảng danh mục loại sản phẩm, chỉ cần đủ phong phú, không ép đúng 50)
-- ============================================================
SET IDENTITY_INSERT [dbo].[LoaiSP] ON
INSERT [dbo].[LoaiSP] ([MaLoaiSP], [TenLoai], [MoTa]) VALUES (11, N'Bút chì màu', N'Bút chì màu, bút sáp màu cho học sinh và người vẽ')
INSERT [dbo].[LoaiSP] ([MaLoaiSP], [TenLoai], [MoTa]) VALUES (12, N'Dụng cụ đo vẽ', N'Thước kẻ, compa, ê ke các loại')
INSERT [dbo].[LoaiSP] ([MaLoaiSP], [TenLoai], [MoTa]) VALUES (13, N'Băng keo & Hồ dán', N'Băng dính, hồ dán, keo dán giấy')
INSERT [dbo].[LoaiSP] ([MaLoaiSP], [TenLoai], [MoTa]) VALUES (14, N'Bìa & File hồ sơ', N'Bìa còng, file kẹp tài liệu')
INSERT [dbo].[LoaiSP] ([MaLoaiSP], [TenLoai], [MoTa]) VALUES (15, N'Giấy note & Sticker', N'Giấy nhớ, sticker trang trí')
INSERT [dbo].[LoaiSP] ([MaLoaiSP], [TenLoai], [MoTa]) VALUES (16, N'Balo & Túi đựng', N'Balo học sinh, túi đựng bút')
INSERT [dbo].[LoaiSP] ([MaLoaiSP], [TenLoai], [MoTa]) VALUES (17, N'Máy tính cầm tay', N'Máy tính bỏ túi học sinh, văn phòng')
INSERT [dbo].[LoaiSP] ([MaLoaiSP], [TenLoai], [MoTa]) VALUES (18, N'Mực & Ruột bút', N'Mực bút máy, ruột bút bi thay thế')
SET IDENTITY_INSERT [dbo].[LoaiSP] OFF
GO

-- ============================================================
-- 7) HANGKHACHHANG: +2 hạng mới (MaHang 6 -> 7)
--    (Ghi chú: bảng cấu hình hạng thành viên, số lượng bản ghi luôn rất nhỏ, KHÔNG thêm 50 dòng)
-- ============================================================
SET IDENTITY_INSERT [dbo].[HangKhachHang] ON
INSERT [dbo].[HangKhachHang] ([MaHang], [TenHang], [DiemToiThieu], [PhanTramUuDai]) VALUES (6, N'Titan', 8000, 25)
INSERT [dbo].[HangKhachHang] ([MaHang], [TenHang], [DiemToiThieu], [PhanTramUuDai]) VALUES (7, N'Huyền Thoại', 15000, 30)
SET IDENTITY_INSERT [dbo].[HangKhachHang] OFF
GO

-- ============================================================
-- 8) PHUONGTHUCTHANHTOAN: +2 phương thức mới (MaPTTT 5 -> 6, 6 đã tồn tại nên dùng 5,7)
--    (Ghi chú: bảng danh mục phương thức thanh toán, số lượng luôn rất nhỏ, KHÔNG thêm 50 dòng)
-- ============================================================
SET IDENTITY_INSERT [dbo].[PhuongThucThanhToan] ON
INSERT [dbo].[PhuongThucThanhToan] ([MaPTTT], [TenPhuongThuc], [MaCode], [HinhAnh], [GhiChu], [TrangThai]) VALUES (5, N'ZaloPay', N'ZALOPAY', NULL, N'Thanh toán qua ví điện tử ZaloPay', 1)
INSERT [dbo].[PhuongThucThanhToan] ([MaPTTT], [TenPhuongThuc], [MaCode], [HinhAnh], [GhiChu], [TrangThai]) VALUES (7, N'VNPay', N'VNPAY', NULL, N'Thanh toán qua cổng VNPay', 1)
SET IDENTITY_INSERT [dbo].[PhuongThucThanhToan] OFF
GO

-- ============================================================
-- 9) SANPHAM: +50 sản phẩm mới (MaSP 12 -> 61)
-- ============================================================
SET IDENTITY_INSERT [dbo].[SanPham] ON
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (12, N'Bút bi Pentel B992', N'Bút bi ngòi 0.5mm, mực đều, viết êm tay', CAST(10000 AS Decimal(18, 0)), 209, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368012/LV_sanphams/sample012.jpg', 4, 15, 10, 200)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (13, N'Bìa còng Camlin A4', N'Bìa còng đựng tài liệu, khổ A4', CAST(34000 AS Decimal(18, 0)), 241, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368013/LV_sanphams/sample013.jpg', 12, 20, 16, 100)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (14, N'Ruột bút bi Faber-Castell', N'Ruột bút bi thay thế, mực đậm', CAST(4000 AS Decimal(18, 0)), 49, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368014/LV_sanphams/sample014.jpg', 4, 4, 18, 300)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (15, N'Bút chì màu Deli hộp 12 màu', N'Bút chì màu học sinh, màu sắc tươi sáng', CAST(36000 AS Decimal(18, 0)), 447, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368015/LV_sanphams/sample015.jpg', 5, 25, 5, 50)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (16, N'Bút chì màu Maped hộp 12 màu', N'Bút chì màu học sinh, màu sắc tươi sáng', CAST(38000 AS Decimal(18, 0)), 113, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368016/LV_sanphams/sample016.jpg', 3, 2, 20, 50)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (17, N'Bìa còng Hồng Hà A4', N'Bìa còng đựng tài liệu, khổ A4', CAST(19000 AS Decimal(18, 0)), 449, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368017/LV_sanphams/sample017.jpg', 10, 9, 2, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (18, N'Bút lông bảng Bến Nghé', N'Bút lông viết bảng trắng, dễ lau', CAST(9000 AS Decimal(18, 0)), 458, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368018/LV_sanphams/sample018.jpg', 2, 4, 3, 300)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (19, N'Ruột bút bi Maped', N'Ruột bút bi thay thế, mực đậm', CAST(5000 AS Decimal(18, 0)), 189, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368019/LV_sanphams/sample019.jpg', 15, 6, 20, 100)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (20, N'Vở kẻ ngang Bến Nghé C61 trang', N'Vở học sinh giấy trắng, bìa đẹp', CAST(17000 AS Decimal(18, 0)), 157, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368020/LV_sanphams/sample020.jpg', 6, 22, 3, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (21, N'Bìa còng Bến Nghé A4', N'Bìa còng đựng tài liệu, khổ A4', CAST(21000 AS Decimal(18, 0)), 172, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368021/LV_sanphams/sample021.jpg', 12, 23, 3, 50)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (22, N'Bút chì màu Hồng Hà hộp 12 màu', N'Bút chì màu học sinh, màu sắc tươi sáng', CAST(33000 AS Decimal(18, 0)), 328, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368022/LV_sanphams/sample022.jpg', 3, 12, 2, 300)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (23, N'Vở kẻ ngang Bến Nghé B597 trang', N'Vở học sinh giấy trắng, bìa đẹp', CAST(20000 AS Decimal(18, 0)), 177, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368023/LV_sanphams/sample023.jpg', 18, 14, 3, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (24, N'Băng keo trong Stabilo', N'Băng keo dán đa năng, độ bám cao', CAST(5000 AS Decimal(18, 0)), 74, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368024/LV_sanphams/sample024.jpg', 4, 5, 19, 300)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (25, N'Balo học sinh Thiên Long', N'Balo chống thấm, nhiều ngăn tiện lợi', CAST(333000 AS Decimal(18, 0)), 292, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368025/LV_sanphams/sample025.jpg', 9, 25, 1, 50)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (26, N'Balo học sinh Kim Đan', N'Balo chống thấm, nhiều ngăn tiện lợi', CAST(248000 AS Decimal(18, 0)), 64, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368026/LV_sanphams/sample026.jpg', 2, 3, 15, 200)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (27, N'Balo học sinh Kim Đan', N'Balo chống thấm, nhiều ngăn tiện lợi', CAST(325000 AS Decimal(18, 0)), 498, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368027/LV_sanphams/sample027.jpg', 13, 9, 7, 100)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (28, N'Bìa còng Stabilo A4', N'Bìa còng đựng tài liệu, khổ A4', CAST(28000 AS Decimal(18, 0)), 223, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368028/LV_sanphams/sample028.jpg', 2, 6, 19, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (29, N'Hồ dán Colokit', N'Hồ dán giấy dạng thỏi, an toàn cho học sinh', CAST(9000 AS Decimal(18, 0)), 46, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368029/LV_sanphams/sample029.jpg', 8, 10, 6, 200)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (30, N'Sổ tay bìa da Vĩnh Tiến', N'Sổ tay ghi chép, bìa da cao cấp', CAST(38000 AS Decimal(18, 0)), 216, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368030/LV_sanphams/sample030.jpg', 13, 8, 12, 300)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (31, N'Bút bi Kim Đan Z72', N'Bút bi ngòi 0.5mm, mực đều, viết êm tay', CAST(4000 AS Decimal(18, 0)), 33, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368031/LV_sanphams/sample031.jpg', 18, 20, 15, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (32, N'Ruột bút bi Zebra', N'Ruột bút bi thay thế, mực đậm', CAST(7000 AS Decimal(18, 0)), 77, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368032/LV_sanphams/sample032.jpg', 12, 9, 17, 100)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (33, N'Sổ tay bìa da Deli', N'Sổ tay ghi chép, bìa da cao cấp', CAST(50000 AS Decimal(18, 0)), 99, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368033/LV_sanphams/sample033.jpg', 1, 4, 5, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (34, N'Balo học sinh Camlin', N'Balo chống thấm, nhiều ngăn tiện lợi', CAST(309000 AS Decimal(18, 0)), 232, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368034/LV_sanphams/sample034.jpg', 13, 14, 8, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (35, N'Bút gel Thiên Long B395', N'Bút gel mực nhanh khô, nhiều màu sắc', CAST(6000 AS Decimal(18, 0)), 188, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368035/LV_sanphams/sample035.jpg', 9, 18, 1, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (36, N'Vở kẻ ngang Faber-Castell Z165 trang', N'Vở học sinh giấy trắng, bìa đẹp', CAST(19000 AS Decimal(18, 0)), 144, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368036/LV_sanphams/sample036.jpg', 8, 2, 18, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (37, N'Bút gel Zebra X726', N'Bút gel mực nhanh khô, nhiều màu sắc', CAST(9000 AS Decimal(18, 0)), 448, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368037/LV_sanphams/sample037.jpg', 3, 16, 9, 200)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (38, N'Balo học sinh Bến Nghé', N'Balo chống thấm, nhiều ngăn tiện lợi', CAST(207000 AS Decimal(18, 0)), 25, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368038/LV_sanphams/sample038.jpg', 7, 16, 11, 200)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (39, N'Giấy note Deli', N'Giấy nhớ nhiều màu, dễ bóc dán', CAST(13000 AS Decimal(18, 0)), 173, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368039/LV_sanphams/sample039.jpg', 16, 15, 5, 200)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (40, N'Thước kẻ Faber-Castell 20cm', N'Thước nhựa trong, vạch chia rõ ràng', CAST(6000 AS Decimal(18, 0)), 332, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368040/LV_sanphams/sample040.jpg', 14, 17, 18, 50)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (41, N'Ruột bút bi Stabilo', N'Ruột bút bi thay thế, mực đậm', CAST(7000 AS Decimal(18, 0)), 496, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368041/LV_sanphams/sample041.jpg', 5, 20, 19, 200)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (42, N'Balo học sinh Thiên Long', N'Balo chống thấm, nhiều ngăn tiện lợi', CAST(313000 AS Decimal(18, 0)), 378, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368042/LV_sanphams/sample042.jpg', 8, 7, 1, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (43, N'Sổ tay bìa da Maped', N'Sổ tay ghi chép, bìa da cao cấp', CAST(41000 AS Decimal(18, 0)), 106, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368043/LV_sanphams/sample043.jpg', 15, 14, 20, 50)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (44, N'Thước kẻ Bến Nghé 20cm', N'Thước nhựa trong, vạch chia rõ ràng', CAST(5000 AS Decimal(18, 0)), 375, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368044/LV_sanphams/sample044.jpg', 16, 5, 3, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (45, N'Bút gel Bến Nghé C350', N'Bút gel mực nhanh khô, nhiều màu sắc', CAST(10000 AS Decimal(18, 0)), 71, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368045/LV_sanphams/sample045.jpg', 13, 23, 11, 300)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (46, N'Băng keo trong Bến Nghé', N'Băng keo dán đa năng, độ bám cao', CAST(8000 AS Decimal(18, 0)), 141, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368046/LV_sanphams/sample046.jpg', 15, 6, 11, 300)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (47, N'Bộ compa Pentel', N'Compa vẽ kỹ thuật, đầu chì thay được', CAST(33000 AS Decimal(18, 0)), 170, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368047/LV_sanphams/sample047.jpg', 2, 6, 10, 100)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (48, N'Thước kẻ Deli 20cm', N'Thước nhựa trong, vạch chia rõ ràng', CAST(3000 AS Decimal(18, 0)), 111, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368048/LV_sanphams/sample048.jpg', 17, 23, 5, 200)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (49, N'Balo học sinh Kim Đan', N'Balo chống thấm, nhiều ngăn tiện lợi', CAST(277000 AS Decimal(18, 0)), 218, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368049/LV_sanphams/sample049.jpg', 6, 9, 7, 100)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (50, N'Ruột bút bi Vĩnh Tiến', N'Ruột bút bi thay thế, mực đậm', CAST(4000 AS Decimal(18, 0)), 72, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368050/LV_sanphams/sample050.jpg', 14, 10, 4, 300)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (51, N'Hồ dán Zebra', N'Hồ dán giấy dạng thỏi, an toàn cho học sinh', CAST(8000 AS Decimal(18, 0)), 374, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368051/LV_sanphams/sample051.jpg', 13, 2, 9, 100)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (52, N'Bút chì màu Stabilo hộp 12 màu', N'Bút chì màu học sinh, màu sắc tươi sáng', CAST(34000 AS Decimal(18, 0)), 307, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368052/LV_sanphams/sample052.jpg', 18, 21, 19, 50)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (53, N'Bút gel Thiên Long X503', N'Bút gel mực nhanh khô, nhiều màu sắc', CAST(6000 AS Decimal(18, 0)), 167, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368053/LV_sanphams/sample053.jpg', 7, 15, 1, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (54, N'Balo học sinh Bến Nghé', N'Balo chống thấm, nhiều ngăn tiện lợi', CAST(272000 AS Decimal(18, 0)), 95, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368054/LV_sanphams/sample054.jpg', 12, 1, 3, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (55, N'Bút gel Zebra C953', N'Bút gel mực nhanh khô, nhiều màu sắc', CAST(5000 AS Decimal(18, 0)), 65, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368055/LV_sanphams/sample055.jpg', 11, 6, 9, 100)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (56, N'Bút bi Vĩnh Tiến B342', N'Bút bi ngòi 0.5mm, mực đều, viết êm tay', CAST(4000 AS Decimal(18, 0)), 232, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368056/LV_sanphams/sample056.jpg', 2, 1, 12, 50)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (57, N'Giấy note Bến Nghé', N'Giấy nhớ nhiều màu, dễ bóc dán', CAST(7000 AS Decimal(18, 0)), 495, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368057/LV_sanphams/sample057.jpg', 7, 8, 3, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (58, N'Bút bi Deli A925', N'Bút bi ngòi 0.5mm, mực đều, viết êm tay', CAST(4000 AS Decimal(18, 0)), 70, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368058/LV_sanphams/sample058.jpg', 1, 3, 13, 0)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (59, N'Bìa còng Zebra A4', N'Bìa còng đựng tài liệu, khổ A4', CAST(26000 AS Decimal(18, 0)), 223, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368059/LV_sanphams/sample059.jpg', 6, 6, 17, 100)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (60, N'Giấy note Bến Nghé', N'Giấy nhớ nhiều màu, dễ bóc dán', CAST(15000 AS Decimal(18, 0)), 230, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368060/LV_sanphams/sample060.jpg', 14, 22, 11, 200)
INSERT [dbo].[SanPham] ([MaSP], [TenSP], [MoTa], [Gia], [SoLuongTon], [HinhAnh], [MaLoai], [MaNCC], [MaTH], [CanNang]) VALUES (61, N'Bộ compa Kim Đan', N'Compa vẽ kỹ thuật, đầu chì thay được', CAST(21000 AS Decimal(18, 0)), 246, N'https://res.cloudinary.com/dqwwor2vx/image/upload/v1782368061/LV_sanphams/sample061.jpg', 16, 1, 15, 50)
SET IDENTITY_INSERT [dbo].[SanPham] OFF
GO

-- ============================================================
-- 10) KHUYENMAI: +12 chương trình khuyến mãi mới (MaKM 12 -> 23)
-- ============================================================
SET IDENTITY_INSERT [dbo].[KhuyenMai] ON
INSERT [dbo].[KhuyenMai] ([MaKM], [TenKM], [NgayBatDau], [NgayKetThuc], [PhanTramGiam], [DieuKienApDung]) VALUES (12, N'Flash Sale cuối tuần', CAST(N'2026-09-05' AS Date), CAST(N'2026-09-26' AS Date), 5, N'Áp dụng cho đơn hàng từ 100.000đ')
INSERT [dbo].[KhuyenMai] ([MaKM], [TenKM], [NgayBatDau], [NgayKetThuc], [PhanTramGiam], [DieuKienApDung]) VALUES (13, N'Giảm giá mùa tựu trường', CAST(N'2026-02-03' AS Date), CAST(N'2026-02-24' AS Date), 5, N'Áp dụng cho đơn hàng từ 200.000đ')
INSERT [dbo].[KhuyenMai] ([MaKM], [TenKM], [NgayBatDau], [NgayKetThuc], [PhanTramGiam], [DieuKienApDung]) VALUES (14, N'Ưu đãi khách hàng thân thiết', CAST(N'2026-02-04' AS Date), CAST(N'2026-02-11' AS Date), 30, N'Áp dụng cho đơn hàng từ 150.000đ')
INSERT [dbo].[KhuyenMai] ([MaKM], [TenKM], [NgayBatDau], [NgayKetThuc], [PhanTramGiam], [DieuKienApDung]) VALUES (15, N'Sale sinh nhật cửa hàng', CAST(N'2026-12-17' AS Date), CAST(N'2027-01-09' AS Date), 20, N'Áp dụng cho đơn hàng từ 100.000đ')
INSERT [dbo].[KhuyenMai] ([MaKM], [TenKM], [NgayBatDau], [NgayKetThuc], [PhanTramGiam], [DieuKienApDung]) VALUES (16, N'Khuyến mãi mùa hè', CAST(N'2026-08-01' AS Date), CAST(N'2026-08-15' AS Date), 15, N'Áp dụng cho đơn hàng từ 150.000đ')
INSERT [dbo].[KhuyenMai] ([MaKM], [TenKM], [NgayBatDau], [NgayKetThuc], [PhanTramGiam], [DieuKienApDung]) VALUES (17, N'Giảm giá đồ dùng vẽ', CAST(N'2026-02-13' AS Date), CAST(N'2026-02-22' AS Date), 10, N'Áp dụng cho đơn hàng từ 50.000đ')
INSERT [dbo].[KhuyenMai] ([MaKM], [TenKM], [NgayBatDau], [NgayKetThuc], [PhanTramGiam], [DieuKienApDung]) VALUES (18, N'Ưu đãi bút viết tháng 8', CAST(N'2026-09-20' AS Date), CAST(N'2026-09-29' AS Date), 30, N'Áp dụng cho đơn hàng từ 50.000đ')
INSERT [dbo].[KhuyenMai] ([MaKM], [TenKM], [NgayBatDau], [NgayKetThuc], [PhanTramGiam], [DieuKienApDung]) VALUES (19, N'Sale sổ tay - vở học sinh', CAST(N'2026-07-02' AS Date), CAST(N'2026-07-30' AS Date), 5, N'Áp dụng cho đơn hàng từ 100.000đ')
INSERT [dbo].[KhuyenMai] ([MaKM], [TenKM], [NgayBatDau], [NgayKetThuc], [PhanTramGiam], [DieuKienApDung]) VALUES (20, N'Khuyến mãi balo học sinh', CAST(N'2026-12-04' AS Date), CAST(N'2026-12-28' AS Date), 25, N'Áp dụng cho đơn hàng từ 200.000đ')
INSERT [dbo].[KhuyenMai] ([MaKM], [TenKM], [NgayBatDau], [NgayKetThuc], [PhanTramGiam], [DieuKienApDung]) VALUES (21, N'Giảm giá dụng cụ văn phòng', CAST(N'2026-09-01' AS Date), CAST(N'2026-09-19' AS Date), 30, N'Áp dụng cho đơn hàng từ 150.000đ')
INSERT [dbo].[KhuyenMai] ([MaKM], [TenKM], [NgayBatDau], [NgayKetThuc], [PhanTramGiam], [DieuKienApDung]) VALUES (22, N'Flash Sale 11.11', CAST(N'2026-06-10' AS Date), CAST(N'2026-07-08' AS Date), 20, N'Áp dụng cho đơn hàng từ 50.000đ')
INSERT [dbo].[KhuyenMai] ([MaKM], [TenKM], [NgayBatDau], [NgayKetThuc], [PhanTramGiam], [DieuKienApDung]) VALUES (23, N'Ưu đãi cuối năm 2026', CAST(N'2026-08-03' AS Date), CAST(N'2026-08-10' AS Date), 25, N'Áp dụng cho đơn hàng từ 50.000đ')
SET IDENTITY_INSERT [dbo].[KhuyenMai] OFF
GO
-- ============================================================
-- 11) DONHANG: +50 đơn hàng mới (MaDH 36 -> 85)
-- ============================================================
SET IDENTITY_INSERT [dbo].[DonHang] ON
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (36, 20, N'Lý Nhung', N'0935579304', CAST(N'2026-04-04' AS Date), N'Đang xử lý', CAST(0 AS Decimal(18, 0)), N'97 Nguyễn Trãi, Q.10, TP.HCM', NULL, 4, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (37, 57, N'Trần Bình', N'0982332559', CAST(N'2026-02-17' AS Date), N'Chờ xác nhận', CAST(0 AS Decimal(18, 0)), N'224 Trần Hưng Đạo, Q.1, TP.HCM', NULL, 3, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (38, 4, N'Phạm Quốc Tuấn', N'0901234564', CAST(N'2026-01-18' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'23 Hoàng Diệu, Q.4, TP.HCM', N'', 5, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (39, 8, N'Bùi Quang Dũng', N'0901234568', CAST(N'2026-05-11' AS Date), N'Đã giao', CAST(0 AS Decimal(18, 0)), N'67 Pasteur, Q.3, TP.HCM', NULL, 2, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (40, 3, N'Lê Thị Hoa', N'0901234563', CAST(N'2026-01-13' AS Date), N'Chờ xác nhận', CAST(0 AS Decimal(18, 0)), N'78 Nguyễn Huệ, Q.1, TP.HCM', NULL, 7, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (41, 57, N'Trần Bình', N'0982332559', CAST(N'2026-07-20' AS Date), N'Đang xử lý', CAST(0 AS Decimal(18, 0)), N'224 Trần Hưng Đạo, Q.1, TP.HCM', NULL, 7, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (42, 25, N'Đặng Tùng', N'0985628782', CAST(N'2026-04-27' AS Date), N'Đã hủy', CAST(0 AS Decimal(18, 0)), N'102 Nguyễn Thị Minh Khai, Q.3, TP.HCM', NULL, 5, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (43, 35, N'Hồ Hương', N'0956331993', CAST(N'2026-04-04' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'228 Trần Hưng Đạo, Q.10, TP.HCM', N'Giao giờ hành chính', 5, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (44, 7, N'Hoàng Thị Mai', N'0901234567', CAST(N'2026-03-09' AS Date), N'Đang giao', CAST(0 AS Decimal(18, 0)), N'34 Lý Thường Kiệt, Q.10, TP.HCM', NULL, 2, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (45, 40, N'Bùi Hải', N'0976643680', CAST(N'2026-05-13' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'75 Lê Lợi, Q.3, TP.HCM', N'Gọi trước khi giao', 5, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (46, 13, N'Ngô Hoa', N'0982742251', CAST(N'2026-04-01' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'60 Nguyễn Trãi, Q.Tân Bình, TP.HCM', N'', 7, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (47, 9, N'Ngô Thị Thu', N'0901234569', CAST(N'2026-01-13' AS Date), N'Đang xử lý', CAST(0 AS Decimal(18, 0)), N'11 Ngô Quyền, Hai Bà Trưng, Hà Nội', N'Gọi trước khi giao', 2, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (48, 28, N'Huỳnh Nhung', N'0996227982', CAST(N'2026-03-14' AS Date), N'Đang giao', CAST(0 AS Decimal(18, 0)), N'3 Võ Văn Tần, Q.10, TP.HCM', N'Gọi trước khi giao', 1, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (49, 30, N'Huỳnh My', N'0980289897', CAST(N'2026-06-18' AS Date), N'Đã hủy', CAST(0 AS Decimal(18, 0)), N'99 Lê Lợi, Q.10, TP.HCM', N'Giao giờ hành chính', 3, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (50, 54, N'Hồ Lan', N'0971419260', CAST(N'2026-01-16' AS Date), N'Đã giao', CAST(0 AS Decimal(18, 0)), N'58 Điện Biên Phủ, TP.Thủ Đức, TP.HCM', N'Gọi trước khi giao', 7, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (51, 20, N'Lý Nhung', N'0935579304', CAST(N'2026-02-24' AS Date), N'Đang giao', CAST(0 AS Decimal(18, 0)), N'97 Nguyễn Trãi, Q.10, TP.HCM', N'', 5, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (52, 1, N'Nguyễn Thị Lan', N'0901234561', CAST(N'2026-05-03' AS Date), N'Đang xử lý', CAST(0 AS Decimal(18, 0)), N'12 Lê Lợi, Q.1, TP.HCM', N'Giao giờ hành chính', 4, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (53, 34, N'Võ Sơn', N'0927760641', CAST(N'2026-06-08' AS Date), N'Đang giao', CAST(0 AS Decimal(18, 0)), N'68 Trần Hưng Đạo, Q.Gò Vấp, TP.HCM', NULL, 2, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (54, 2, N'Trần Văn Minh', N'0901234562', CAST(N'2026-05-03' AS Date), N'Đã giao', CAST(0 AS Decimal(18, 0)), N'45 Trần Hưng Đạo, Q.5, TP.HCM', N'Giao giờ hành chính', 4, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (55, 46, N'Đặng Vinh', N'0927208264', CAST(N'2026-05-28' AS Date), N'Đang xử lý', CAST(0 AS Decimal(18, 0)), N'144 Nguyễn Trãi, TP.Thủ Đức, TP.HCM', N'Gọi trước khi giao', 4, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (56, 10, N'Đinh Văn Hùng', N'0901234570', CAST(N'2026-04-10' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'29 Trần Phú, Hải Châu, Đà Nẵng', N'Gọi trước khi giao', 5, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (57, 34, N'Võ Sơn', N'0927760641', CAST(N'2026-01-12' AS Date), N'Đang giao', CAST(0 AS Decimal(18, 0)), N'68 Trần Hưng Đạo, Q.Gò Vấp, TP.HCM', NULL, 1, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (58, 58, N'Vũ Vy', N'0982092611', CAST(N'2026-05-12' AS Date), N'Đã hủy', CAST(0 AS Decimal(18, 0)), N'155 Lê Lợi, Q.5, TP.HCM', N'', 1, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (59, 23, N'Hoàng Đạt', N'0974887660', CAST(N'2026-06-06' AS Date), N'Chờ xác nhận', CAST(0 AS Decimal(18, 0)), N'234 Hai Bà Trưng, TP.Thủ Đức, TP.HCM', N'', 2, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (60, 47, N'Lê Hải', N'0982732660', CAST(N'2026-06-14' AS Date), N'Chờ xác nhận', CAST(0 AS Decimal(18, 0)), N'164 Võ Văn Tần, Q.10, TP.HCM', NULL, 3, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (61, 21, N'Vũ Yến', N'0916604148', CAST(N'2026-04-21' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'23 Nguyễn Thị Minh Khai, Q.1, TP.HCM', N'Giao giờ hành chính', 3, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (62, 7, N'Hoàng Thị Mai', N'0901234567', CAST(N'2026-06-24' AS Date), N'Đã giao', CAST(0 AS Decimal(18, 0)), N'34 Lý Thường Kiệt, Q.10, TP.HCM', N'Giao giờ hành chính', 7, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (63, 20, N'Lý Nhung', N'0935579304', CAST(N'2026-01-02' AS Date), N'Đang xử lý', CAST(0 AS Decimal(18, 0)), N'97 Nguyễn Trãi, Q.10, TP.HCM', N'', 3, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (64, 19, N'Đặng Hùng', N'0956244860', CAST(N'2026-04-17' AS Date), N'Chờ xác nhận', CAST(0 AS Decimal(18, 0)), N'198 Trần Hưng Đạo, Q.Gò Vấp, TP.HCM', N'', 3, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (65, 60, N'Nguyễn Trang', N'0989379123', CAST(N'2026-07-07' AS Date), N'Chờ xác nhận', CAST(0 AS Decimal(18, 0)), N'25 Điện Biên Phủ, Q.5, TP.HCM', N'', 7, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (66, 29, N'Lê Bình', N'0919990326', CAST(N'2026-07-17' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'4 Nguyễn Thị Minh Khai, Q.10, TP.HCM', N'Gọi trước khi giao', 2, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (67, 46, N'Đặng Vinh', N'0927208264', CAST(N'2026-07-12' AS Date), N'Đã giao', CAST(0 AS Decimal(18, 0)), N'144 Nguyễn Trãi, TP.Thủ Đức, TP.HCM', N'Gọi trước khi giao', 1, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (68, 47, N'Lê Hải', N'0982732660', CAST(N'2026-05-16' AS Date), N'Đang giao', CAST(0 AS Decimal(18, 0)), N'164 Võ Văn Tần, Q.10, TP.HCM', NULL, 5, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (69, 37, N'Trần My', N'0941437619', CAST(N'2026-07-08' AS Date), N'Đã hủy', CAST(0 AS Decimal(18, 0)), N'287 Phan Xích Long, Q.3, TP.HCM', NULL, 4, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (70, 45, N'Phạm Long', N'0962529621', CAST(N'2026-05-14' AS Date), N'Chờ xác nhận', CAST(0 AS Decimal(18, 0)), N'274 Lý Thường Kiệt, Q.1, TP.HCM', N'', 3, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (71, 43, N'Bùi Kiên', N'0911855733', CAST(N'2026-01-22' AS Date), N'Đang giao', CAST(0 AS Decimal(18, 0)), N'275 Cách Mạng Tháng 8, TP.Thủ Đức, TP.HCM', N'Giao giờ hành chính', 1, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (72, 40, N'Bùi Hải', N'0976643680', CAST(N'2026-01-02' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'75 Lê Lợi, Q.3, TP.HCM', N'Giao giờ hành chính', 1, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (73, 9, N'Ngô Thị Thu', N'0901234569', CAST(N'2026-02-09' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'11 Ngô Quyền, Hai Bà Trưng, Hà Nội', N'Gọi trước khi giao', 1, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (74, 59, N'Phan Chi', N'0953519480', CAST(N'2026-01-23' AS Date), N'Đang xử lý', CAST(0 AS Decimal(18, 0)), N'174 Phan Xích Long, Q.Gò Vấp, TP.HCM', N'Giao giờ hành chính', 5, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (75, 28, N'Huỳnh Nhung', N'0996227982', CAST(N'2026-01-02' AS Date), N'Đang xử lý', CAST(0 AS Decimal(18, 0)), N'3 Võ Văn Tần, Q.10, TP.HCM', N'Gọi trước khi giao', 1, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (76, 30, N'Huỳnh My', N'0980289897', CAST(N'2026-07-18' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'99 Lê Lợi, Q.10, TP.HCM', N'Gọi trước khi giao', 7, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (77, 24, N'Trần Bình', N'0931108322', CAST(N'2026-02-28' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'5 Cách Mạng Tháng 8, Q.1, TP.HCM', N'', 7, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (78, 3, N'Lê Thị Hoa', N'0901234563', CAST(N'2026-01-13' AS Date), N'Đang xử lý', CAST(0 AS Decimal(18, 0)), N'78 Nguyễn Huệ, Q.1, TP.HCM', N'', 3, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (79, 23, N'Hoàng Đạt', N'0974887660', CAST(N'2026-06-25' AS Date), N'Đã giao', CAST(0 AS Decimal(18, 0)), N'234 Hai Bà Trưng, TP.Thủ Đức, TP.HCM', NULL, 7, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (80, 49, N'Huỳnh Dũng', N'0933278709', CAST(N'2026-04-05' AS Date), N'Đang giao', CAST(0 AS Decimal(18, 0)), N'288 Trần Hưng Đạo, Q.5, TP.HCM', N'Gọi trước khi giao', 5, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (81, 10, N'Đinh Văn Hùng', N'0901234570', CAST(N'2026-03-09' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'29 Trần Phú, Hải Châu, Đà Nẵng', NULL, 1, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (82, 36, N'Hoàng Bình', N'0981593599', CAST(N'2026-06-23' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'258 Hai Bà Trưng, Q.7, TP.HCM', N'Gọi trước khi giao', 1, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (83, 38, N'Võ Thảo', N'0965356940', CAST(N'2026-04-26' AS Date), N'Đã giao', CAST(0 AS Decimal(18, 0)), N'72 Phan Xích Long, Q.10, TP.HCM', N'Giao giờ hành chính', 1, N'Đã thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (84, 48, N'Nguyễn Hùng', N'0937593832', CAST(N'2026-01-26' AS Date), N'Đã giao', CAST(0 AS Decimal(18, 0)), N'60 Cách Mạng Tháng 8, Q.1, TP.HCM', NULL, 7, N'Chưa thanh toán', NULL)
INSERT [dbo].[DonHang] ([MaDH], [MaKH], [HoTenNguoiNhan], [SDTNguoiNhan], [NgayDat], [TrangThai], [TongTien], [DiaChiGiaoHang], [GhiChu], [MaPTTT], [TrangThaiThanhToan], [MaGiaoDịchNgoai]) VALUES (85, 36, N'Hoàng Bình', N'0981593599', CAST(N'2026-06-03' AS Date), N'Thành công', CAST(0 AS Decimal(18, 0)), N'258 Hai Bà Trưng, Q.7, TP.HCM', N'Gọi trước khi giao', 2, N'Chưa thanh toán', NULL)
SET IDENTITY_INSERT [dbo].[DonHang] OFF
GO

-- ============================================================
-- 12) CHITIETDONHANG: chi tiết cho 50 đơn hàng mới (khoảng 2-3 sản phẩm / đơn)
-- ============================================================
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (36, 39, 1, CAST(13000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (37, 3, 1, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (37, 42, 5, CAST(313000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (37, 28, 3, CAST(28000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (38, 15, 4, CAST(36000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (38, 10, 5, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (38, 19, 1, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (39, 8, 3, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (39, 47, 3, CAST(33000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (40, 52, 2, CAST(34000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (41, 61, 5, CAST(21000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (41, 7, 4, CAST(20000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (42, 26, 1, CAST(248000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (43, 55, 1, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (43, 16, 2, CAST(38000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (43, 40, 1, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (44, 26, 3, CAST(248000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (44, 45, 2, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (44, 38, 2, CAST(207000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (45, 21, 1, CAST(21000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (45, 40, 3, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (46, 27, 4, CAST(325000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (46, 15, 1, CAST(36000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (47, 10, 2, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (47, 6, 1, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (47, 53, 5, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (48, 59, 3, CAST(26000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (49, 1, 4, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (49, 27, 4, CAST(325000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (49, 48, 5, CAST(3000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (50, 27, 5, CAST(325000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (50, 35, 4, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (50, 58, 3, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (50, 40, 5, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (51, 3, 4, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (51, 28, 4, CAST(28000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (51, 4, 4, CAST(15000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (51, 54, 4, CAST(272000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (52, 28, 4, CAST(28000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (52, 27, 2, CAST(325000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (52, 16, 4, CAST(38000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (52, 47, 1, CAST(33000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (53, 51, 2, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (53, 9, 2, CAST(25000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (54, 49, 4, CAST(277000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (54, 41, 1, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (54, 45, 5, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (54, 5, 5, CAST(18000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (55, 37, 4, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (55, 31, 1, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (55, 49, 3, CAST(277000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (56, 6, 1, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (56, 41, 2, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (57, 55, 3, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (57, 26, 2, CAST(248000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (57, 12, 4, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (58, 6, 1, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (58, 2, 2, CAST(12000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (58, 45, 3, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (59, 40, 3, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (59, 58, 2, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (59, 36, 2, CAST(19000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (59, 25, 1, CAST(333000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (60, 22, 4, CAST(33000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (60, 49, 3, CAST(277000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (60, 26, 1, CAST(248000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (61, 31, 4, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (61, 55, 5, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (61, 39, 2, CAST(13000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (61, 9, 2, CAST(25000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (62, 41, 1, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (62, 5, 2, CAST(18000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (62, 31, 4, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (63, 3, 5, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (63, 29, 5, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (63, 41, 2, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (64, 30, 2, CAST(38000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (64, 39, 2, CAST(13000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (64, 21, 4, CAST(21000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (65, 14, 2, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (65, 44, 4, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (65, 49, 4, CAST(277000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (66, 19, 3, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (67, 27, 4, CAST(325000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (67, 57, 5, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (68, 6, 4, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (69, 46, 3, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (70, 41, 1, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (70, 34, 2, CAST(309000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (70, 35, 2, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (71, 16, 5, CAST(38000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (71, 12, 3, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (71, 5, 2, CAST(18000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (72, 56, 5, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (72, 12, 1, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (72, 22, 1, CAST(33000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (72, 1, 2, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (73, 36, 5, CAST(19000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (73, 10, 3, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (73, 39, 2, CAST(13000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (73, 31, 3, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (74, 2, 3, CAST(12000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (74, 42, 1, CAST(313000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (75, 9, 3, CAST(25000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (75, 58, 1, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (75, 48, 5, CAST(3000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (76, 56, 4, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (76, 1, 3, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (76, 8, 1, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (77, 9, 4, CAST(25000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (77, 51, 5, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (77, 50, 1, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (78, 31, 3, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (78, 34, 2, CAST(309000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (78, 9, 4, CAST(25000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (78, 24, 5, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (79, 35, 2, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (80, 60, 4, CAST(15000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (80, 50, 2, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (80, 20, 4, CAST(17000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (81, 18, 1, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (81, 12, 4, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (81, 15, 1, CAST(36000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (81, 51, 4, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (82, 56, 3, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (82, 42, 3, CAST(313000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (82, 6, 5, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (82, 38, 2, CAST(207000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (83, 19, 3, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (83, 50, 4, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (83, 12, 1, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (83, 54, 3, CAST(272000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (84, 41, 1, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (85, 45, 2, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietDonHang] ([MaDH], [MaSP], [SoLuong], [DonGia]) VALUES (85, 51, 3, CAST(8000 AS Decimal(18, 0)))
GO

-- Cập nhật lại TongTien của 50 đơn hàng mới cho khớp với chi tiết đơn hàng
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(13000 AS Decimal(18,0)) WHERE [MaDH] = 36
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(1657000 AS Decimal(18,0)) WHERE [MaDH] = 37
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(189000 AS Decimal(18,0)) WHERE [MaDH] = 38
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(120000 AS Decimal(18,0)) WHERE [MaDH] = 39
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(68000 AS Decimal(18,0)) WHERE [MaDH] = 40
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(185000 AS Decimal(18,0)) WHERE [MaDH] = 41
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(248000 AS Decimal(18,0)) WHERE [MaDH] = 42
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(87000 AS Decimal(18,0)) WHERE [MaDH] = 43
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(1178000 AS Decimal(18,0)) WHERE [MaDH] = 44
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(39000 AS Decimal(18,0)) WHERE [MaDH] = 45
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(1336000 AS Decimal(18,0)) WHERE [MaDH] = 46
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(55000 AS Decimal(18,0)) WHERE [MaDH] = 47
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(78000 AS Decimal(18,0)) WHERE [MaDH] = 48
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(1335000 AS Decimal(18,0)) WHERE [MaDH] = 49
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(1691000 AS Decimal(18,0)) WHERE [MaDH] = 50
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(1292000 AS Decimal(18,0)) WHERE [MaDH] = 51
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(947000 AS Decimal(18,0)) WHERE [MaDH] = 52
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(66000 AS Decimal(18,0)) WHERE [MaDH] = 53
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(1255000 AS Decimal(18,0)) WHERE [MaDH] = 54
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(871000 AS Decimal(18,0)) WHERE [MaDH] = 55
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(23000 AS Decimal(18,0)) WHERE [MaDH] = 56
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(551000 AS Decimal(18,0)) WHERE [MaDH] = 57
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(63000 AS Decimal(18,0)) WHERE [MaDH] = 58
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(397000 AS Decimal(18,0)) WHERE [MaDH] = 59
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(1211000 AS Decimal(18,0)) WHERE [MaDH] = 60
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(117000 AS Decimal(18,0)) WHERE [MaDH] = 61
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(59000 AS Decimal(18,0)) WHERE [MaDH] = 62
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(99000 AS Decimal(18,0)) WHERE [MaDH] = 63
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(186000 AS Decimal(18,0)) WHERE [MaDH] = 64
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(1136000 AS Decimal(18,0)) WHERE [MaDH] = 65
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(15000 AS Decimal(18,0)) WHERE [MaDH] = 66
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(1335000 AS Decimal(18,0)) WHERE [MaDH] = 67
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(36000 AS Decimal(18,0)) WHERE [MaDH] = 68
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(24000 AS Decimal(18,0)) WHERE [MaDH] = 69
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(637000 AS Decimal(18,0)) WHERE [MaDH] = 70
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(256000 AS Decimal(18,0)) WHERE [MaDH] = 71
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(73000 AS Decimal(18,0)) WHERE [MaDH] = 72
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(157000 AS Decimal(18,0)) WHERE [MaDH] = 73
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(349000 AS Decimal(18,0)) WHERE [MaDH] = 74
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(94000 AS Decimal(18,0)) WHERE [MaDH] = 75
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(38000 AS Decimal(18,0)) WHERE [MaDH] = 76
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(144000 AS Decimal(18,0)) WHERE [MaDH] = 77
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(755000 AS Decimal(18,0)) WHERE [MaDH] = 78
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(12000 AS Decimal(18,0)) WHERE [MaDH] = 79
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(136000 AS Decimal(18,0)) WHERE [MaDH] = 80
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(117000 AS Decimal(18,0)) WHERE [MaDH] = 81
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(1410000 AS Decimal(18,0)) WHERE [MaDH] = 82
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(857000 AS Decimal(18,0)) WHERE [MaDH] = 83
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(7000 AS Decimal(18,0)) WHERE [MaDH] = 84
UPDATE [dbo].[DonHang] SET [TongTien] = CAST(44000 AS Decimal(18,0)) WHERE [MaDH] = 85
GO

-- ============================================================
-- 13) GIOHANG: +50 giỏ hàng mới (MaGH 15 -> 64)
-- ============================================================
SET IDENTITY_INSERT [dbo].[GioHang] ON
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (15, 1, CAST(N'2026-06-19' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (16, 33, CAST(N'2026-04-20' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (17, 10, CAST(N'2026-01-07' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (18, 60, CAST(N'2026-07-15' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (19, 7, CAST(N'2026-01-18' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (20, 56, CAST(N'2026-07-19' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (21, 31, CAST(N'2026-03-21' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (22, 5, CAST(N'2026-01-26' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (23, 11, CAST(N'2026-05-11' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (24, 38, CAST(N'2026-01-18' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (25, 40, CAST(N'2026-07-01' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (26, 16, CAST(N'2026-04-03' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (27, 44, CAST(N'2026-02-05' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (28, 16, CAST(N'2026-02-19' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (29, 17, CAST(N'2026-07-16' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (30, 47, CAST(N'2026-02-19' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (31, 23, CAST(N'2026-04-28' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (32, 39, CAST(N'2026-06-23' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (33, 54, CAST(N'2026-03-01' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (34, 7, CAST(N'2026-05-09' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (35, 30, CAST(N'2026-03-18' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (36, 4, CAST(N'2026-06-25' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (37, 23, CAST(N'2026-05-28' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (38, 12, CAST(N'2026-07-17' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (39, 18, CAST(N'2026-01-26' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (40, 41, CAST(N'2026-01-07' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (41, 58, CAST(N'2026-05-19' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (42, 32, CAST(N'2026-05-15' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (43, 57, CAST(N'2026-06-14' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (44, 19, CAST(N'2026-01-09' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (45, 5, CAST(N'2026-01-13' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (46, 47, CAST(N'2026-02-14' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (47, 60, CAST(N'2026-01-22' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (48, 6, CAST(N'2026-03-07' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (49, 21, CAST(N'2026-06-02' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (50, 20, CAST(N'2026-06-15' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (51, 42, CAST(N'2026-07-17' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (52, 44, CAST(N'2026-07-02' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (53, 2, CAST(N'2026-03-23' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (54, 11, CAST(N'2026-05-02' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (55, 21, CAST(N'2026-01-09' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (56, 4, CAST(N'2026-05-09' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (57, 19, CAST(N'2026-03-24' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (58, 12, CAST(N'2026-04-07' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (59, 44, CAST(N'2026-01-04' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (60, 2, CAST(N'2026-03-16' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (61, 47, CAST(N'2026-01-27' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (62, 18, CAST(N'2026-07-19' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (63, 26, CAST(N'2026-01-22' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
INSERT [dbo].[GioHang] ([MaGH], [MaKH], [NgayCapNhat], [TongTien], [CartToken]) VALUES (64, 45, CAST(N'2026-05-15' AS Date), CAST(0 AS Decimal(18, 0)), NULL)
SET IDENTITY_INSERT [dbo].[GioHang] OFF
GO

-- ============================================================
-- 14) CHITIETGIOHANG: chi tiết cho 50 giỏ hàng mới
-- ============================================================
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (15, 11, 1, CAST(1 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (15, 57, 3, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (16, 2, 3, CAST(12000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (17, 53, 3, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (17, 40, 4, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (17, 30, 1, CAST(38000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (18, 26, 1, CAST(248000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (18, 55, 1, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (18, 8, 4, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (19, 36, 2, CAST(19000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (19, 40, 3, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (20, 61, 1, CAST(21000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (21, 33, 2, CAST(50000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (21, 44, 3, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (21, 38, 2, CAST(207000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (22, 56, 4, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (23, 13, 2, CAST(34000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (23, 34, 4, CAST(309000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (24, 56, 3, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (25, 57, 1, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (25, 21, 1, CAST(21000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (25, 40, 3, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (26, 57, 2, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (26, 21, 1, CAST(21000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (26, 59, 1, CAST(26000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (27, 31, 3, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (27, 20, 4, CAST(17000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (27, 47, 2, CAST(33000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (28, 58, 4, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (28, 11, 1, CAST(1 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (29, 39, 1, CAST(13000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (30, 26, 2, CAST(248000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (31, 61, 1, CAST(21000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (31, 46, 2, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (31, 12, 4, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (32, 39, 3, CAST(13000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (32, 44, 1, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (32, 23, 3, CAST(20000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (33, 42, 3, CAST(313000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (33, 57, 2, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (34, 45, 3, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (35, 1, 1, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (36, 5, 2, CAST(18000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (37, 10, 2, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (38, 29, 2, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (39, 15, 3, CAST(36000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (39, 54, 3, CAST(272000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (40, 13, 1, CAST(34000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (41, 52, 4, CAST(34000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (41, 53, 3, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (41, 6, 1, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (42, 36, 3, CAST(19000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (42, 43, 1, CAST(41000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (43, 61, 3, CAST(21000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (43, 31, 3, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (43, 9, 3, CAST(25000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (44, 56, 2, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (44, 35, 2, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (45, 23, 3, CAST(20000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (45, 43, 4, CAST(41000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (46, 21, 4, CAST(21000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (46, 3, 1, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (46, 48, 4, CAST(3000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (47, 51, 2, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (47, 36, 3, CAST(19000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (48, 46, 4, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (48, 34, 3, CAST(309000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (49, 61, 3, CAST(21000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (49, 33, 2, CAST(50000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (50, 55, 1, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (51, 35, 4, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (51, 45, 1, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (51, 29, 2, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (52, 58, 1, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (52, 13, 4, CAST(34000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (52, 52, 3, CAST(34000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (53, 50, 3, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (53, 42, 1, CAST(313000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (53, 26, 1, CAST(248000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (54, 18, 2, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (54, 5, 1, CAST(18000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (54, 60, 3, CAST(15000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (55, 28, 4, CAST(28000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (55, 31, 1, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (56, 51, 3, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (57, 55, 3, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (57, 23, 2, CAST(20000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (57, 60, 1, CAST(15000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (58, 28, 2, CAST(28000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (58, 30, 2, CAST(38000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (59, 35, 2, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (60, 3, 3, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (60, 23, 2, CAST(20000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (60, 40, 4, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (61, 7, 2, CAST(20000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (61, 41, 1, CAST(7000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (61, 53, 3, CAST(6000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (62, 3, 2, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (63, 18, 3, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (63, 24, 4, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietGioHang] ([MaGH], [MaSP], [SoLuong], [DonGia]) VALUES (64, 24, 4, CAST(5000 AS Decimal(18, 0)))
GO

-- Cập nhật lại TongTien của 50 giỏ hàng mới cho khớp với chi tiết giỏ hàng
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(21001 AS Decimal(18,0)) WHERE [MaGH] = 15
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(36000 AS Decimal(18,0)) WHERE [MaGH] = 16
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(80000 AS Decimal(18,0)) WHERE [MaGH] = 17
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(281000 AS Decimal(18,0)) WHERE [MaGH] = 18
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(56000 AS Decimal(18,0)) WHERE [MaGH] = 19
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(21000 AS Decimal(18,0)) WHERE [MaGH] = 20
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(529000 AS Decimal(18,0)) WHERE [MaGH] = 21
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(16000 AS Decimal(18,0)) WHERE [MaGH] = 22
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(1304000 AS Decimal(18,0)) WHERE [MaGH] = 23
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(12000 AS Decimal(18,0)) WHERE [MaGH] = 24
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(46000 AS Decimal(18,0)) WHERE [MaGH] = 25
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(61000 AS Decimal(18,0)) WHERE [MaGH] = 26
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(146000 AS Decimal(18,0)) WHERE [MaGH] = 27
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(16001 AS Decimal(18,0)) WHERE [MaGH] = 28
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(13000 AS Decimal(18,0)) WHERE [MaGH] = 29
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(496000 AS Decimal(18,0)) WHERE [MaGH] = 30
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(77000 AS Decimal(18,0)) WHERE [MaGH] = 31
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(104000 AS Decimal(18,0)) WHERE [MaGH] = 32
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(953000 AS Decimal(18,0)) WHERE [MaGH] = 33
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(30000 AS Decimal(18,0)) WHERE [MaGH] = 34
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(5000 AS Decimal(18,0)) WHERE [MaGH] = 35
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(36000 AS Decimal(18,0)) WHERE [MaGH] = 36
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(16000 AS Decimal(18,0)) WHERE [MaGH] = 37
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(18000 AS Decimal(18,0)) WHERE [MaGH] = 38
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(924000 AS Decimal(18,0)) WHERE [MaGH] = 39
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(34000 AS Decimal(18,0)) WHERE [MaGH] = 40
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(163000 AS Decimal(18,0)) WHERE [MaGH] = 41
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(98000 AS Decimal(18,0)) WHERE [MaGH] = 42
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(150000 AS Decimal(18,0)) WHERE [MaGH] = 43
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(20000 AS Decimal(18,0)) WHERE [MaGH] = 44
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(224000 AS Decimal(18,0)) WHERE [MaGH] = 45
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(104000 AS Decimal(18,0)) WHERE [MaGH] = 46
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(73000 AS Decimal(18,0)) WHERE [MaGH] = 47
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(959000 AS Decimal(18,0)) WHERE [MaGH] = 48
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(163000 AS Decimal(18,0)) WHERE [MaGH] = 49
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(5000 AS Decimal(18,0)) WHERE [MaGH] = 50
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(52000 AS Decimal(18,0)) WHERE [MaGH] = 51
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(242000 AS Decimal(18,0)) WHERE [MaGH] = 52
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(573000 AS Decimal(18,0)) WHERE [MaGH] = 53
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(81000 AS Decimal(18,0)) WHERE [MaGH] = 54
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(116000 AS Decimal(18,0)) WHERE [MaGH] = 55
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(24000 AS Decimal(18,0)) WHERE [MaGH] = 56
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(70000 AS Decimal(18,0)) WHERE [MaGH] = 57
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(132000 AS Decimal(18,0)) WHERE [MaGH] = 58
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(12000 AS Decimal(18,0)) WHERE [MaGH] = 59
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(88000 AS Decimal(18,0)) WHERE [MaGH] = 60
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(65000 AS Decimal(18,0)) WHERE [MaGH] = 61
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(16000 AS Decimal(18,0)) WHERE [MaGH] = 62
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(47000 AS Decimal(18,0)) WHERE [MaGH] = 63
UPDATE [dbo].[GioHang] SET [TongTien] = CAST(20000 AS Decimal(18,0)) WHERE [MaGH] = 64
GO

-- ============================================================
-- 15) NHAPHANG: +50 phiếu nhập hàng mới (MaNH 15 -> 64)
-- ============================================================
SET IDENTITY_INSERT [dbo].[NhapHang] ON
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (15, 19, 9, CAST(N'2026-03-08' AS Date), CAST(0 AS Decimal(18, 0)), N'Đang xử lý')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (16, 2, 14, CAST(N'2026-07-21' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (17, 3, 7, CAST(N'2026-07-11' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (18, 2, 1, CAST(N'2026-03-09' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (19, 24, 24, CAST(N'2026-05-07' AS Date), CAST(0 AS Decimal(18, 0)), N'Đã nhập')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (20, 2, 16, CAST(N'2026-07-27' AS Date), CAST(0 AS Decimal(18, 0)), N'Đã nhập')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (21, 12, 13, CAST(N'2026-02-08' AS Date), CAST(0 AS Decimal(18, 0)), N'Đã nhập')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (22, 10, 18, CAST(N'2026-03-01' AS Date), CAST(0 AS Decimal(18, 0)), N'Đang xử lý')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (23, 11, 14, CAST(N'2026-06-08' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (24, 19, 15, CAST(N'2026-06-16' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (25, 6, 6, CAST(N'2026-04-25' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (26, 14, 5, CAST(N'2026-06-14' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (27, 8, 22, CAST(N'2026-03-08' AS Date), CAST(0 AS Decimal(18, 0)), N'Đang xử lý')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (28, 14, 19, CAST(N'2026-03-15' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (29, 20, 22, CAST(N'2026-06-02' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (30, 11, 19, CAST(N'2026-04-25' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (31, 18, 11, CAST(N'2026-06-01' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (32, 3, 6, CAST(N'2026-06-26' AS Date), CAST(0 AS Decimal(18, 0)), N'Đã nhập')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (33, 11, 7, CAST(N'2026-05-24' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (34, 20, 17, CAST(N'2026-02-18' AS Date), CAST(0 AS Decimal(18, 0)), N'Đang xử lý')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (35, 10, 25, CAST(N'2026-04-10' AS Date), CAST(0 AS Decimal(18, 0)), N'Đã nhập')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (36, 24, 4, CAST(N'2026-07-25' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (37, 3, 17, CAST(N'2026-04-26' AS Date), CAST(0 AS Decimal(18, 0)), N'Đang xử lý')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (38, 12, 12, CAST(N'2026-05-13' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (39, 25, 10, CAST(N'2026-05-13' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (40, 26, 1, CAST(N'2026-03-28' AS Date), CAST(0 AS Decimal(18, 0)), N'Đã nhập')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (41, 12, 4, CAST(N'2026-03-28' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (42, 7, 18, CAST(N'2026-07-26' AS Date), CAST(0 AS Decimal(18, 0)), N'Đã nhập')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (43, 18, 18, CAST(N'2026-04-24' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (44, 11, 3, CAST(N'2026-03-19' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (45, 4, 19, CAST(N'2026-06-26' AS Date), CAST(0 AS Decimal(18, 0)), N'Đang xử lý')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (46, 2, 14, CAST(N'2026-04-15' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (47, 22, 16, CAST(N'2026-01-22' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (48, 12, 10, CAST(N'2026-03-16' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (49, 17, 9, CAST(N'2026-03-19' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (50, 25, 1, CAST(N'2026-04-23' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (51, 20, 24, CAST(N'2026-02-12' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (52, 6, 13, CAST(N'2026-05-10' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (53, 14, 25, CAST(N'2026-03-08' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (54, 6, 2, CAST(N'2026-04-23' AS Date), CAST(0 AS Decimal(18, 0)), N'Đang xử lý')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (55, 16, 23, CAST(N'2026-03-14' AS Date), CAST(0 AS Decimal(18, 0)), N'Đã nhập')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (56, 1, 19, CAST(N'2026-02-07' AS Date), CAST(0 AS Decimal(18, 0)), N'Chờ xác nhận')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (57, 25, 16, CAST(N'2026-07-27' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (58, 2, 18, CAST(N'2026-02-04' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (59, 4, 13, CAST(N'2026-03-24' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (60, 1, 16, CAST(N'2026-04-22' AS Date), CAST(0 AS Decimal(18, 0)), N'Đã nhập')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (61, 26, 9, CAST(N'2026-06-17' AS Date), CAST(0 AS Decimal(18, 0)), N'Hoàn thành')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (62, 4, 1, CAST(N'2026-02-07' AS Date), CAST(0 AS Decimal(18, 0)), N'Đã nhập')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (63, 8, 17, CAST(N'2026-03-14' AS Date), CAST(0 AS Decimal(18, 0)), N'Đã nhập')
INSERT [dbo].[NhapHang] ([MaNH], [MaNV], [MaNCC], [NgayNhap], [TongTien], [TrangThai]) VALUES (64, 19, 24, CAST(N'2026-04-18' AS Date), CAST(0 AS Decimal(18, 0)), N'Đang xử lý')
SET IDENTITY_INSERT [dbo].[NhapHang] OFF
GO

-- ============================================================
-- 16) CHITIETNHAPHANG: chi tiết cho 50 phiếu nhập hàng mới
-- ============================================================
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (15, 51, 278, CAST(4500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (16, 56, 74, CAST(2000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (16, 22, 273, CAST(23500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (17, 26, 236, CAST(168000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (17, 51, 289, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (18, 34, 179, CAST(190000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (18, 2, 91, CAST(8500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (19, 60, 150, CAST(9500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (19, 30, 156, CAST(30000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (19, 53, 269, CAST(3000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (20, 2, 284, CAST(9000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (20, 37, 106, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (20, 28, 172, CAST(21000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (21, 52, 278, CAST(23000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (21, 41, 75, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (22, 27, 264, CAST(187000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (22, 2, 295, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (23, 42, 207, CAST(187000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (24, 41, 249, CAST(4500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (24, 26, 224, CAST(185000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (24, 48, 278, CAST(2000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (25, 6, 61, CAST(5500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (26, 43, 177, CAST(23500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (26, 27, 246, CAST(227500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (26, 50, 50, CAST(3000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (27, 7, 175, CAST(10000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (28, 49, 195, CAST(139500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (29, 16, 219, CAST(28000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (30, 12, 85, CAST(6500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (31, 23, 173, CAST(13000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (31, 46, 75, CAST(4500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (32, 46, 134, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (32, 20, 99, CAST(9500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (32, 39, 219, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (33, 8, 171, CAST(3500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (33, 37, 122, CAST(4500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (33, 60, 194, CAST(11000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (34, 9, 124, CAST(14500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (34, 13, 184, CAST(21500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (34, 4, 138, CAST(11000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (35, 45, 242, CAST(7500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (36, 4, 226, CAST(7500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (36, 36, 113, CAST(12000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (36, 22, 285, CAST(21000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (37, 56, 203, CAST(3000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (37, 30, 114, CAST(19500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (38, 30, 286, CAST(20000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (39, 54, 222, CAST(199000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (39, 1, 84, CAST(3500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (39, 52, 234, CAST(17000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (40, 51, 60, CAST(5500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (41, 61, 156, CAST(15500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (41, 19, 116, CAST(2500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (41, 28, 279, CAST(17500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (42, 55, 267, CAST(3500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (43, 30, 124, CAST(23500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (43, 50, 210, CAST(2000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (43, 11, 92, CAST(1000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (44, 46, 243, CAST(4000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (44, 14, 131, CAST(2500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (44, 3, 232, CAST(5500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (45, 19, 237, CAST(3500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (46, 14, 79, CAST(2500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (46, 5, 233, CAST(9500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (47, 31, 70, CAST(2500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (48, 56, 77, CAST(2000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (48, 50, 118, CAST(2000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (48, 18, 191, CAST(5500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (49, 7, 166, CAST(14500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (49, 1, 218, CAST(3000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (49, 59, 219, CAST(13500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (50, 44, 58, CAST(2500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (51, 48, 109, CAST(2000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (51, 11, 298, CAST(1000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (51, 16, 202, CAST(29000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (52, 31, 286, CAST(2000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (53, 26, 221, CAST(189000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (53, 46, 259, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (53, 55, 80, CAST(2500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (54, 44, 58, CAST(3500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (54, 50, 287, CAST(2000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (54, 34, 81, CAST(187000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (55, 19, 196, CAST(3500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (56, 44, 168, CAST(2500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (56, 12, 257, CAST(7500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (56, 5, 289, CAST(13500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (57, 11, 282, CAST(1000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (57, 56, 92, CAST(2000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (57, 4, 162, CAST(8500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (58, 5, 275, CAST(13500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (59, 20, 153, CAST(11500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (60, 33, 98, CAST(37000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (60, 31, 80, CAST(2000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (60, 13, 82, CAST(20500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (61, 8, 269, CAST(5000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (62, 32, 199, CAST(4500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (62, 52, 298, CAST(24500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (63, 57, 180, CAST(4500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (63, 34, 266, CAST(169000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (63, 60, 140, CAST(8000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (64, 18, 76, CAST(6500 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (64, 43, 236, CAST(27000 AS Decimal(18, 0)))
INSERT [dbo].[ChiTietNhapHang] ([MaNH], [MaSP], [SoLuong], [DonGia]) VALUES (64, 12, 156, CAST(6000 AS Decimal(18, 0)))
GO

-- Cập nhật lại TongTien của 50 phiếu nhập hàng mới
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(1251000 AS Decimal(18,0)) WHERE [MaNH] = 15
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(6563500 AS Decimal(18,0)) WHERE [MaNH] = 16
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(40804000 AS Decimal(18,0)) WHERE [MaNH] = 17
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(34783500 AS Decimal(18,0)) WHERE [MaNH] = 18
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(6912000 AS Decimal(18,0)) WHERE [MaNH] = 19
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(6698000 AS Decimal(18,0)) WHERE [MaNH] = 20
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(6769000 AS Decimal(18,0)) WHERE [MaNH] = 21
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(51728000 AS Decimal(18,0)) WHERE [MaNH] = 22
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(38709000 AS Decimal(18,0)) WHERE [MaNH] = 23
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(43116500 AS Decimal(18,0)) WHERE [MaNH] = 24
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(335500 AS Decimal(18,0)) WHERE [MaNH] = 25
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(60274500 AS Decimal(18,0)) WHERE [MaNH] = 26
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(1750000 AS Decimal(18,0)) WHERE [MaNH] = 27
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(27202500 AS Decimal(18,0)) WHERE [MaNH] = 28
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(6132000 AS Decimal(18,0)) WHERE [MaNH] = 29
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(552500 AS Decimal(18,0)) WHERE [MaNH] = 30
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(2586500 AS Decimal(18,0)) WHERE [MaNH] = 31
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(3228500 AS Decimal(18,0)) WHERE [MaNH] = 32
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(3281500 AS Decimal(18,0)) WHERE [MaNH] = 33
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(7272000 AS Decimal(18,0)) WHERE [MaNH] = 34
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(1815000 AS Decimal(18,0)) WHERE [MaNH] = 35
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(9036000 AS Decimal(18,0)) WHERE [MaNH] = 36
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(2832000 AS Decimal(18,0)) WHERE [MaNH] = 37
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(5720000 AS Decimal(18,0)) WHERE [MaNH] = 38
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(48450000 AS Decimal(18,0)) WHERE [MaNH] = 39
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(330000 AS Decimal(18,0)) WHERE [MaNH] = 40
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(7590500 AS Decimal(18,0)) WHERE [MaNH] = 41
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(934500 AS Decimal(18,0)) WHERE [MaNH] = 42
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(3426000 AS Decimal(18,0)) WHERE [MaNH] = 43
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(2575500 AS Decimal(18,0)) WHERE [MaNH] = 44
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(829500 AS Decimal(18,0)) WHERE [MaNH] = 45
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(2411000 AS Decimal(18,0)) WHERE [MaNH] = 46
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(175000 AS Decimal(18,0)) WHERE [MaNH] = 47
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(1440500 AS Decimal(18,0)) WHERE [MaNH] = 48
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(6017500 AS Decimal(18,0)) WHERE [MaNH] = 49
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(145000 AS Decimal(18,0)) WHERE [MaNH] = 50
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(6374000 AS Decimal(18,0)) WHERE [MaNH] = 51
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(572000 AS Decimal(18,0)) WHERE [MaNH] = 52
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(43264000 AS Decimal(18,0)) WHERE [MaNH] = 53
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(15924000 AS Decimal(18,0)) WHERE [MaNH] = 54
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(686000 AS Decimal(18,0)) WHERE [MaNH] = 55
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(6249000 AS Decimal(18,0)) WHERE [MaNH] = 56
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(1843000 AS Decimal(18,0)) WHERE [MaNH] = 57
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(3712500 AS Decimal(18,0)) WHERE [MaNH] = 58
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(1759500 AS Decimal(18,0)) WHERE [MaNH] = 59
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(5467000 AS Decimal(18,0)) WHERE [MaNH] = 60
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(1345000 AS Decimal(18,0)) WHERE [MaNH] = 61
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(8196500 AS Decimal(18,0)) WHERE [MaNH] = 62
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(46884000 AS Decimal(18,0)) WHERE [MaNH] = 63
UPDATE [dbo].[NhapHang] SET [TongTien] = CAST(7802000 AS Decimal(18,0)) WHERE [MaNH] = 64
GO

-- ============================================================
-- 17) DANHGIA: +50 đánh giá mới (MaDG 16 -> 65)
-- ============================================================
SET IDENTITY_INSERT [dbo].[DanhGia] ON
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (16, 57, 2, 37, 4, N'Đúng như mô tả, giá cả hợp lý.', CAST(N'2026-01-25' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (17, 10, 59, 56, 3, N'Rất thích sản phẩm này, mua lần 2 rồi.', CAST(N'2026-02-03' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (18, 3, 50, 40, 3, N'Rất thích sản phẩm này, mua lần 2 rồi.', CAST(N'2026-03-28' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (19, 29, 31, 66, 5, N'Chất lượng bình thường, không như mong đợi lắm.', CAST(N'2026-02-09' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (20, 30, 10, 49, 5, N'Rất thích sản phẩm này, mua lần 2 rồi.', CAST(N'2026-06-14' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (21, 9, 11, 73, 4, N'Sản phẩm chất lượng tốt, đóng gói cẩn thận, giao hàng nhanh.', CAST(N'2026-02-15' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (22, 28, 29, 75, 4, N'Rất thích sản phẩm này, mua lần 2 rồi.', CAST(N'2026-06-09' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (23, 40, 38, 45, 5, N'Chất lượng tạm ổn, đóng gói kỹ.', CAST(N'2026-04-02' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (24, 1, 32, 52, 3, N'Rất hài lòng, sẽ giới thiệu cho bạn bè.', CAST(N'2026-05-06' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (25, 23, 37, 59, 5, N'Sản phẩm dùng tốt, màu sắc đẹp như hình.', CAST(N'2026-02-16' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (26, 23, 30, 79, 4, N'Sản phẩm dùng tốt, màu sắc đẹp như hình.', CAST(N'2026-01-07' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (27, 3, 14, 40, 3, N'Sản phẩm dùng tốt, màu sắc đẹp như hình.', CAST(N'2026-03-16' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (28, 40, 28, 45, 4, N'Rất hài lòng, sẽ giới thiệu cho bạn bè.', CAST(N'2026-06-02' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (29, 9, 3, 47, 3, N'Chất lượng tạm ổn, đóng gói kỹ.', CAST(N'2026-03-17' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (30, 49, 49, 80, 4, N'Giao hàng hơi chậm nhưng sản phẩm ổn.', CAST(N'2026-07-27' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (31, 21, 27, 61, 3, N'Chất lượng tạm ổn, đóng gói kỹ.', CAST(N'2026-05-13' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (32, 23, 39, 79, 5, N'Dùng khá ổn so với giá tiền, sẽ ủng hộ shop tiếp.', CAST(N'2026-03-18' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (33, 34, 42, 53, 3, N'Đúng như mô tả, giá cả hợp lý.', CAST(N'2026-03-17' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (34, 40, 5, 72, 3, N'Bình thường, không có gì đặc biệt.', CAST(N'2026-05-04' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (35, 36, 38, 82, 3, N'Chất lượng tạm ổn, đóng gói kỹ.', CAST(N'2026-03-20' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (36, 60, 33, 65, 3, N'Dùng khá ổn so với giá tiền, sẽ ủng hộ shop tiếp.', CAST(N'2026-03-18' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (37, 48, 35, 84, 4, N'Giao hàng hơi chậm nhưng sản phẩm ổn.', CAST(N'2026-01-08' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (38, 60, 50, 65, 4, N'Chất lượng bình thường, không như mong đợi lắm.', CAST(N'2026-01-08' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (39, 9, 44, 47, 3, N'Bình thường, không có gì đặc biệt.', CAST(N'2026-03-22' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (40, 7, 34, 62, 4, N'Rất hài lòng, sẽ giới thiệu cho bạn bè.', CAST(N'2026-05-14' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (41, 20, 17, 51, 4, N'Bình thường, không có gì đặc biệt.', CAST(N'2026-02-02' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (42, 9, 24, 47, 3, N'Rất thích sản phẩm này, mua lần 2 rồi.', CAST(N'2026-01-12' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (43, 54, 56, 50, 3, N'Chất lượng tạm ổn, đóng gói kỹ.', CAST(N'2026-05-11' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (44, 40, 10, 72, 4, N'Rất hài lòng, sẽ giới thiệu cho bạn bè.', CAST(N'2026-06-15' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (45, 1, 31, 52, 5, N'Giao hàng hơi chậm nhưng sản phẩm ổn.', CAST(N'2026-05-22' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (46, 57, 2, 37, 3, N'Chất lượng tạm ổn, đóng gói kỹ.', CAST(N'2026-04-04' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (47, 57, 60, 37, 5, N'Sản phẩm dùng tốt, màu sắc đẹp như hình.', CAST(N'2026-06-22' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (48, 36, 24, 82, 4, N'Chất lượng bình thường, không như mong đợi lắm.', CAST(N'2026-03-26' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (49, 10, 30, 56, 3, N'Dùng khá ổn so với giá tiền, sẽ ủng hộ shop tiếp.', CAST(N'2026-04-17' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (50, 47, 30, 68, 5, N'Dùng khá ổn so với giá tiền, sẽ ủng hộ shop tiếp.', CAST(N'2026-03-09' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (51, 43, 29, 71, 5, N'Sản phẩm dùng tốt, màu sắc đẹp như hình.', CAST(N'2026-01-15' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (52, 43, 8, 71, 5, N'Chất lượng bình thường, không như mong đợi lắm.', CAST(N'2026-05-04' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (53, 38, 42, 83, 3, N'Dùng khá ổn so với giá tiền, sẽ ủng hộ shop tiếp.', CAST(N'2026-06-07' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (54, 40, 49, 45, 3, N'Giao hàng hơi chậm nhưng sản phẩm ổn.', CAST(N'2026-02-18' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (55, 48, 20, 84, 4, N'Dùng khá ổn so với giá tiền, sẽ ủng hộ shop tiếp.', CAST(N'2026-05-24' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (56, 36, 21, 85, 5, N'Dùng khá ổn so với giá tiền, sẽ ủng hộ shop tiếp.', CAST(N'2026-06-01' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (57, 20, 37, 36, 5, N'Bình thường, không có gì đặc biệt.', CAST(N'2026-05-18' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (58, 10, 5, 56, 5, N'Giao hàng hơi chậm nhưng sản phẩm ổn.', CAST(N'2026-05-15' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (59, 3, 47, 78, 5, N'Chất lượng tạm ổn, đóng gói kỹ.', CAST(N'2026-06-10' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (60, 40, 48, 72, 4, N'Rất thích sản phẩm này, mua lần 2 rồi.', CAST(N'2026-03-07' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (61, 24, 15, 77, 5, N'Sản phẩm chất lượng tốt, đóng gói cẩn thận, giao hàng nhanh.', CAST(N'2026-05-12' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (62, 34, 17, 57, 5, N'Sản phẩm dùng tốt, màu sắc đẹp như hình.', CAST(N'2026-01-10' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (63, 40, 2, 45, 4, N'Rất thích sản phẩm này, mua lần 2 rồi.', CAST(N'2026-03-23' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (64, 57, 35, 41, 3, N'Bình thường, không có gì đặc biệt.', CAST(N'2026-03-23' AS Date))
INSERT [dbo].[DanhGia] ([MaDG], [MaKH], [MaSP], [MaDH], [SoSao], [NoiDung], [NgayDG]) VALUES (65, 20, 39, 36, 4, N'Giao hàng hơi chậm nhưng sản phẩm ổn.', CAST(N'2026-04-11' AS Date))
SET IDENTITY_INSERT [dbo].[DanhGia] OFF
GO

-- ============================================================
-- 18) SANPHAMYEUTHICH: +50 lượt yêu thích sản phẩm mới
-- ============================================================
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (37, 54, CAST(N'2026-03-22T03:05:20.5060776' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (50, 9, CAST(N'2026-05-24T02:39:19.6538530' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (48, 28, CAST(N'2026-05-21T01:15:03.6067022' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (13, 54, CAST(N'2026-06-20T15:03:36.2357674' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (21, 20, CAST(N'2026-06-25T00:55:12.1300596' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (53, 30, CAST(N'2026-04-25T13:45:38.8297533' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (4, 16, CAST(N'2026-03-05T03:59:00.5415799' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (16, 10, CAST(N'2026-05-12T21:50:38.6300481' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (63, 4, CAST(N'2026-03-17T22:03:57.6784443' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (16, 32, CAST(N'2026-06-14T09:36:44.3442836' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (27, 9, CAST(N'2026-03-10T02:23:55.5310375' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (61, 3, CAST(N'2026-02-07T03:30:39.5791042' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (40, 54, CAST(N'2026-01-01T03:44:46.2887140' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (37, 16, CAST(N'2026-02-20T04:28:42.4345462' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (34, 53, CAST(N'2026-04-24T15:36:56.1914386' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (1, 17, CAST(N'2026-04-14T21:27:01.6466563' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (14, 27, CAST(N'2026-03-15T19:25:31.8677805' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (29, 50, CAST(N'2026-04-27T15:47:10.1808653' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (15, 34, CAST(N'2026-03-17T22:40:29.7881002' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (35, 17, CAST(N'2026-06-23T11:52:32.5817293' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (28, 3, CAST(N'2026-07-10T20:31:50.6758809' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (19, 23, CAST(N'2026-02-09T02:40:25.5506317' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (56, 35, CAST(N'2026-03-19T17:49:54.8510482' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (43, 42, CAST(N'2026-01-13T05:59:57.6502870' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (47, 54, CAST(N'2026-06-11T22:29:16.2218070' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (4, 33, CAST(N'2026-04-11T04:41:37.5255166' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (51, 32, CAST(N'2026-01-13T15:13:59.4570306' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (42, 48, CAST(N'2026-03-27T20:31:54.5356284' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (26, 14, CAST(N'2026-01-11T01:32:47.9115171' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (37, 36, CAST(N'2026-04-25T07:06:20.6806668' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (16, 43, CAST(N'2026-05-22T00:59:34.9866559' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (20, 31, CAST(N'2026-04-01T04:51:21.3288122' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (50, 46, CAST(N'2026-06-03T07:57:27.4387724' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (46, 36, CAST(N'2026-07-07T09:34:49.4960858' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (55, 55, CAST(N'2026-02-02T21:52:53.7615540' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (11, 40, CAST(N'2026-04-25T04:24:15.5682105' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (58, 3, CAST(N'2026-05-10T01:52:25.4349482' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (65, 44, CAST(N'2026-01-26T12:33:50.1861807' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (53, 43, CAST(N'2026-02-08T12:48:20.4688253' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (23, 44, CAST(N'2026-05-23T02:09:43.4098993' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (12, 27, CAST(N'2026-05-21T10:49:19.9397779' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (26, 40, CAST(N'2026-02-04T16:09:11.9689852' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (62, 56, CAST(N'2026-07-18T21:20:58.4094288' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (1, 55, CAST(N'2026-02-24T16:47:05.6877198' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (55, 23, CAST(N'2026-06-28T15:42:17.4655613' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (18, 29, CAST(N'2026-02-21T19:34:35.8301477' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (34, 10, CAST(N'2026-02-04T15:04:34.4971024' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (15, 6, CAST(N'2026-05-08T21:46:17.5785703' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (45, 1, CAST(N'2026-02-13T15:16:03.9978584' AS DateTime2))
INSERT [dbo].[SanPhamYeuThich] ([MaTK], [MaSP], [NgayThem]) VALUES (65, 6, CAST(N'2026-05-17T13:16:06.3929366' AS DateTime2))
GO

-- ============================================================
-- 19) SP_KM: +50 liên kết sản phẩm - khuyến mãi mới
-- ============================================================
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (37, 9)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (7, 6)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (43, 4)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (44, 20)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (30, 1)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (19, 6)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (11, 21)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (8, 18)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (10, 21)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (33, 7)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (55, 18)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (8, 16)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (8, 17)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (9, 8)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (58, 19)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (46, 19)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (3, 13)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (29, 18)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (32, 12)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (9, 21)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (11, 15)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (60, 3)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (16, 22)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (1, 22)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (30, 3)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (25, 4)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (39, 15)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (53, 6)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (37, 17)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (44, 10)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (35, 15)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (53, 1)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (30, 16)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (19, 17)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (11, 20)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (49, 11)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (55, 11)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (5, 3)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (6, 12)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (51, 5)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (42, 7)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (38, 8)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (10, 23)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (29, 22)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (30, 12)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (11, 2)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (34, 18)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (48, 23)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (48, 21)
INSERT [dbo].[sp_km] ([MaSP], [MaKM]) VALUES (35, 9)
GO