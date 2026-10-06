using micpanel.ModelDto.Enums;
using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class AlbumModel
    {
        public int Id { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public MediaType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<AlbumTranslationModel>? Translations { get; set; }
        public List<DocumentModel>? Images { get; set; } // Images linked to this album
    }

    public class AlbumTranslationModel
    {
        public int Id { get; set; }
        public int AlbumId { get; set; }
        public string LanguageCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CreateAlbumModel
    {
        public int DisplayOrder { get; set; } = 0;
        public MediaType Type { get; set; }
        public bool IsActive { get; set; } = true;

        [Required]
        public List<CreateAlbumTranslationModel> Translations { get; set; } = new();
    }

    public class CreateAlbumTranslationModel
    {
        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
    }

    public class UpdateAlbumModel
    {
        [Required]
        public int Id { get; set; }

        public int DisplayOrder { get; set; }
        public MediaType Type { get; set; }
        public bool IsActive { get; set; }

        [Required]
        public List<UpdateAlbumTranslationModel> Translations { get; set; } = new();
    }

    public class UpdateAlbumTranslationModel
    {
        public int? Id { get; set; } // Null for new translations

        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}

