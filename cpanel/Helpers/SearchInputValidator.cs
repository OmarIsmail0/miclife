using System.Linq;

namespace micpanel.Helpers
{
    public static class SearchInputValidator
    {
        // Maximum length for search terms to prevent DoS attacks
        private const int MaxSearchTermLength = 200;
        
        // Maximum length for filter fields
        private const int MaxFilterFieldLength = 100;

        /// <summary>
        /// Validates and sanitizes a search term
        /// </summary>
        /// <param name="searchTerm">The search term to validate</param>
        /// <returns>Tuple with (isValid, sanitizedTerm, errorMessage)</returns>
        public static (bool IsValid, string? SanitizedTerm, string? ErrorMessage) ValidateSearchTerm(string? searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return (false, null, "Search term cannot be empty");
            }

            // Trim whitespace
            var sanitized = searchTerm.Trim();

            // Check length
            if (sanitized.Length > MaxSearchTermLength)
            {
                return (false, null, $"Search term cannot exceed {MaxSearchTermLength} characters");
            }

            // Remove null characters and other control characters that could cause issues
            sanitized = new string(sanitized.Where(c => !char.IsControl(c) || char.IsWhiteSpace(c)).ToArray());

            // Additional validation: Check for potentially malicious patterns
            // (This is a basic check - adjust based on your needs)
            if (sanitized.Contains("--") || sanitized.Contains("/*") || sanitized.Contains("*/"))
            {
                // These patterns are often used in SQL injection attempts
                // Since we're using EF Core with parameterized queries, this is just extra safety
                sanitized = sanitized.Replace("--", "").Replace("/*", "").Replace("*/", "");
            }

            return (true, sanitized, null);
        }

        /// <summary>
        /// Validates and sanitizes a filter field (like tags, email, etc.)
        /// </summary>
        /// <param name="filterValue">The filter value to validate</param>
        /// <returns>Tuple with (isValid, sanitizedValue, errorMessage)</returns>
        public static (bool IsValid, string? SanitizedValue, string? ErrorMessage) ValidateFilterField(string? filterValue)
        {
            if (string.IsNullOrWhiteSpace(filterValue))
            {
                return (false, null, null); // Empty filter is allowed (means no filter)
            }

            // Trim whitespace
            var sanitized = filterValue.Trim();

            // Check length
            if (sanitized.Length > MaxFilterFieldLength)
            {
                return (false, null, $"Filter value cannot exceed {MaxFilterFieldLength} characters");
            }

            // Remove null characters
            sanitized = new string(sanitized.Where(c => !char.IsControl(c) || char.IsWhiteSpace(c)).ToArray());

            return (true, sanitized, null);
        }

        /// <summary>
        /// Validates pagination parameters
        /// </summary>
        public static (bool IsValid, string? ErrorMessage) ValidatePagination(int pageNumber, int pageSize, int maxPageSize = 100)
        {
            if (pageNumber < 1)
            {
                return (false, "Page number must be greater than 0");
            }

            if (pageSize < 1)
            {
                return (false, "Page size must be greater than 0");
            }

            if (pageSize > maxPageSize)
            {
                return (false, $"Page size cannot exceed {maxPageSize}");
            }

            return (true, null);
        }
    }
}

