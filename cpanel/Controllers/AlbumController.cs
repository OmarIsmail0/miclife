using micpanel.ModelDto;
using micpanel.ModelDto.Enums;
using micpanel.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace micpanel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin,marketing")]
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumService _albumService;
        private readonly IDocumentService _documentService;
        private readonly ILogger<AlbumController> _logger;

        public AlbumController(IAlbumService albumService, IDocumentService documentService, ILogger<AlbumController> logger)
        {
            _albumService = albumService;
            _documentService = documentService;
            _logger = logger;
        }

        [HttpGet("getall")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllAlbums([FromQuery] string? languageCode = null)
        {
            try
            {
                var albums = await _albumService.GetAllAlbumsAsync(languageCode);
                return Ok(albums);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving albums");
                return StatusCode(500, new { Message = "An error occurred while retrieving albums. Please try again later." });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAlbumById(int id, [FromQuery] string? languageCode = null)
        {
            try
            {
                var album = await _albumService.GetAlbumByIdAsync(id, languageCode);

                if (album == null)
                    return NotFound(new { Message = "Album not found" });

                return Ok(album);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving album by ID: {AlbumId}", id);
                return StatusCode(500, new { Message = "An error occurred while retrieving the album. Please try again later." });
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAlbum([FromBody] CreateAlbumModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var album = await _albumService.CreateAlbumAsync(model);
                return Ok(new { Message = "Album created successfully", Data = album });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating album");
                return StatusCode(500, new { Message = "An error occurred while creating the album. Please try again later." });
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateAlbum([FromBody] UpdateAlbumModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var album = await _albumService.UpdateAlbumAsync(model);
                return Ok(new { Message = "Album updated successfully", Data = album });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Album not found for update");
                return NotFound(new { Message = "Album not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating album");
                return StatusCode(500, new { Message = "An error occurred while updating the album. Please try again later." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlbum(int id)
        {
            try
            {
                var result = await _albumService.DeleteAlbumAsync(id);

                if (!result)
                    return NotFound(new { Message = "Album not found" });

                return Ok(new { Message = "Album deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting album: {AlbumId}", id);
                return StatusCode(500, new { Message = "An error occurred while deleting the album. Please try again later." });
            }
        }

        [HttpPost("{id}/upload-images")]
        [EnableRateLimiting("UploadPolicy")]
        [RequestSizeLimit(200 * 1024 * 1024)] // 200MB limit
        [RequestFormLimits(MultipartBodyLengthLimit = 200 * 1024 * 1024)]
        public async Task<IActionResult> UploadAlbumImages(int id, [FromForm] List<IFormFile> files)
        {
            try
            {
                if (files == null || !files.Any())
                    return BadRequest(new { Message = "At least one file is required" });

                if (files.Count > 20)
                    return BadRequest(new { Message = "Maximum 20 files allowed per upload" });

                var albumExists = await _albumService.AlbumExistsAsync(id);
                if (!albumExists)
                    return NotFound(new { Message = "Album not found" });

                var results = new List<object>();
                var errors = new List<object>();

                foreach (var file in files)
                {
                    try
                    {
                        var createModel = new CreateDocumentModel
                        {
                            File = file,
                            Description = $"Image for album ID: {id}",
                            EntityType = EntityType.Icon, // Use existing type or add Album type
                            Tags = $"album-{id}", // Store album ID in Tags
                            IsPublic = true
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
                        _logger.LogError(ex, "Error uploading file: {FileName}", file.FileName);
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading album images: {AlbumId}", id);
                return StatusCode(500, new { Message = "An error occurred while uploading images. Please try again later." });
            }
        }
    }
}

