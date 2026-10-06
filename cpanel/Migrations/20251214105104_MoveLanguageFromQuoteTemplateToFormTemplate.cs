using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace micpanel.Migrations
{
    /// <inheritdoc />
    public partial class MoveLanguageFromQuoteTemplateToFormTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Language",
                table: "QuoteTemplates");

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "FormTemplates",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Language",
                table: "FormTemplates");

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "QuoteTemplates",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
