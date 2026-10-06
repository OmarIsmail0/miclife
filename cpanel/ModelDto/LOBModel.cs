using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class LOBModel
    {
        public int Id { get; set; }
        public string? Slug { get; set; }
        public string? IconUrl { get; set; }
        //[MaxLength(500)]
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
        public List<LOBTranslationModel>? Translations { get; set; }
    }

    public class LOBTranslationModel
    {
        public int Id { get; set; }
        public int LOBId { get; set; }
        public string LanguageCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CreateLOBModel
    {
        [MaxLength(200)]
        public string? Slug { get; set; }

        [MaxLength(500)]
        public string? IconUrl { get; set; }
        public string? ImageUrl { get; set; }

        public bool IsActive { get; set; } = true;

        public int DisplayOrder { get; set; } = 0;

        [Required]
        public List<CreateLOBTranslationModel> Translations { get; set; } = new();
    }

    public class CreateLOBTranslationModel
    {
        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }
    }

    public class UpdateLOBModel
    {
        public int Id { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        [MaxLength(500)]
        public string? IconUrl { get; set; }
        public string? ImageUrl { get; set; }

        public bool IsActive { get; set; }

        public int DisplayOrder { get; set; }

        public List<UpdateLOBTranslationModel>? Translations { get; set; }
    }

    public class UpdateLOBTranslationModel
    {
        public int? Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }
    }

    public class LOBFilterModel
    {
        public bool? IsActive { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}

