using micpanel.ModelDto.Enums;
using micpanel.ModelDto.ValidationAttributes;
using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class DocumentModel
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string? FileExtension { get; set; }
        public long FileSize { get; set; }
        public string? MimeType { get; set; }
        public string? Description { get; set; }
        public EntityType EntityType { get; set; }
        public int EntityId { get; set; }
        public string? UploadedBy { get; set; }
        public string? UploadedByName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsPublic { get; set; }
        public string? Tags { get; set; }
    }

    public class CreateDocumentModel
    {
        [Required(ErrorMessage = "File is required")]
        public IFormFile File { get; set; }

        public string? Description { get; set; }

        [Required]
        public EntityType EntityType { get; set; }

        public string? UploadedByName { get; set; }

        public bool IsPublic { get; set; } = false;

        public string? Tags { get; set; }
    }

    public class UpdateDocumentModel
    {
        public int Id { get; set; }

        [Required]
        [RequiredFileName(ErrorMessage = "File name is required and must include a valid extension")]
        public string FileName { get; set; }

        public string? Description { get; set; }

        public bool IsPublic { get; set; }

        public string? Tags { get; set; }
    }

    public class DocumentFilterModel
    {
        public EntityType? EntityType { get; set; }
        public int? EntityId { get; set; }
        public string? FileExtension { get; set; }
        public bool? IsPublic { get; set; }
        public string? Tags { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
