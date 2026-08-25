using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_WebBDDHT.Migrations
{
    /// <inheritdoc />
    public partial class AddAvatarToTaiKhoan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Avatar",
                table: "TaiKhoan",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 1,
                column: "Avatar",
                value: null);

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 2,
                column: "Avatar",
                value: null);

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 3,
                column: "Avatar",
                value: null);

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 4,
                column: "Avatar",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Avatar",
                table: "TaiKhoan");
        }
    }
}
