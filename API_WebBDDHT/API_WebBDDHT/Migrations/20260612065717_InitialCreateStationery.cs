using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API_WebBDDHT.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateStationery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HangKhachHang",
                columns: table => new
                {
                    MaHang = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenHang = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DiemToiThieu = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    PhanTramUuDai = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HangKhachHang", x => x.MaHang);
                });

            migrationBuilder.CreateTable(
                name: "KhuyenMai",
                columns: table => new
                {
                    MaKM = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenKM = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    NgayBatDau = table.Column<DateTime>(type: "date", nullable: true),
                    NgayKetThuc = table.Column<DateTime>(type: "date", nullable: true),
                    PhanTramGiam = table.Column<int>(type: "int", nullable: true),
                    DieuKienApDung = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhuyenMai", x => x.MaKM);
                });

            migrationBuilder.CreateTable(
                name: "LoaiSP",
                columns: table => new
                {
                    MaLoaiSP = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenLoai = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoaiSP", x => x.MaLoaiSP);
                });

            migrationBuilder.CreateTable(
                name: "NhaCungCap",
                columns: table => new
                {
                    MaNCC = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenNCC = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SDT = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhaCungCap", x => x.MaNCC);
                });

            migrationBuilder.CreateTable(
                name: "PhuongThucThanhToan",
                columns: table => new
                {
                    MaPTTT = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenPhuongThuc = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MaCode = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    HinhAnh = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    GhiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhuongThucThanhToan", x => x.MaPTTT);
                });

            migrationBuilder.CreateTable(
                name: "TaiKhoan",
                columns: table => new
                {
                    MaTK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenDangNhap = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    MatKhau = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    VaiTro = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaiKhoan", x => x.MaTK);
                });

            migrationBuilder.CreateTable(
                name: "ThuongHieu",
                columns: table => new
                {
                    MaTH = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenTH = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    QuocGia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThuongHieu", x => x.MaTH);
                });

            migrationBuilder.CreateTable(
                name: "KhachHang",
                columns: table => new
                {
                    MaKH = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HoTen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SDT = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaTK = table.Column<int>(type: "int", nullable: true),
                    DiemTichLuy = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    MaHang = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhachHang", x => x.MaKH);
                    table.ForeignKey(
                        name: "FK_KhachHang_HangKhachHang_MaHang",
                        column: x => x.MaHang,
                        principalTable: "HangKhachHang",
                        principalColumn: "MaHang",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KhachHang_TaiKhoan_MaTK",
                        column: x => x.MaTK,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTK",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "NhanVien",
                columns: table => new
                {
                    MaNV = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaSoNhanVien = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    HoTen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    GioiTinh = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    NgaySinh = table.Column<DateTime>(type: "date", nullable: true),
                    SDT = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaTK = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhanVien", x => x.MaNV);
                    table.ForeignKey(
                        name: "FK_NhanVien_TaiKhoan_MaTK",
                        column: x => x.MaTK,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTK",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "SanPham",
                columns: table => new
                {
                    MaSP = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenSP = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Gia = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    SoLuongTon = table.Column<int>(type: "int", nullable: false),
                    HinhAnh = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    MaLoai = table.Column<int>(type: "int", nullable: true),
                    MaNCC = table.Column<int>(type: "int", nullable: true),
                    MaTH = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SanPham", x => x.MaSP);
                    table.ForeignKey(
                        name: "FK_SanPham_LoaiSP_MaLoai",
                        column: x => x.MaLoai,
                        principalTable: "LoaiSP",
                        principalColumn: "MaLoaiSP",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SanPham_NhaCungCap_MaNCC",
                        column: x => x.MaNCC,
                        principalTable: "NhaCungCap",
                        principalColumn: "MaNCC",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SanPham_ThuongHieu_MaTH",
                        column: x => x.MaTH,
                        principalTable: "ThuongHieu",
                        principalColumn: "MaTH",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DonHang",
                columns: table => new
                {
                    MaDH = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaKH = table.Column<int>(type: "int", nullable: true),
                    HoTenNguoiNhan = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SDTNguoiNhan = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    NgayDat = table.Column<DateTime>(type: "date", nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TongTien = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    DiaChiGiaoHang = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GhiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaPTTT = table.Column<int>(type: "int", nullable: true),
                    TrangThaiThanhToan = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "Chưa thanh toán"),
                    MaGiaoDịchNgoai = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonHang", x => x.MaDH);
                    table.ForeignKey(
                        name: "FK_DonHang_KhachHang_MaKH",
                        column: x => x.MaKH,
                        principalTable: "KhachHang",
                        principalColumn: "MaKH",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DonHang_PhuongThucThanhToan_MaPTTT",
                        column: x => x.MaPTTT,
                        principalTable: "PhuongThucThanhToan",
                        principalColumn: "MaPTTT");
                });

            migrationBuilder.CreateTable(
                name: "GioHang",
                columns: table => new
                {
                    MaGH = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaKH = table.Column<int>(type: "int", nullable: true),
                    NgayCapNhat = table.Column<DateTime>(type: "date", nullable: true),
                    TongTien = table.Column<decimal>(type: "decimal(18,0)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GioHang", x => x.MaGH);
                    table.ForeignKey(
                        name: "FK_GioHang_KhachHang_MaKH",
                        column: x => x.MaKH,
                        principalTable: "KhachHang",
                        principalColumn: "MaKH",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NhapHang",
                columns: table => new
                {
                    MaNH = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaNV = table.Column<int>(type: "int", nullable: true),
                    MaNCC = table.Column<int>(type: "int", nullable: true),
                    NgayNhap = table.Column<DateTime>(type: "date", nullable: true),
                    TongTien = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhapHang", x => x.MaNH);
                    table.ForeignKey(
                        name: "FK_NhapHang_NhaCungCap_MaNCC",
                        column: x => x.MaNCC,
                        principalTable: "NhaCungCap",
                        principalColumn: "MaNCC",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NhapHang_NhanVien_MaNV",
                        column: x => x.MaNV,
                        principalTable: "NhanVien",
                        principalColumn: "MaNV",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "sp_km",
                columns: table => new
                {
                    MaSP = table.Column<int>(type: "int", nullable: false),
                    MaKM = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sp_km", x => new { x.MaSP, x.MaKM });
                    table.ForeignKey(
                        name: "FK_sp_km_KhuyenMai_MaKM",
                        column: x => x.MaKM,
                        principalTable: "KhuyenMai",
                        principalColumn: "MaKM",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_sp_km_SanPham_MaSP",
                        column: x => x.MaSP,
                        principalTable: "SanPham",
                        principalColumn: "MaSP",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietDonHang",
                columns: table => new
                {
                    MaDH = table.Column<int>(type: "int", nullable: false),
                    MaSP = table.Column<int>(type: "int", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: true),
                    DonGia = table.Column<decimal>(type: "decimal(18,0)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietDonHang", x => new { x.MaDH, x.MaSP });
                    table.ForeignKey(
                        name: "FK_ChiTietDonHang_DonHang_MaDH",
                        column: x => x.MaDH,
                        principalTable: "DonHang",
                        principalColumn: "MaDH",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietDonHang_SanPham_MaSP",
                        column: x => x.MaSP,
                        principalTable: "SanPham",
                        principalColumn: "MaSP",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DanhGia",
                columns: table => new
                {
                    MaDG = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaKH = table.Column<int>(type: "int", nullable: true),
                    MaSP = table.Column<int>(type: "int", nullable: true),
                    MaDH = table.Column<int>(type: "int", nullable: false),
                    SoSao = table.Column<int>(type: "int", nullable: true),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NgayDG = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DanhGia", x => x.MaDG);
                    table.ForeignKey(
                        name: "FK_DanhGia_DonHang_MaDH",
                        column: x => x.MaDH,
                        principalTable: "DonHang",
                        principalColumn: "MaDH",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DanhGia_KhachHang_MaKH",
                        column: x => x.MaKH,
                        principalTable: "KhachHang",
                        principalColumn: "MaKH",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DanhGia_SanPham_MaSP",
                        column: x => x.MaSP,
                        principalTable: "SanPham",
                        principalColumn: "MaSP",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietGioHang",
                columns: table => new
                {
                    MaGH = table.Column<int>(type: "int", nullable: false),
                    MaSP = table.Column<int>(type: "int", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: true),
                    DonGia = table.Column<decimal>(type: "decimal(18,0)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietGioHang", x => new { x.MaGH, x.MaSP });
                    table.ForeignKey(
                        name: "FK_ChiTietGioHang_GioHang_MaGH",
                        column: x => x.MaGH,
                        principalTable: "GioHang",
                        principalColumn: "MaGH",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietGioHang_SanPham_MaSP",
                        column: x => x.MaSP,
                        principalTable: "SanPham",
                        principalColumn: "MaSP",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietNhapHang",
                columns: table => new
                {
                    MaNH = table.Column<int>(type: "int", nullable: false),
                    MaSP = table.Column<int>(type: "int", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: true),
                    DonGia = table.Column<decimal>(type: "decimal(18,0)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietNhapHang", x => new { x.MaNH, x.MaSP });
                    table.ForeignKey(
                        name: "FK_ChiTietNhapHang_NhapHang_MaNH",
                        column: x => x.MaNH,
                        principalTable: "NhapHang",
                        principalColumn: "MaNH",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietNhapHang_SanPham_MaSP",
                        column: x => x.MaSP,
                        principalTable: "SanPham",
                        principalColumn: "MaSP",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "HangKhachHang",
                columns: new[] { "MaHang", "TenHang" },
                values: new object[] { 1, "Đồng" });

            migrationBuilder.InsertData(
                table: "HangKhachHang",
                columns: new[] { "MaHang", "DiemToiThieu", "PhanTramUuDai", "TenHang" },
                values: new object[,]
                {
                    { 2, 100, 2, "Bạc" },
                    { 3, 500, 5, "Vàng" }
                });

            migrationBuilder.InsertData(
                table: "KhuyenMai",
                columns: new[] { "MaKM", "DieuKienApDung", "NgayBatDau", "NgayKetThuc", "PhanTramGiam", "TenKM" },
                values: new object[,]
                {
                    { 1, "Áp dụng cho các dòng bút viết và tập vở", new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 10, "Chào Hè Rực Rỡ" },
                    { 2, "Giảm giá sâu máy tính học sinh", new DateTime(2026, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 9, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 15, "Mùa Tựu Trường" }
                });

            migrationBuilder.InsertData(
                table: "LoaiSP",
                columns: new[] { "MaLoaiSP", "MoTa", "TenLoai" },
                values: new object[,]
                {
                    { 1, "Các loại bút bi, bút chì, bút dạ quang, bút ký cao cấp", "Bút - Viết" },
                    { 2, "Sổ tay lò xo, tập học sinh, sổ văn phòng", "Sổ - Tập - Vở" },
                    { 3, "Giấy in A4, giấy note, giấy bìa màu", "Giấy các loại" },
                    { 4, "Máy tính Casio, thước kẻ, gôm, kéo văn phòng", "Dụng cụ học tập & Máy tính" }
                });

            migrationBuilder.InsertData(
                table: "NhaCungCap",
                columns: new[] { "MaNCC", "DiaChi", "Email", "SDT", "TenNCC" },
                values: new object[,]
                {
                    { 1, "KCN Tân Tạo, Bình Tân, HCM", "info@thienlong.vn", "02837505555", "Công ty CP Tập đoàn Thiên Long" },
                    { 2, "Phường 10, Quận Gò Vấp, HCM", "toancauvpp@gmail.com", "0944555666", "Nhà phân phối Văn Phòng Phẩm Toàn Cầu" }
                });

            migrationBuilder.InsertData(
                table: "PhuongThucThanhToan",
                columns: new[] { "MaPTTT", "GhiChu", "HinhAnh", "MaCode", "TenPhuongThuc", "TrangThai" },
                values: new object[,]
                {
                    { 1, "Khách hàng trả tiền mặt cho shipper", "cod.png", "COD", "Thanh toán khi nhận hàng (COD)", true },
                    { 2, "Quét mã chuyển khoản", "momo.png", "MOMO", "Ví điện tử MoMo", true },
                    { 3, "Thanh toán qua ngân hàng nội địa hoặc QR", "vnpay.png", "VNPAY", "Cổng thanh toán VNPAY", true }
                });

            migrationBuilder.InsertData(
                table: "TaiKhoan",
                columns: new[] { "MaTK", "Email", "MatKhau", "TenDangNhap", "TrangThai", "VaiTro" },
                values: new object[,]
                {
                    { 1, "admin@vpp.com", "hashed_password_1", "admin", true, "Quản trị viên" },
                    { 2, "dung@vpp.com", "hashed_password_2", "nv_dung", true, "Nhân viên" },
                    { 3, "lan@gmail.com", "hashed_password_3", "kh_lan", true, "Khách hàng" },
                    { 4, "nam@gmail.com", "hashed_password_4", "kh_nam", true, "Khách hàng" }
                });

            migrationBuilder.InsertData(
                table: "ThuongHieu",
                columns: new[] { "MaTH", "MoTa", "QuocGia", "TenTH" },
                values: new object[,]
                {
                    { 1, "Thương hiệu văn phòng phẩm quốc dân", "Việt Nam", "Thiên Long" },
                    { 2, "Thương hiệu máy tính bỏ túi hàng đầu thế giới", "Nhật Bản", "Casio" },
                    { 3, "Thương hiệu giấy in cao cấp", "Thái Lan", "Double A" },
                    { 4, "Chuyên các dòng tập, sổ tay chất lượng cao", "Nhật Bản", "Campus" }
                });

            migrationBuilder.InsertData(
                table: "KhachHang",
                columns: new[] { "MaKH", "DiaChi", "DiemTichLuy", "HoTen", "MaHang", "MaTK", "SDT" },
                values: new object[,]
                {
                    { 1, "123 Nguyễn Trãi, Quận 5, HCM", 150, "Nguyễn Thúy Lan", 2, 3, "0901234567" },
                    { 2, "456 Lê Lợi, Quận 1, HCM", 20, "Trần Hoàng Nam", 1, 4, "0918889999" }
                });

            migrationBuilder.InsertData(
                table: "NhanVien",
                columns: new[] { "MaNV", "DiaChi", "GioiTinh", "HoTen", "MaSoNhanVien", "MaTK", "NgaySinh", "SDT" },
                values: new object[] { 1, "789 Cách Mạng Tháng 8, Tân Bình, HCM", "Nam", "Lê Văn Dũng", "NV001", 2, new DateTime(1995, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "0987654321" });

            migrationBuilder.InsertData(
                table: "SanPham",
                columns: new[] { "MaSP", "Gia", "HinhAnh", "MaLoai", "MaNCC", "MaTH", "MoTa", "SoLuongTon", "TenSP" },
                values: new object[,]
                {
                    { 1, 4000m, "tl027.jpg", 1, 1, 1, "Bút bi bấm truyền thống, mực đều, nét chữ đẹp", 500, "Bút Bi Thiên Long TL-027" },
                    { 2, 25000m, "so_campus_a5.jpg", 2, 2, 4, "Giấy chống lóa mắt, lò xo kép chắc chắn", 150, "Sổ lò xo Campus A5 160 trang" },
                    { 3, 345000m, "giay_double_a.jpg", 3, 2, 3, "Giấy in văn phòng trắng đẹp, không kẹt giấy (5 ram/thùng)", 80, "Thùng Giấy Double A A4 70gsm" },
                    { 4, 650000m, "casio_580vnx.jpg", 4, 2, 2, "Hỗ trợ 521 tính năng, ngôn ngữ tiếng Việt cho học sinh, sinh viên", 50, "Máy tính khoa học Casio FX-580VN X" }
                });

            migrationBuilder.InsertData(
                table: "DonHang",
                columns: new[] { "MaDH", "DiaChiGiaoHang", "GhiChu", "HoTenNguoiNhan", "MaGiaoDịchNgoai", "MaKH", "MaPTTT", "NgayDat", "SDTNguoiNhan", "TongTien", "TrangThai", "TrangThaiThanhToan" },
                values: new object[] { 1, "123 Nguyễn Trãi, Quận 5, HCM", "Giao giờ hành chính", "Nguyễn Thúy Lan", "VNPAY12345", 1, 3, new DateTime(2026, 5, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "0901234567", 675000m, "Đang giao", "Đã thanh toán" });

            migrationBuilder.InsertData(
                table: "GioHang",
                columns: new[] { "MaGH", "MaKH", "NgayCapNhat", "TongTien" },
                values: new object[] { 1, 1, new DateTime(2026, 5, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 29000m });

            migrationBuilder.InsertData(
                table: "NhapHang",
                columns: new[] { "MaNH", "MaNCC", "MaNV", "NgayNhap", "TongTien", "TrangThai" },
                values: new object[] { 1, 2, 1, new DateTime(2026, 5, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 10000000m, "Đã hoàn thành" });

            migrationBuilder.InsertData(
                table: "sp_km",
                columns: new[] { "MaKM", "MaSP" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 1, 2 },
                    { 2, 4 }
                });

            migrationBuilder.InsertData(
                table: "ChiTietDonHang",
                columns: new[] { "MaDH", "MaSP", "DonGia", "SoLuong" },
                values: new object[,]
                {
                    { 1, 2, 25000m, 1 },
                    { 1, 4, 650000m, 1 }
                });

            migrationBuilder.InsertData(
                table: "ChiTietGioHang",
                columns: new[] { "MaGH", "MaSP", "DonGia", "SoLuong" },
                values: new object[,]
                {
                    { 1, 1, 4000m, 1 },
                    { 1, 2, 25000m, 1 }
                });

            migrationBuilder.InsertData(
                table: "ChiTietNhapHang",
                columns: new[] { "MaNH", "MaSP", "DonGia", "SoLuong" },
                values: new object[] { 1, 3, 300000m, 30 });

            migrationBuilder.InsertData(
                table: "DanhGia",
                columns: new[] { "MaDG", "MaDH", "MaKH", "MaSP", "NgayDG", "NoiDung", "SoSao" },
                values: new object[] { 1, 1, 1, 4, new DateTime(2026, 5, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "Máy tính chính hãng, giao nhanh, đóng gói cẩn thận. Rất hài lòng!", 5 });

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietDonHang_MaSP",
                table: "ChiTietDonHang",
                column: "MaSP");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietGioHang_MaSP",
                table: "ChiTietGioHang",
                column: "MaSP");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietNhapHang_MaSP",
                table: "ChiTietNhapHang",
                column: "MaSP");

            migrationBuilder.CreateIndex(
                name: "IX_DanhGia_MaDH",
                table: "DanhGia",
                column: "MaDH");

            migrationBuilder.CreateIndex(
                name: "IX_DanhGia_MaKH",
                table: "DanhGia",
                column: "MaKH");

            migrationBuilder.CreateIndex(
                name: "IX_DanhGia_MaSP",
                table: "DanhGia",
                column: "MaSP");

            migrationBuilder.CreateIndex(
                name: "IX_DonHang_MaKH",
                table: "DonHang",
                column: "MaKH");

            migrationBuilder.CreateIndex(
                name: "IX_DonHang_MaPTTT",
                table: "DonHang",
                column: "MaPTTT");

            migrationBuilder.CreateIndex(
                name: "IX_GioHang_MaKH",
                table: "GioHang",
                column: "MaKH");

            migrationBuilder.CreateIndex(
                name: "IX_KhachHang_MaHang",
                table: "KhachHang",
                column: "MaHang");

            migrationBuilder.CreateIndex(
                name: "IX_KhachHang_MaTK",
                table: "KhachHang",
                column: "MaTK",
                unique: true,
                filter: "[MaTK] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_NhanVien_MaSoNhanVien",
                table: "NhanVien",
                column: "MaSoNhanVien",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NhanVien_MaTK",
                table: "NhanVien",
                column: "MaTK",
                unique: true,
                filter: "[MaTK] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_NhapHang_MaNCC",
                table: "NhapHang",
                column: "MaNCC");

            migrationBuilder.CreateIndex(
                name: "IX_NhapHang_MaNV",
                table: "NhapHang",
                column: "MaNV");

            migrationBuilder.CreateIndex(
                name: "IX_PhuongThucThanhToan_MaCode",
                table: "PhuongThucThanhToan",
                column: "MaCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_MaLoai",
                table: "SanPham",
                column: "MaLoai");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_MaNCC",
                table: "SanPham",
                column: "MaNCC");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_MaTH",
                table: "SanPham",
                column: "MaTH");

            migrationBuilder.CreateIndex(
                name: "IX_sp_km_MaKM",
                table: "sp_km",
                column: "MaKM");

            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_TenDangNhap",
                table: "TaiKhoan",
                column: "TenDangNhap",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietDonHang");

            migrationBuilder.DropTable(
                name: "ChiTietGioHang");

            migrationBuilder.DropTable(
                name: "ChiTietNhapHang");

            migrationBuilder.DropTable(
                name: "DanhGia");

            migrationBuilder.DropTable(
                name: "sp_km");

            migrationBuilder.DropTable(
                name: "GioHang");

            migrationBuilder.DropTable(
                name: "NhapHang");

            migrationBuilder.DropTable(
                name: "DonHang");

            migrationBuilder.DropTable(
                name: "KhuyenMai");

            migrationBuilder.DropTable(
                name: "SanPham");

            migrationBuilder.DropTable(
                name: "NhanVien");

            migrationBuilder.DropTable(
                name: "KhachHang");

            migrationBuilder.DropTable(
                name: "PhuongThucThanhToan");

            migrationBuilder.DropTable(
                name: "LoaiSP");

            migrationBuilder.DropTable(
                name: "NhaCungCap");

            migrationBuilder.DropTable(
                name: "ThuongHieu");

            migrationBuilder.DropTable(
                name: "HangKhachHang");

            migrationBuilder.DropTable(
                name: "TaiKhoan");
        }
    }
}
