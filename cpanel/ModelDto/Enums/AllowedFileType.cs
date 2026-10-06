namespace micpanel.ModelDto.Enums
{
    public enum AllowedFileType
    {
        // Images
        Jpeg = 1,
        Jpg = 2,
        Png = 3,
        Gif = 4,
        Bmp = 5,
        Webp = 6,
        svg = 7,
        
        // Documents
        Pdf = 10,
        
        // Microsoft Word
        Doc = 20,
        Docx = 21,
        
        // Microsoft Excel
        Xls = 30,
        Xlsx = 31,
        
        // CSV
        Csv = 40
    }

    public static class FileUploadConstants
    {
        public const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10MB
        public const int MaxFileSizeMB = 10;

        public static readonly Dictionary<string, AllowedFileType> AllowedExtensions = new()
        {
            // Images
            { ".jpg", AllowedFileType.Jpg },
            { ".jpeg", AllowedFileType.Jpeg },
            { ".png", AllowedFileType.Png },
            { ".gif", AllowedFileType.Gif },
            { ".bmp", AllowedFileType.Bmp },
            { ".webp", AllowedFileType.Webp },
            { ".svg", AllowedFileType.svg },
            
            // Documents
            { ".pdf", AllowedFileType.Pdf },
            
            // Microsoft Word
            { ".doc", AllowedFileType.Doc },
            { ".docx", AllowedFileType.Docx },
            
            // Microsoft Excel
            { ".xls", AllowedFileType.Xls },
            { ".xlsx", AllowedFileType.Xlsx },
            
            // CSV
            { ".csv", AllowedFileType.Csv }
        };

        public static readonly Dictionary<AllowedFileType, string[]> MimeTypes = new()
        {
            { AllowedFileType.Jpg, new[] { "image/jpeg", "image/jpg" } },
            { AllowedFileType.Jpeg, new[] { "image/jpeg", "image/jpg" } },
            { AllowedFileType.Png, new[] { "image/png" } },
            { AllowedFileType.Gif, new[] { "image/gif" } },
            { AllowedFileType.Bmp, new[] { "image/bmp" } },
            { AllowedFileType.Webp, new[] { "image/webp" } },
            { AllowedFileType.Pdf, new[] { "application/pdf" } },
            { AllowedFileType.Doc, new[] { "application/msword" } },
            { AllowedFileType.Docx, new[] { "application/vnd.openxmlformats-officedocument.wordprocessingml.document" } },
            { AllowedFileType.Xls, new[] { "application/vnd.ms-excel" } },
            { AllowedFileType.Xlsx, new[] { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" } },
            { AllowedFileType.Csv, new[] { "text/csv", "application/csv" } },
            { AllowedFileType.svg,  new[] { "image/svg+xml" } }
        };

        public static bool IsValidExtension(string extension)
        {
            return !string.IsNullOrEmpty(extension) && AllowedExtensions.ContainsKey(extension.ToLowerInvariant());
        }

        public static bool IsValidFileSize(long fileSizeBytes)
        {
            return fileSizeBytes > 0 && fileSizeBytes <= MaxFileSizeBytes;
        }

        public static string GetAllowedExtensionsString()
        {
            return string.Join(", ", AllowedExtensions.Keys);
        }
    }
} 