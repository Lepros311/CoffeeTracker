using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoffeeTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedSalesData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Sales",
                columns: new[] { "Id", "CoffeeId", "CoffeeName", "DateAndTimeOfSale", "IsDeleted", "Total" },
                values: new object[] { 1, 3, "Iced Coffee", new DateTime(2025, 10, 9, 10, 24, 0, 335, DateTimeKind.Local).AddTicks(3325), false, 1.62m });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Sales",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
