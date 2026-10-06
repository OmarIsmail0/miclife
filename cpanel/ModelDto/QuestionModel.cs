using System.ComponentModel.DataAnnotations;

namespace micpanel.ModelDto
{
    public class QuestionModel
    {
        public int Id { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateQuestionModel
    {
        [Required(ErrorMessage = "Question text is required")]
        [MaxLength(1000, ErrorMessage = "Question text cannot exceed 1000 characters")]
        public string QuestionText { get; set; } = string.Empty;

        [Required(ErrorMessage = "Answer is required")]
        public string Answer { get; set; } = string.Empty;

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }

    public class UpdateQuestionModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Question text is required")]
        [MaxLength(1000, ErrorMessage = "Question text cannot exceed 1000 characters")]
        public string QuestionText { get; set; } = string.Empty;

        [Required(ErrorMessage = "Answer is required")]
        public string Answer { get; set; } = string.Empty;

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; }
    }

    public class QuestionFilterModel
    {
        public bool? IsActive { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}

