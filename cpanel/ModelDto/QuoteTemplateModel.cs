using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class QuoteTemplateModel
    {
        public int Id { get; set; }
        public string RandomId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int FormTemplateId { get; set; }
        public FormTemplateModel? FormTemplate { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? ReplyJson { get; set; }
        public string? Contact { get; set; }
        public bool Replied { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? Expiration { get; set; }
        public bool isActive { get; set; }
    }

    public class CreateQuoteTemplateModel
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "FormTemplateId is required")]
        public int FormTemplateId { get; set; }

        [Required(ErrorMessage = "Type is required")]
        [MaxLength(50, ErrorMessage = "Type cannot exceed 50 characters")]
        public string Type { get; set; } = string.Empty;

        public string? ReplyJson { get; set; }
        public string? Contact { get; set; }
        public DateTime? Expiration { get; set; }
        public bool isActive { get; set; } = true;
    }

    public class UpdateQuoteTemplateModel
    {
        [Required]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "FormTemplateId is required")]
        public int FormTemplateId { get; set; }

        [Required(ErrorMessage = "Type is required")]
        [MaxLength(50, ErrorMessage = "Type cannot exceed 50 characters")]
        public string Type { get; set; } = string.Empty;

        public string? ReplyJson { get; set; }
        public string? Contact { get; set; }
        public bool Replied { get; set; }
        public DateTime? Expiration { get; set; }
        public bool isActive { get; set; }
    }

    public class QuoteTemplateFilterModel
    {
        public string? Type { get; set; }
        public bool? Replied { get; set; }
        public bool? isActive { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class FormTemplateModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Design { get; set; } = string.Empty;
        public string? Language { get; set; }
    }

    public class CreateFormTemplateModel
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Design is required")]
        public string Design { get; set; } = string.Empty;

        [MaxLength(10, ErrorMessage = "Language code cannot exceed 10 characters")]
        public string? Language { get; set; }
    }

    public class UpdateFormTemplateModel
    {
        [Required]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Design is required")]
        public string Design { get; set; } = string.Empty;

        [MaxLength(10, ErrorMessage = "Language code cannot exceed 10 characters")]
        public string? Language { get; set; }
    }

    public class FormTemplateFilterModel
    {
        public string? Language { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}

