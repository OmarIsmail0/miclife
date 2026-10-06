using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class SectionModel
    {
        public int Id { get; set; }
        public string SectionKey { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime LastUpdated { get; set; }
        public bool IsActive { get; set; }
        public List<SectionTranslationModel>? Translations { get; set; }
        public List<SectionBlockModel>? Blocks { get; set; }
    }

    public class SectionTranslationModel
    {
        public int Id { get; set; }
        public int SectionId { get; set; }
        public string LanguageCode { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public string? SEO_Title { get; set; }
        public string? SEO_Description { get; set; }
    }

    public class CreateSectionModel
    {
        [Required]
        [MaxLength(100)]
        public string SectionKey { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Slug { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public bool IsActive { get; set; } = true;

        [Required]
        public List<CreateSectionTranslationModel> Translations { get; set; } = new();
    }

    public class CreateSectionTranslationModel
    {
        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Content { get; set; }

        [MaxLength(200)]
        public string? SEO_Title { get; set; }

        [MaxLength(500)]
        public string? SEO_Description { get; set; }
    }

    public class UpdateSectionModel
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string? SectionKey { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public bool IsActive { get; set; }

        public List<UpdateSectionTranslationModel>? Translations { get; set; }
    }

    public class UpdateSectionTranslationModel
    {
        public int? Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Content { get; set; }

        [MaxLength(200)]
        public string? SEO_Title { get; set; }

        [MaxLength(500)]
        public string? SEO_Description { get; set; }
    }

    public class SectionFilterModel
    {
        public string? SectionKey { get; set; }
        public bool? IsActive { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class SectionBlockModel
    {
        public int Id { get; set; }
        public int SectionId { get; set; }
        public int BlockId { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; }
        public BlockModel? Block { get; set; }
    }

    public class AssignBlocksToSectionModel
    {
        [Required]
        public int SectionId { get; set; }
        
        [Required]
        public List<int> BlockIds { get; set; } = new();
    }

    public class AssignSectionToBlockModel
    {
        [Required]
        public int BlockId { get; set; }
        
        [Required]
        public List<int> SectionIds { get; set; } = new();
    }

    public class UpdateSectionBlockOrderModel
    {
        [Required]
        public int SectionBlockId { get; set; }
        
        [Required]
        public int DisplayOrder { get; set; }
    }
}

