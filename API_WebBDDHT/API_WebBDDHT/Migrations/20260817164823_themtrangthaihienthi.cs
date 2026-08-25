using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_WebBDDHT.Migrations
{
    /// <inheritdoc />
    public partial class themtrangthaihienthi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "TrangThaiHienThi",
                table: "SanPham",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 1,
                column: "TrangThaiHienThi",
                value: true);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 2,
                column: "TrangThaiHienThi",
                value: true);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 3,
                column: "TrangThaiHienThi",
                value: true);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 4,
                column: "TrangThaiHienThi",
                value: true);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 5,
                column: "TrangThaiHienThi",
                value: true);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 6,
                column: "TrangThaiHienThi",
                value: true);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 7,
                column: "TrangThaiHienThi",
                value: true);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 8,
                column: "TrangThaiHienThi",
                value: true);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 9,
                column: "TrangThaiHienThi",
                value: true);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 10,
                column: "TrangThaiHienThi",
                value: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TrangThaiHienThi",
                table: "SanPham");
        }
    }
}
