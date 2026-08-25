using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_WebBDDHT.Migrations
{
    /// <inheritdoc />
    public partial class RemoveMaNCCFromSanPham : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SanPham_NhaCungCap_MaNCC",
                table: "SanPham");

            migrationBuilder.DropIndex(
                name: "IX_SanPham_MaNCC",
                table: "SanPham");

            migrationBuilder.DropColumn(
                name: "MaNCC",
                table: "SanPham");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaNCC",
                table: "SanPham",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 1,
                column: "MaNCC",
                value: 1);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 2,
                column: "MaNCC",
                value: 2);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 3,
                column: "MaNCC",
                value: 2);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 4,
                column: "MaNCC",
                value: 2);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 5,
                column: "MaNCC",
                value: 5);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 6,
                column: "MaNCC",
                value: 3);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 7,
                column: "MaNCC",
                value: 3);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 8,
                column: "MaNCC",
                value: 2);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 9,
                column: "MaNCC",
                value: 7);

            migrationBuilder.UpdateData(
                table: "SanPham",
                keyColumn: "MaSP",
                keyValue: 10,
                column: "MaNCC",
                value: 3);

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_MaNCC",
                table: "SanPham",
                column: "MaNCC");

            migrationBuilder.AddForeignKey(
                name: "FK_SanPham_NhaCungCap_MaNCC",
                table: "SanPham",
                column: "MaNCC",
                principalTable: "NhaCungCap",
                principalColumn: "MaNCC",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
