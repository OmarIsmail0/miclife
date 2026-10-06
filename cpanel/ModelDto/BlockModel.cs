using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class BlockModel
    {
        public int Id { get; set; }
        public string? Slug { get; set; }
        public string? ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<BlockTranslationModel>? Translations { get; set; }
        public List<int>? SectionIds { get; set; }
    }

    public class BlockTranslationModel
    {
        public int Id { get; set; }
        public int BlockId { get; set; }
        public string LanguageCode { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? SEO_Title { get; set; }
        public string? SEO_Description { get; set; }
    }

    public class CreateBlockModel
    {
        [MaxLength(200)]
        public string? Slug { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        [Required]
        public List<CreateBlockTranslationModel> Translations { get; set; } = new();
    }

    public class CreateBlockTranslationModel
    {
        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [MaxLength(200)]
        public string? SEO_Title { get; set; }

        [MaxLength(500)]
        public string? SEO_Description { get; set; }
    }

    public class UpdateBlockModel
    {
        public int Id { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; }

        public List<UpdateBlockTranslationModel>? Translations { get; set; }
    }

    public class UpdateBlockTranslationModel
    {
        public int? Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [MaxLength(200)]
        public string? SEO_Title { get; set; }

        [MaxLength(500)]
        public string? SEO_Description { get; set; }
    }

    public class BlockFilterModel
    {
        public bool? IsActive { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
