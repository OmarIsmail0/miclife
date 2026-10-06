using micpanel.ModelDto;
using micpanel.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace micpanel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin,marketing")]
    public class QuoteController : ControllerBase
    {
        private readonly IQuoteService _quoteService;
        private readonly ILogger<QuoteController> _logger;

        public QuoteController(IQuoteService quoteService, ILogger<QuoteController> logger)
        {
            _quoteService = quoteService;
            _logger = logger;
        }

        #region QuoteTemplate Endpoints

        [HttpPost("quote-template/getall")]
        public async Task<IActionResult> GetAllQuoteTemplates([FromBody] QuoteTemplateFilterModel? filter = null)
        {
            try
            {
                filter ??= new QuoteTemplateFilterModel();

                if (filter.PageNumber < 1 || filter.PageSize < 1)
                    return BadRequest(new { Message = "Page number and page size must be greater than 0" });

                var quoteTemplates = await _quoteService.GetAllQuoteTemplatesAsync(filter);
                return Ok(quoteTemplates);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving quote templates");
                return StatusCode(500, new { Message = "An error occurred while retrieving quote templates. Please try again later." });
            }
        }

        [HttpGet("quote-template/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetQuoteTemplateById(int id)
        {
            try
            {
                var quoteTemplate = await _quoteService.GetQuoteTemplateByIdAsync(id);

                if (quoteTemplate == null)
                    return NotFound(new { Message = "QuoteTemplate not found" });

                return Ok(quoteTemplate);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving quote template by ID: {QuoteTemplateId}", id);
                return StatusCode(500, new { Message = "An error occurred while retrieving the quote template. Please try again later." });
            }
        }

        [HttpGet("quote-template/random/{randomId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetQuoteTemplateByRandomId(string randomId, [FromQuery] string? language = null)
        {
            try
            {
                var quoteTemplate = await _quoteService.GetQuoteTemplateByRandomIdAsync(randomId, language);

                if (quoteTemplate == null)
                    return NotFound(new { Message = "QuoteTemplate not found" });

                return Ok(quoteTemplate);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving quote template by RandomId: {RandomId}, Language: {Language}", randomId, language);
                return StatusCode(500, new { Message = "An error occurred while retrieving the quote template. Please try again later." });
            }
        }

        [HttpPost("quote-template/create")]
        public async Task<IActionResult> CreateQuoteTemplate([FromBody] CreateQuoteTemplateModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var quoteTemplate = await _quoteService.CreateQuoteTemplateAsync(model);
                return Ok(new { Message = "QuoteTemplate created successfully", Data = quoteTemplate });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating quote template");
                return StatusCode(500, new { Message = "An error occurred while creating the quote template. Please try again later." });
            }
        }

        [HttpPut("quote-template/update")]
        public async Task<IActionResult> UpdateQuoteTemplate([FromBody] UpdateQuoteTemplateModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var quoteTemplate = await _quoteService.UpdateQuoteTemplateAsync(model);
                return Ok(new { Message = "QuoteTemplate updated successfully", Data = quoteTemplate });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "QuoteTemplate not found for update");
                return NotFound(new { Message = "QuoteTemplate not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating quote template");
                return StatusCode(500, new { Message = "An error occurred while updating the quote template. Please try again later." });
            }
        }

        [HttpDelete("quote-template/{id}")]
        public async Task<IActionResult> DeleteQuoteTemplate(int id)
        {
            try
            {
                var result = await _quoteService.DeleteQuoteTemplateAsync(id);

                if (!result)
                    return NotFound(new { Message = "QuoteTemplate not found" });

                return Ok(new { Message = "QuoteTemplate deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting quote template: {QuoteTemplateId}", id);
                return StatusCode(500, new { Message = "An error occurred while deleting the quote template. Please try again later." });
            }
        }

        [HttpPut("quote-template/{id}/toggle-status")]
        public async Task<IActionResult> ToggleQuoteTemplateStatus(int id, [FromBody] bool isActive)
        {
            try
            {
                var result = await _quoteService.ToggleQuoteTemplateStatusAsync(id, isActive);

                if (!result)
                    return NotFound(new { Message = "QuoteTemplate not found" });

                return Ok(new { Message = $"QuoteTemplate status updated to {(isActive ? "Active" : "Inactive")}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating quote template status: {QuoteTemplateId}", id);
                return StatusCode(500, new { Message = "An error occurred while updating the quote template status. Please try again later." });
            }
        }

        #endregion

        #region FormTemplate Endpoints

        [HttpPost("form-template/getall")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllFormTemplates([FromBody] FormTemplateFilterModel? filter = null)
        {
            try
            {
                filter ??= new FormTemplateFilterModel();

                if (filter.PageNumber < 1 || filter.PageSize < 1)
                    return BadRequest(new { Message = "Page number and page size must be greater than 0" });

                var formTemplates = await _quoteService.GetAllFormTemplatesAsync(filter);
                return Ok(formTemplates);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving form templates");
                return StatusCode(500, new { Message = "An error occurred while retrieving form templates. Please try again later." });
            }
        }

        [HttpGet("form-template/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFormTemplateById(int id)
        {
            try
            {
                var formTemplate = await _quoteService.GetFormTemplateByIdAsync(id);

                if (formTemplate == null)
                    return NotFound(new { Message = "FormTemplate not found" });

                return Ok(formTemplate);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving form template by ID: {FormTemplateId}", id);
                return StatusCode(500, new { Message = "An error occurred while retrieving the form template. Please try again later." });
            }
        }

        [HttpPost("form-template/create")]
        public async Task<IActionResult> CreateFormTemplate([FromBody] CreateFormTemplateModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var formTemplate = await _quoteService.CreateFormTemplateAsync(model);
                return Ok(new { Message = "FormTemplate created successfully", Data = formTemplate });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating form template");
                return StatusCode(500, new { Message = "An error occurred while creating the form template. Please try again later." });
            }
        }

        [HttpPut("form-template/update")]
        public async Task<IActionResult> UpdateFormTemplate([FromBody] UpdateFormTemplateModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var formTemplate = await _quoteService.UpdateFormTemplateAsync(model);
                return Ok(new { Message = "FormTemplate updated successfully", Data = formTemplate });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "FormTemplate not found for update");
                return NotFound(new { Message = "FormTemplate not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating form template");
                return StatusCode(500, new { Message = "An error occurred while updating the form template. Please try again later." });
            }
        }

        [HttpDelete("form-template/{id}")]
        public async Task<IActionResult> DeleteFormTemplate(int id)
        {
            try
            {
                var result = await _quoteService.DeleteFormTemplateAsync(id);

                if (!result)
                    return NotFound(new { Message = "FormTemplate not found" });

                return Ok(new { Message = "FormTemplate deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting form template: {FormTemplateId}", id);
                return StatusCode(500, new { Message = "An error occurred while deleting the form template. Please try again later." });
            }
        }

        #endregion
    }
}

