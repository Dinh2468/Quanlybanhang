using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_WebBDDHT.Migrations
{
    /// <inheritdoc />
    public partial class AddMaVanDonGHN : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MaVanDonGHN",
                table: "DonHang",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 1,
                column: "MaVanDonGHN",
                value: null);

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 2,
                column: "MaVanDonGHN",
                value: null);

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 3,
                column: "MaVanDonGHN",
                value: null);

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 4,
                column: "MaVanDonGHN",
                value: null);

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 5,
                column: "MaVanDonGHN",
                value: null);

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 6,
                column: "MaVanDonGHN",
                value: null);

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 7,
                column: "MaVanDonGHN",
                value: null);

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 8,
                column: "MaVanDonGHN",
                value: null);

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 9,
                column: "MaVanDonGHN",
                value: null);

            migrationBuilder.UpdateData(
                table: "DonHang",
                keyColumn: "MaDH",
                keyValue: 10,
                column: "MaVanDonGHN",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaVanDonGHN",
                table: "DonHang");
        }
    }
}
