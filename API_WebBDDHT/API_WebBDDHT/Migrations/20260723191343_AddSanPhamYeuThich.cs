using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_WebBDDHT.Migrations
{
    /// <inheritdoc />
    public partial class AddSanPhamYeuThich : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SanPhamYeuThich",
                columns: table => new
                {
                    MaTK = table.Column<int>(type: "int", nullable: false),
                    MaSP = table.Column<int>(type: "int", nullable: false),
                    NgayThem = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SanPhamYeuThich", x => new { x.MaTK, x.MaSP });
                    table.ForeignKey(
                        name: "FK_SanPhamYeuThich_SanPham_MaSP",
                        column: x => x.MaSP,
                        principalTable: "SanPham",
                        principalColumn: "MaSP",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SanPhamYeuThich_TaiKhoan_MaTK",
                        column: x => x.MaTK,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTK",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SanPhamYeuThich_MaSP",
                table: "SanPhamYeuThich",
                column: "MaSP");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SanPhamYeuThich");
        }
    }
}
