using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class BoardMemberModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Title { get; set; }
        public string? ImageUrl { get; set; }
        public string? IconUrl { get; set; }
        public string? Description { get; set; }
    }

    public class CreateBoardMemberModel
    {
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string? Name { get; set; }

        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string? Title { get; set; }

        [MaxLength(500, ErrorMessage = "ImageUrl cannot exceed 500 characters")]
        public string? ImageUrl { get; set; }

        [MaxLength(500, ErrorMessage = "IconUrl cannot exceed 500 characters")]
        public string? IconUrl { get; set; }

        [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string? Description { get; set; }
    }

    public class UpdateBoardMemberModel
    {
        public int Id { get; set; }

        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string? Name { get; set; }

        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string? Title { get; set; }

        [MaxLength(500, ErrorMessage = "ImageUrl cannot exceed 500 characters")]
        public string? ImageUrl { get; set; }

        [MaxLength(500, ErrorMessage = "IconUrl cannot exceed 500 characters")]
        public string? IconUrl { get; set; }

        [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string? Description { get; set; }
    }

    public class BoardMemberFilterModel
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}

