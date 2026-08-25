using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_WebBDDHT.Migrations
{
    /// <inheritdoc />
    public partial class AddQuanHuyenPhuongXaToDonHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MaPhuongXa",
                table: "DonHang",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaQuanHuyen",
                table: "DonHang",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 1,
                columns: new[] { "MaPhuongXa", "MaQuanHuyen" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 2,
                columns: new[] { "MaPhuongXa", "MaQuanHuyen" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 3,
                columns: new[] { "MaPhuongXa", "MaQuanHuyen" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 4,
                columns: new[] { "MaPhuongXa", "MaQuanHuyen" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 5,
                columns: new[] { "MaPhuongXa", "MaQuanHuyen" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 6,
                columns: new[] { "MaPhuongXa", "MaQuanHuyen" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 7,
                columns: new[] { "MaPhuongXa", "MaQuanHuyen" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 8,
                columns: new[] { "MaPhuongXa", "MaQuanHuyen" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 9,
                columns: new[] { "MaPhuongXa", "MaQuanHuyen" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 10,
                columns: new[] { "MaPhuongXa", "MaQuanHuyen" },
                values: new object[] { null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaPhuongXa",
                table: "DonHang");

            migrationBuilder.DropColumn(
                name: "MaQuanHuyen",
                table: "DonHang");
        }
    }
}
