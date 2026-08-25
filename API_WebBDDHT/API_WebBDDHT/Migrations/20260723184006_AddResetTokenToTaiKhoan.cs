using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_WebBDDHT.Migrations
{
    /// <inheritdoc />
    public partial class AddResetTokenToTaiKhoan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResetToken",
                table: "TaiKhoan",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ResetTokenExpiry",
                table: "TaiKhoan",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 1,
                columns: new[] { "ResetToken", "ResetTokenExpiry" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 2,
                columns: new[] { "ResetToken", "ResetTokenExpiry" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 3,
                columns: new[] { "ResetToken", "ResetTokenExpiry" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 4,
                columns: new[] { "ResetToken", "ResetTokenExpiry" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 5,
                columns: new[] { "ResetToken", "ResetTokenExpiry" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 6,
                columns: new[] { "ResetToken", "ResetTokenExpiry" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 7,
                columns: new[] { "ResetToken", "ResetTokenExpiry" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 8,
                columns: new[] { "ResetToken", "ResetTokenExpiry" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 9,
                columns: new[] { "ResetToken", "ResetTokenExpiry" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TaiKhoan",
                keyColumn: "MaTK",
                keyValue: 10,
                columns: new[] { "ResetToken", "ResetTokenExpiry" },
                values: new object[] { null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResetToken",
                table: "TaiKhoan");

            migrationBuilder.DropColumn(
                name: "ResetTokenExpiry",
                table: "TaiKhoan");
        }
    }
}
