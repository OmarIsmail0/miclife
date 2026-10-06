using micpanel.ModelDto;
using micpanel.ModelDto.Enums;
using micpanel.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.ComponentModel.DataAnnotations;
using static micpanel.ModelDto.Enums.FileUploadConstants;


namespace micpanel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin,marketing")]
    public class DocumentController : ControllerBase
    {
        private readonly IDocumentService _documentService;
        private readonly ILogger<DocumentController> _logger;

        public DocumentController(IDocumentService documentService, ILogger<DocumentController> logger)
        {
            _documentService = documentService;
            _logger = logger;
        }

        [HttpPost("getall")]
        public async Task<IActionResult> GetAllDocuments([FromBody] DocumentFilterModel? filter = null)
        {
            try
            {
                filter ??= new DocumentFilterModel();

                if (filter.PageNumber < 1 || filter.PageSize < 1)
                    return BadRequest(new { Message = "Page number and page size must be greater than 0" });

                var documents = await _documentService.GetAllDocumentsAsync(filter);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving documents");
                return StatusCode(500, new { Message = "An error occurred while retrieving documents. Please try again later." });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDocumentById(int id)
        {
            try
            {
                var document = await _documentService.GetDocumentByIdAsync(id);

                if (document == null)
                    return NotFound(new { Message = "Document not found" });

                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving document by ID: {DocumentId}", id);
                return StatusCode(500, new { Message = "An error occurred while retrieving the document. Please try again later." });
            }
        }

        [HttpPost("entity")]
        public async Task<IActionResult> GetDocumentsByEntity([FromBody] GetDocumentsByEntityModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var documents = await _documentService.GetDocumentsByEntityAsync(model.EntityType);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving documents by entity type");
                return StatusCode(500, new { Message = "An error occurred while retrieving documents. Please try again later." });
            }
        }

        [HttpPost]
        [EnableRateLimiting("UploadPolicy")]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10MB limit
        [RequestFormLimits(MultipartBodyLengthLimit = 10 * 1024 * 1024)]
        public async Task<IActionResult> CreateDocument([FromForm] CreateDocumentModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var document = await _documentService.CreateDocumentAsync(model);
                return CreatedAtAction(nameof(GetDocumentById), new { id = document.Id }, document);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = "Invalid file or request parameters." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while uploading the file. Please try again later." });
            }
        }

        [HttpPost("upload-multiple")]
        [EnableRateLimiting("UploadPolicy")]
        [RequestSizeLimit(200 * 1024 * 1024)] // 200MB total limit (20 files * 10MB each)
        [RequestFormLimits(MultipartBodyLengthLimit = 200 * 1024 * 1024)]
        public async Task<IActionResult> UploadMultipleDocuments([FromForm] CreateMultipleDocumentsModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (model.Files == null || !model.Files.Any())
                return BadRequest(new { Message = "At least one file is required" });

            if (model.Files.Count > 20)
                return BadRequest(new { Message = "Maximum 20 files allowed per upload" });

            var results = new List<object>();
            var errors = new List<object>();

            foreach (var file in model.Files)
            {
                try
                {
                    var createModel = new CreateDocumentModel
                    {
                        File = file,
                        Description = model.Description,
                        EntityType = model.EntityType,
                        UploadedByName = model.UploadedByName,
                        IsPublic = model.IsPublic,
                        Tags = model.Tags
                    };

                    var document = await _documentService.CreateDocumentAsync(createModel);
                    results.Add(new
                    {
                        FileName = file.FileName,
                        Success = true,
                        Document = document
                    });
                }
                catch (ArgumentException ex)
                {
                    errors.Add(new
                    {
                        FileName = file.FileName,
                        Success = false,
                        Error = "Invalid file or request parameters."
                    });
                }
                catch (Exception ex)
                {
                    errors.Add(new
                    {
                        FileName = file.FileName,
                        Success = false,
                        Error = "An error occurred while uploading the file. Please try again later."
                    });
                }
            }

            return Ok(new
            {
                SuccessCount = results.Count,
                ErrorCount = errors.Count,
                SuccessfulUploads = results,
                FailedUploads = errors
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            try
            {
                var result = await _documentService.DeleteDocumentAsync(id);

                if (!result)
                    return NotFound(new { Message = "Document not found" });

                return Ok(new { Message = "Document deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting document: {DocumentId}", id);
                return StatusCode(500, new { Message = "An error occurred while deleting the document. Please try again later." });
            }
        }

        [HttpPost("{id}/softdelete")]
        public async Task<IActionResult> SoftDeleteDocument(int id)
        {
            try
            {
                var result = await _documentService.SoftDeleteDocumentAsync(id);

                if (!result)
                    return NotFound(new { Message = "Document not found" });

                return Ok(new { Message = "Document soft deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error soft deleting document: {DocumentId}", id);
                return StatusCode(500, new { Message = "An error occurred while soft deleting the document. Please try again later." });
            }
        }

        [HttpPost("search")]
        public async Task<IActionResult> SearchDocuments([FromBody] SearchDocumentModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Validate search term using helper
                var (isValid, sanitizedTerm, errorMessage) = Helpers.SearchInputValidator.ValidateSearchTerm(model.SearchTerm);
                if (!isValid)
                {
                    return BadRequest(new { Message = errorMessage ?? "Invalid search term" });
                }

                // Validate pagination
                var (paginationValid, paginationError) = Helpers.SearchInputValidator.ValidatePagination(model.PageNumber, model.PageSize);
                if (!paginationValid)
                {
                    return BadRequest(new { Message = paginationError ?? "Invalid pagination parameters" });
                }

                var documents = await _documentService.SearchDocumentsAsync(sanitizedTerm!, model.PageNumber, model.PageSize);
                return Ok(documents);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid search parameters");
                return BadRequest(new { Message = "Invalid search parameters provided." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching documents");
                return StatusCode(500, new { Message = "An error occurred while searching documents. Please try again later." });
            }
        }

        [HttpGet("tags/{tags}")]
        public async Task<IActionResult> GetDocumentsByTags(string tags)
        {
            try
            {
                // Validate tags input
                var (isValid, sanitizedTags, errorMessage) = Helpers.SearchInputValidator.ValidateFilterField(tags);
                if (!isValid || string.IsNullOrEmpty(sanitizedTags))
                {
                    return BadRequest(new { Message = errorMessage ?? "Invalid tags parameter" });
                }

                var documents = await _documentService.GetDocumentsByTagsAsync(sanitizedTags);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving documents. Please try again later." });
            }
        }

        [HttpGet("exists/{id}")]
        public async Task<IActionResult> DocumentExists(int id)
        {
            try
            {
                var exists = await _documentService.DocumentExistsAsync(id);
                return Ok(new { Exists = exists });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking document existence: {DocumentId}", id);
                return StatusCode(500, new { Message = "An error occurred while checking document existence. Please try again later." });
            }
        }

        [HttpGet("upload-info")]
        public IActionResult GetUploadInfo()
        {
            try
            {
                var info = _documentService.GetAllowedFileTypesInfo();
                return Ok(new
                {
                    Message = info,
                    AllowedExtensions = GetAllowedExtensionsString(),
                    MaxFileSizeMB = MaxFileSizeMB,
                    MaxFileSizeBytes = MaxFileSizeBytes
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving upload info");
                return StatusCode(500, new { Message = "An error occurred while retrieving upload information. Please try again later." });
            }
        }

        [HttpPost("validate")]
        public IActionResult ValidateFile([FromBody] ValidateFileModel model)
        {
            try
            {
                var result = _documentService.ValidateFileUpload(model.FileExtension, model.FileSize, model.FileName);

                if (result.IsValid)
                {
                    return Ok(new { IsValid = true, Message = "File is valid for upload" });
                }
                else
                {
                    return BadRequest(new { IsValid = false, Message = result.ErrorMessage });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating file");
                return StatusCode(500, new { Message = "An error occurred while validating the file. Please try again later." });
            }
        }

        [HttpPost("validate-file")]
        public async Task<IActionResult> ValidateFileUpload([FromForm] IFormFile file)
        {
            try
            {
                var result = await _documentService.ValidateFileUploadAsync(file);

                if (result.IsValid)
                {
                    return Ok(new
                    {
                        IsValid = true,
                        Message = "File is valid for upload",
                        FileName = result.FileName,
                        FileSize = result.FileSize,
                        FileExtension = result.DetectedExtension,
                        MimeType = result.DetectedMimeType
                    });
                }
                else
                {
                    return BadRequest(new { IsValid = false, Message = result.ErrorMessage });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating file upload");
                return StatusCode(500, new { Message = "An error occurred while validating the file. Please try again later." });
            }
        }

        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadDocument(int id)
        {
            try
            {
                var document = await _documentService.GetDocumentByIdAsync(id);

                if (document == null)
                    return NotFound(new { Message = "Document not found" });

                // Security: Validate and sanitize file path to prevent path traversal attacks
                var uploadsFolder = "uploads/documents";
                var basePath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), uploadsFolder));
                
                // Extract filename from stored path (should be in format /uploads/documents/{filename})
                var fileName = Path.GetFileName(document.FilePath);
                if (string.IsNullOrEmpty(fileName))
                {
                    // Fallback: try to extract from full path
                    fileName = Path.GetFileName(document.FilePath.Replace('/', Path.DirectorySeparatorChar));
                }
                
                // Construct safe file path
                var safeFilePath = Path.Combine(basePath, fileName);
                var fullPath = Path.GetFullPath(safeFilePath);
                
                // Validate that the resolved path is within the base directory (prevents path traversal)
                if (!fullPath.StartsWith(basePath, StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest(new { Message = "Invalid file path" });
                }

                if (!System.IO.File.Exists(fullPath))
                    return NotFound(new { Message = "Physical file not found" });

                var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
                var mimeType = document.MimeType ?? "application/octet-stream";

                // Sanitize filename for download to prevent path injection in Content-Disposition header
                var safeFileName = Path.GetFileName(document.FileName);
                if (string.IsNullOrEmpty(safeFileName))
                {
                    safeFileName = fileName;
                }

                return File(fileBytes, mimeType, safeFileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while downloading the file. Please try again later." });
            }
        }
    }

    // Additional DTOs for document functionality
    public class SearchDocumentModel
    {
        [Required(ErrorMessage = "Search term is required")]
        [StringLength(200, ErrorMessage = "Search term cannot exceed 200 characters")]
        public string SearchTerm { get; set; } = string.Empty;
        
        [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0")]
        public int PageNumber { get; set; } = 1;
        
        [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100")]
        public int PageSize { get; set; } = 10;
    }

    public class ValidateFileModel
    {
        [Required]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string FileExtension { get; set; } = string.Empty;

        [Required]
        public long FileSize { get; set; }
    }

    public class GetDocumentsByEntityModel
    {
        [Required]
        public EntityType EntityType { get; set; }
    }

    public class CreateMultipleDocumentsModel
    {
        [Required(ErrorMessage = "At least one file is required")]
        public List<IFormFile> Files { get; set; } = new();

        public string? Description { get; set; }

        [Required]
        public EntityType EntityType { get; set; }

        public string? UploadedByName { get; set; }

        public bool IsPublic { get; set; } = false;

        public string? Tags { get; set; }
    }
}
