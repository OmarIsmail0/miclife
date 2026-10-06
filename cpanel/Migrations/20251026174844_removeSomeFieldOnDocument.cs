using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace micpanel.Migrations
{
    /// <inheritdoc />
    public partial class removeSomeFieldOnDocument : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EntityId",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "UploadedBy",
                table: "Documents");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EntityId",
                table: "Documents",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UploadedBy",
                table: "Documents",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
