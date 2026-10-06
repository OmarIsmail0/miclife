using micpanel.Context;
using micpanel.Helpers;
using micpanel.ModelDto;
using micpanel.Models;
using micpanel.ModelDto.Enums;
using Microsoft.EntityFrameworkCore;
using static micpanel.ModelDto.Enums.FileUploadConstants;

namespace micpanel.Repository
{
        public class DocumentService : IDocumentService
        {
            private readonly CommerceDb _context;

            public DocumentService(CommerceDb context)
            {
                _context = context;
            }

            public async Task<PaginationResponse<DocumentModel>> GetAllDocumentsAsync(DocumentFilterModel filter)
            {
                var query = _context.Documents.Where(d => !d.IsDeleted);

                // Apply filters
                if (filter.EntityType.HasValue)
                    query = query.Where(d => d.EntityType == filter.EntityType.Value);

                if (!string.IsNullOrEmpty(filter.FileExtension))
                    query = query.Where(d => d.FileExtension == filter.FileExtension);

                if (filter.IsPublic.HasValue)
                    query = query.Where(d => d.IsPublic == filter.IsPublic.Value);

                if (!string.IsNullOrEmpty(filter.Tags))
                {
                    // Validate and sanitize filter input
                    var (isValid, sanitizedTags, errorMessage) = SearchInputValidator.ValidateFilterField(filter.Tags);
                    if (!isValid || string.IsNullOrEmpty(sanitizedTags))
                    {
                        // If validation fails, return empty result instead of throwing
                        // This prevents DoS attacks with malicious input
                        return new PaginationResponse<DocumentModel>
                        {
                            Data = new List<DocumentModel>(),
                            TotalCount = 0,
                            PageNumber = filter.PageNumber,
                            PageSize = filter.PageSize,
                            TotalPages = 0,
                            HasPreviousPage = false,
                            HasNextPage = false
                        };
                    }
                    query = query.Where(d => d.Tags != null && d.Tags.Contains(sanitizedTags));
                }

                var totalCount = await query.CountAsync();
                var documents = await query
                    .OrderByDescending(d => d.CreatedAt)
                    .Skip((filter.PageNumber - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .ToListAsync();

                var documentModels = documents.Select(MapToDocumentModel).ToList();
                var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

                return new PaginationResponse<DocumentModel>
                {
                    Data = documentModels,
                    TotalCount = totalCount,
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalPages = totalPages,
                    HasPreviousPage = filter.PageNumber > 1,
                    HasNextPage = filter.PageNumber < totalPages
                };
            }

            public async Task<DocumentModel?> GetDocumentByIdAsync(int id)
            {
                var document = await _context.Documents
                    .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

                return document == null ? null : MapToDocumentModel(document);
            }

            public async Task<IEnumerable<DocumentModel>> GetDocumentsByEntityAsync(EntityType entityType)
            {
                var documents = await _context.Documents
                    .Where(d => d.EntityType == entityType && !d.IsDeleted)
                    .OrderByDescending(d => d.CreatedAt)
                    .ToListAsync();

                return documents.Select(MapToDocumentModel);
            }

            public async Task<DocumentModel> CreateDocumentAsync(CreateDocumentModel model)
            {
                // Validate uploaded file
                var validationResult = await ValidateFileUploadAsync(model.File);
                if (!validationResult.IsValid)
                {
                    throw new ArgumentException(validationResult.ErrorMessage);
                }

                // Generate unique filename to prevent conflicts
                var fileExtension = Path.GetExtension(model.File.FileName);
                var fileName = $"{Guid.NewGuid()}{fileExtension}";

                // Create upload path (you might want to make this configurable)
                var uploadsFolder = "uploads/documents";
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), uploadsFolder);
                var filePath = Path.Combine(uploadsPath, fileName);

                // Ensure upload directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

                long fileSizeToStore = validationResult.FileSize;
                var isSvg = string.Equals(validationResult.DetectedExtension, ".svg", StringComparison.OrdinalIgnoreCase);

                if (isSvg)
                {
                    using var reader = new StreamReader(model.File.OpenReadStream(), System.Text.Encoding.UTF8);
                    var rawSvg = await reader.ReadToEndAsync();
                    var sanitized = SvgSanitizer.Sanitize(rawSvg);
                    if (string.IsNullOrEmpty(sanitized))
                        throw new ArgumentException("SVG content is invalid or could not be sanitized. Remove scripts and event handlers.");
                    var utf8 = System.Text.Encoding.UTF8;
                    var bytes = utf8.GetBytes(sanitized);
                    await System.IO.File.WriteAllBytesAsync(filePath, bytes);
                    fileSizeToStore = bytes.Length;
                }
                else
                {
                    await using var stream = new FileStream(filePath, FileMode.Create);
                    await model.File.CopyToAsync(stream);
                }

                // Create relative URL path for browser access
                var urlPath = $"/{uploadsFolder}/{fileName}";

                // Create document record
                var document = new Document
                {
                    FileName = validationResult.FileName,
                    FilePath = urlPath,
                    FileExtension = validationResult.DetectedExtension?.ToLowerInvariant(),
                    FileSize = fileSizeToStore,
                    MimeType = validationResult.DetectedMimeType,
                    Description = model.Description,
                    EntityType = model.EntityType,
                    UploadedByName = model.UploadedByName,
                    IsPublic = model.IsPublic,
                    Tags = model.Tags,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Documents.Add(document);
                await _context.SaveChangesAsync();

                return MapToDocumentModel(document);
            }

            public async Task<bool> DeleteDocumentAsync(int id)
            {
                var document = await _context.Documents.FindAsync(id);

                if (document == null)
                    return false;

                _context.Documents.Remove(document);
                await _context.SaveChangesAsync();
                return true;
            }

            public async Task<bool> SoftDeleteDocumentAsync(int id)
            {
                var document = await _context.Documents.FindAsync(id);

                if (document == null)
                    return false;

                document.IsDeleted = true;
                document.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return true;
            }

            public async Task<PaginationResponse<DocumentModel>> SearchDocumentsAsync(string searchTerm, int pageNumber = 1, int pageSize = 10)
            {
                // Validate search term
                var (isValid, sanitizedTerm, errorMessage) = SearchInputValidator.ValidateSearchTerm(searchTerm);
                if (!isValid || string.IsNullOrEmpty(sanitizedTerm))
                {
                    throw new ArgumentException(errorMessage ?? "Invalid search term");
                }

                // Validate pagination
                var (paginationValid, paginationError) = SearchInputValidator.ValidatePagination(pageNumber, pageSize);
                if (!paginationValid)
                {
                    throw new ArgumentException(paginationError ?? "Invalid pagination parameters");
                }

                var query = _context.Documents
                    .Where(d => !d.IsDeleted &&
                               (d.FileName.Contains(sanitizedTerm) ||
                                d.Description.Contains(sanitizedTerm) ||
                                (d.Tags != null && d.Tags.Contains(sanitizedTerm))));

                var totalCount = await query.CountAsync();
                var documents = await query
                    .OrderByDescending(d => d.CreatedAt)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var documentModels = documents.Select(MapToDocumentModel).ToList();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                return new PaginationResponse<DocumentModel>
                {
                    Data = documentModels,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = totalPages,
                    HasPreviousPage = pageNumber > 1,
                    HasNextPage = pageNumber < totalPages
                };
            }

            public async Task<IEnumerable<DocumentModel>> GetDocumentsByTagsAsync(string tags)
            {
                // Validate and sanitize tags input
                var (isValid, sanitizedTags, errorMessage) = SearchInputValidator.ValidateFilterField(tags);
                if (!isValid || string.IsNullOrEmpty(sanitizedTags))
                {
                    // Return empty list if validation fails
                    return new List<DocumentModel>();
                }

                var documents = await _context.Documents
                    .Where(d => !d.IsDeleted && d.Tags != null && d.Tags.Contains(sanitizedTags))
                    .OrderByDescending(d => d.CreatedAt)
                    .ToListAsync();

                return documents.Select(MapToDocumentModel);
            }

            public async Task<bool> DocumentExistsAsync(int id)
            {
                return await _context.Documents.AnyAsync(d => d.Id == id && !d.IsDeleted);
            }

            public FileValidationResult ValidateFileUpload(string fileExtension, long fileSize, string fileName)
            {
                // Validate file extension
                if (string.IsNullOrEmpty(fileExtension))
                {
                    return new FileValidationResult
                    {
                        IsValid = false,
                        ErrorMessage = "File extension is required"
                    };
                }

                if (!IsValidExtension(fileExtension))
                {
                    return new FileValidationResult
                    {
                        IsValid = false,
                        ErrorMessage = $"File extension '{fileExtension}' is not allowed. Allowed extensions: {GetAllowedExtensionsString()}"
                    };
                }

                // Validate file size
                if (!IsValidFileSize(fileSize))
                {
                    return new FileValidationResult
                    {
                        IsValid = false,
                        ErrorMessage = $"File size {fileSize} bytes exceeds the maximum allowed size of {MaxFileSizeMB}MB ({MaxFileSizeBytes} bytes)"
                    };
                }

                // Validate filename
                if (string.IsNullOrWhiteSpace(fileName))
                {
                    return new FileValidationResult
                    {
                        IsValid = false,
                        ErrorMessage = "File name is required"
                    };
                }

                return new FileValidationResult { IsValid = true };
            }

            public string GetAllowedFileTypesInfo()
            {
                return $"Allowed file types: {GetAllowedExtensionsString()}\nMaximum file size: {MaxFileSizeMB}MB";
            }



            public async Task<FileUploadValidationResult> ValidateFileUploadAsync(IFormFile file)
            {
                var result = new FileUploadValidationResult();

                // Check if file exists
                if (file == null || file.Length == 0)
                {
                    result.IsValid = false;
                    result.ErrorMessage = "No file was uploaded or file is empty";
                    return result;
                }

                // Get file info
                result.FileName = file.FileName;
                result.FileSize = file.Length;
                result.DetectedMimeType = file.ContentType;
                result.DetectedExtension = Path.GetExtension(file.FileName)?.ToLowerInvariant();

                // Validate file size
                if (!IsValidFileSize(file.Length))
                {
                    result.IsValid = false;
                    result.ErrorMessage = $"File size {file.Length} bytes exceeds the maximum allowed size of {MaxFileSizeMB}MB ({MaxFileSizeBytes} bytes)";
                    return result;
                }

                // Validate file extension
                if (string.IsNullOrEmpty(result.DetectedExtension))
                {
                    result.IsValid = false;
                    result.ErrorMessage = "File must have a valid extension";
                    return result;
                }

                if (!IsValidExtension(result.DetectedExtension))
                {
                    result.IsValid = false;
                    result.ErrorMessage = $"File extension '{result.DetectedExtension}' is not allowed. Allowed extensions: {GetAllowedExtensionsString()}";
                    return result;
                }

                // Validate filename
                if (string.IsNullOrWhiteSpace(file.FileName))
                {
                    result.IsValid = false;
                    result.ErrorMessage = "File must have a valid name";
                    return result;
                }

                // Enforce MIME type validation - reject files with mismatched MIME types
                if (!string.IsNullOrEmpty(result.DetectedMimeType) && AllowedExtensions.ContainsKey(result.DetectedExtension))
                {
                    var allowedFileType = AllowedExtensions[result.DetectedExtension];
                    if (MimeTypes.ContainsKey(allowedFileType))
                    {
                        var expectedMimeTypes = MimeTypes[allowedFileType];
                        if (!expectedMimeTypes.Contains(result.DetectedMimeType, StringComparer.OrdinalIgnoreCase))
                        {
                            // Reject files with mismatched MIME types to prevent file type spoofing
                            result.IsValid = false;
                            result.ErrorMessage = $"MIME type '{result.DetectedMimeType}' does not match expected types for extension '{result.DetectedExtension}'. Expected: {string.Join(", ", expectedMimeTypes)}";
                            return result;
                        }
                    }
                }

                result.IsValid = true;
                return result;
            }

            private static DocumentModel MapToDocumentModel(Document document)
            {
                return new DocumentModel
                {
                    Id = document.Id,
                    FileName = document.FileName,
                    FilePath = document.FilePath,
                    FileExtension = document.FileExtension,
                    FileSize = document.FileSize,
                    MimeType = document.MimeType,
                    Description = document.Description,
                    EntityType = document.EntityType,
                    UploadedByName = document.UploadedByName,
                    CreatedAt = document.CreatedAt,
                    UpdatedAt = document.UpdatedAt,
                    IsDeleted = document.IsDeleted,
                    IsPublic = document.IsPublic,
                    Tags = document.Tags
                };
            }
        }
}
