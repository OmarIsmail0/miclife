using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class ProductModel
    {
        public int Id { get; set; }
        public int LOBId { get; set; }
        public string? Slug { get; set; }
        public string? ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public List<ProductTranslationModel>? Translations { get; set; }
    }

    public class ProductTranslationModel
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string LanguageCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? SEO_Title { get; set; }
        public string? SEO_Description { get; set; }
    }

    public class CreateProductModel
    {
        [Required]
        public int LOBId { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        [Required]
        public List<CreateProductTranslationModel> Translations { get; set; } = new();
    }

    public class CreateProductTranslationModel
    {
        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        public string? FullDescription { get; set; }

        [MaxLength(200)]
        public string? SEO_Title { get; set; }

        [MaxLength(500)]
        public string? SEO_Description { get; set; }
    }

    public class UpdateProductModel
    {
        public int Id { get; set; }

        [Required]
        public int LOBId { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; }

        public List<UpdateProductTranslationModel>? Translations { get; set; }
    }

    public class UpdateProductTranslationModel
    {
        public int? Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        public string? FullDescription { get; set; }

        [MaxLength(200)]
        public string? SEO_Title { get; set; }

        [MaxLength(500)]
        public string? SEO_Description { get; set; }
    }

    public class ProductFilterModel
    {
        public int? LOBId { get; set; }
        public bool? IsActive { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}

