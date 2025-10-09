using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoffeeTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedSalesDataFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Sales",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateAndTimeOfSale",
                value: new DateTime(2023, 10, 9, 10, 30, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Sales",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateAndTimeOfSale",
                value: new DateTime(2025, 10, 9, 10, 24, 0, 335, DateTimeKind.Local).AddTicks(3325));
        }
    }
}
