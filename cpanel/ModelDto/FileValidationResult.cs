namespace micpanel.ModelDto
{
    public class FileValidationResult
    {
        public bool IsValid { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
    }

    public class FileUploadValidationResult
    {
        public bool IsValid { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public string? DetectedMimeType { get; set; }
        public string? DetectedExtension { get; set; }
        public long FileSize { get; set; }
        public string FileName { get; set; } = string.Empty;
    }
}
