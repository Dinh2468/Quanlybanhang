using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_WebBDDHT.Migrations
{
    /// <inheritdoc />
    public partial class GopKiemKeNhapHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LoaiPhieu",
                table: "NhapHang",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SoLuongConLai",
                table: "ChiTietNhapHang",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "SoLuong",
                table: "ChiTietDonHang",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "DonGia",
                table: "ChiTietDonHang",
                type: "decimal(18,0)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,0)",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "ChiTietNhapHang",
                keyColumns: new[] { "MaNH", "MaSP" },
                keyValues: new object[] { 1, 3 },
                column: "SoLuongConLai",
                value: null);

            migrationBuilder.UpdateData(
                table: "ChiTietNhapHang",
                keyColumns: new[] { "MaNH", "MaSP" },
                keyValues: new object[] { 2, 1 },
                column: "SoLuongConLai",
                value: null);

            migrationBuilder.UpdateData(
                table: "ChiTietNhapHang",
                keyColumns: new[] { "MaNH", "MaSP" },
                keyValues: new object[] { 3, 6 },
                column: "SoLuongConLai",
                value: null);

            migrationBuilder.UpdateData(
                table: "ChiTietNhapHang",
                keyColumns: new[] { "MaNH", "MaSP" },
                keyValues: new object[] { 4, 3 },
                column: "SoLuongConLai",
                value: null);

            migrationBuilder.UpdateData(
                table: "ChiTietNhapHang",
                keyColumns: new[] { "MaNH", "MaSP" },
                keyValues: new object[] { 5, 5 },
                column: "SoLuongConLai",
                value: null);

            migrationBuilder.UpdateData(
                table: "ChiTietNhapHang",
                keyColumns: new[] { "MaNH", "MaSP" },
                keyValues: new object[] { 6, 2 },
                column: "SoLuongConLai",
                value: null);

            migrationBuilder.UpdateData(
                table: "ChiTietNhapHang",
                keyColumns: new[] { "MaNH", "MaSP" },
                keyValues: new object[] { 7, 9 },
                column: "SoLuongConLai",
                value: null);

            migrationBuilder.UpdateData(
                table: "ChiTietNhapHang",
                keyColumns: new[] { "MaNH", "MaSP" },
                keyValues: new object[] { 8, 7 },
                column: "SoLuongConLai",
                value: null);

            migrationBuilder.UpdateData(
                table: "ChiTietNhapHang",
                keyColumns: new[] { "MaNH", "MaSP" },
                keyValues: new object[] { 9, 8 },
                column: "SoLuongConLai",
                value: null);

            migrationBuilder.UpdateData(
                table: "ChiTietNhapHang",
                keyColumns: new[] { "MaNH", "MaSP" },
                keyValues: new object[] { 10, 10 },
                column: "SoLuongConLai",
                value: null);

            migrationBuilder.UpdateData(
                table: "NhapHang",
                keyColumn: "MaNH",
                keyValue: 1,
                column: "LoaiPhieu",
                value: "Nhập hàng");

            migrationBuilder.UpdateData(
                table: "NhapHang",
                keyColumn: "MaNH",
                keyValue: 2,
                column: "LoaiPhieu",
                value: "Nhập hàng");

            migrationBuilder.UpdateData(
                table: "NhapHang",
                keyColumn: "MaNH",
                keyValue: 3,
                column: "LoaiPhieu",
                value: "Nhập hàng");

            migrationBuilder.UpdateData(
                table: "NhapHang",
                keyColumn: "MaNH",
                keyValue: 4,
                column: "LoaiPhieu",
                value: "Nhập hàng");

            migrationBuilder.UpdateData(
                table: "NhapHang",
                keyColumn: "MaNH",
                keyValue: 5,
                column: "LoaiPhieu",
                value: "Nhập hàng");

            migrationBuilder.UpdateData(
                table: "NhapHang",
                keyColumn: "MaNH",
                keyValue: 6,
                column: "LoaiPhieu",
                value: "Nhập hàng");

            migrationBuilder.UpdateData(
                table: "NhapHang",
                keyColumn: "MaNH",
                keyValue: 7,
                column: "LoaiPhieu",
                value: "Nhập hàng");

            migrationBuilder.UpdateData(
                table: "NhapHang",
                keyColumn: "MaNH",
                keyValue: 8,
                column: "LoaiPhieu",
                value: "Nhập hàng");

            migrationBuilder.UpdateData(
                table: "NhapHang",
                keyColumn: "MaNH",
                keyValue: 9,
                column: "LoaiPhieu",
                value: "Nhập hàng");

            migrationBuilder.UpdateData(
                table: "NhapHang",
                keyColumn: "MaNH",
                keyValue: 10,
                column: "LoaiPhieu",
                value: "Nhập hàng");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoaiPhieu",
                table: "NhapHang");

            migrationBuilder.DropColumn(
                name: "SoLuongConLai",
                table: "ChiTietNhapHang");

            migrationBuilder.AlterColumn<int>(
                name: "SoLuong",
                table: "ChiTietDonHang",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "DonGia",
                table: "ChiTietDonHang",
                type: "decimal(18,0)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,0)");
        }
    }
}
