using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class InnvestoreModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? UrlFrm { get; set; }
        public string? UrlFrmAr { get; set; }
        public string TitleAr { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }

    public class CreateInnvestoreModel
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "UrlFrm cannot exceed 500 characters")]
        public string? UrlFrm { get; set; }
        public string? UrlFrmAr { get; set; }
        public string TitleAr { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "ImageUrl cannot exceed 500 characters")]
        public string? ImageUrl { get; set; }
    }

    public class UpdateInnvestoreModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "UrlFrm cannot exceed 500 characters")]
        public string? UrlFrm { get; set; }
        public string? UrlFrmAr { get; set; }
        public string TitleAr { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "ImageUrl cannot exceed 500 characters")]
        public string? ImageUrl { get; set; }
    }

    public class InnvestoreFilterModel
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
