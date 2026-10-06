using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class BranchModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Descrption { get; set; } = string.Empty;
    }

    public class CreateBranchModel
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;
        public string Descrption { get; set; } = string.Empty;
    }

    public class UpdateBranchModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;
        public string Descrption { get; set; } = string.Empty;
    }

    public class BranchFilterModel
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}

