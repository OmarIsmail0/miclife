using System.ComponentModel.DataAnnotations;
using micpanel.ModelDto.Enums;

namespace micpanel.ModelDto.ValidationAttributes
{
    public class AllowedExtensionsAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is not string extension)
                return false;

            return FileUploadConstants.IsValidExtension(extension);
        }

        public override string FormatErrorMessage(string name)
        {
            return $"The {name} field only allows the following extensions: {FileUploadConstants.GetAllowedExtensionsString()}";
        }
    }

    public class MaxFileSizeAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is not long fileSize)
                return false;

            return FileUploadConstants.IsValidFileSize(fileSize);
        }

        public override string FormatErrorMessage(string name)
        {
            return $"The {name} field must not exceed {FileUploadConstants.MaxFileSizeMB}MB ({FileUploadConstants.MaxFileSizeBytes} bytes)";
        }
    }

    public class RequiredFileNameAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is not string fileName)
                return false;

            if (string.IsNullOrWhiteSpace(fileName))
                return false;

            // Check if filename has an extension
            var extension = Path.GetExtension(fileName);
            return !string.IsNullOrEmpty(extension);
        }

        public override string FormatErrorMessage(string name)
        {
            return $"The {name} field is required and must include a valid file extension";
        }
    }
} 