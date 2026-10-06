using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class ShareHolderModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Descrption { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
        public string? Share { get; set; }
    }

    public class CreateShareHolderModel
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        public string Descrption { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "ImageUrl cannot exceed 500 characters")]
        public string? ImageUrl { get; set; }

        public int DisplayOrder { get; set; } = 0;

        [MaxLength(100, ErrorMessage = "Share cannot exceed 100 characters")]
        public string? Share { get; set; }
    }

    public class UpdateShareHolderModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        public string Descrption { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "ImageUrl cannot exceed 500 characters")]
        public string? ImageUrl { get; set; }

        public int DisplayOrder { get; set; }

        [MaxLength(100, ErrorMessage = "Share cannot exceed 100 characters")]
        public string? Share { get; set; }
    }

    public class ShareHolderFilterModel
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}

