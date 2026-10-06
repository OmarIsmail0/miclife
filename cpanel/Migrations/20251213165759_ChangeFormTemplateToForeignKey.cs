using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace micpanel.Migrations
{
    /// <inheritdoc />
    public partial class ChangeFormTemplateToForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FormTemplate",
                table: "QuoteTemplates");

            migrationBuilder.AddColumn<int>(
                name: "FormTemplateId",
                table: "QuoteTemplates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_QuoteTemplates_FormTemplateId",
                table: "QuoteTemplates",
                column: "FormTemplateId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuoteTemplates_FormTemplates_FormTemplateId",
                table: "QuoteTemplates",
                column: "FormTemplateId",
                principalTable: "FormTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuoteTemplates_FormTemplates_FormTemplateId",
                table: "QuoteTemplates");

            migrationBuilder.DropIndex(
                name: "IX_QuoteTemplates_FormTemplateId",
                table: "QuoteTemplates");

            migrationBuilder.DropColumn(
                name: "FormTemplateId",
                table: "QuoteTemplates");

            migrationBuilder.AddColumn<string>(
                name: "FormTemplate",
                table: "QuoteTemplates",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
