using micpanel.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace micpanel.Context
{
    public class CommerceDb : IdentityDbContext<AuthUser>
    {
        public CommerceDb(DbContextOptions<CommerceDb> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure many-to-many relationship between Section and Block
            modelBuilder.Entity<SectionBlock>()
                .HasIndex(sb => new { sb.SectionId, sb.BlockId })
                .IsUnique(); // Prevent duplicate block assignments to the same section
            
            // Configure QuoteTemplate to FormTemplate relationship
            modelBuilder.Entity<QuoteTemplate>()
                .HasOne(qt => qt.FormTemplate)
                .WithMany()
                .HasForeignKey(qt => qt.FormTemplateId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent deletion of FormTemplate if it's used
        }
        public DbSet<BlacklistedToken> BlacklistedTokens { get; set; }
        public DbSet<ApiLog> ApiLogs { get; set; }
        public DbSet<Document> Documents { get; set; }

        // Core Content
        public DbSet<Section> Sections { get; set; }
        public DbSet<SectionTranslation> SectionTranslations { get; set; }

        // Product Catalog
        public DbSet<LOB> LOBs { get; set; }
        public DbSet<LOBTranslation> LOBTranslations { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductTranslation> ProductTranslations { get; set; }

        // Questions
        public DbSet<Question> Questions { get; set; }

        // Innvestore
        public DbSet<Innvestore> Innvestores { get; set; }

        // Tickets
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketActivity> TicketActivities { get; set; }

        // Blocks
        public DbSet<Block> Blocks { get; set; }
        public DbSet<BlockTranslation> BlockTranslations { get; set; }
        
        // Section-Block relationship
        public DbSet<SectionBlock> SectionBlocks { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<ShareHolder> ShareHolders { get; set; }
        public DbSet<BoardMember> BoardMembers { get; set; }

        // Albums
        public DbSet<Album> Albums { get; set; }
        public DbSet<AlbumTranslation> AlbumTranslations { get; set; }

        // Quote Templates
        public DbSet<QuoteTemplate> QuoteTemplates { get; set; }
        public DbSet<FormTemplate> FormTemplates { get; set; }

    }
}
