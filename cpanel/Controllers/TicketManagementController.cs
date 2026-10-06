using micpanel.ModelDto;
using micpanel.ModelDto.Enums;
using micpanel.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace micpanel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "admin,marketing")]
    public class TicketManagementController : ControllerBase
    {
        private readonly ITicketManagement _ticketManagement;
        private readonly ILogger<TicketManagementController> _logger;

        public TicketManagementController(ITicketManagement ticketManagement, ILogger<TicketManagementController> logger)
        {
            _ticketManagement = ticketManagement;
            _logger = logger;
        }

        #region Ticket Endpoints

        [HttpPost("ticket/getall")]
        public async Task<IActionResult> GetAllTickets([FromBody] TicketFilterModel? filter = null)
        {
            try
            {
                filter ??= new TicketFilterModel();

                if (filter.PageNumber < 1 || filter.PageSize < 1)
                    return BadRequest(new { Message = "Page number and page size must be greater than 0" });

                var tickets = await _ticketManagement.GetAllTicketsAsync(filter);
                return Ok(tickets);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tickets");
                return StatusCode(500, new { Message = "An error occurred while retrieving tickets. Please try again later." });
            }
        }

        [HttpGet("ticket/{id}")]
        public async Task<IActionResult> GetTicketById(int id)
        {
            try
            {
                var ticket = await _ticketManagement.GetTicketByIdAsync(id);

                if (ticket == null)
                    return NotFound(new { Message = "Ticket not found" });

                return Ok(ticket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving ticket by ID: {TicketId}", id);
                return StatusCode(500, new { Message = "An error occurred while retrieving the ticket. Please try again later." });
            }
        }

        [HttpPost("ticket/create")]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var ticket = await _ticketManagement.CreateTicketAsync(model);
                return Ok(new { Message = "Ticket created successfully", Data = ticket });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating ticket");
                return StatusCode(500, new { Message = "An error occurred while creating the ticket. Please try again later." });
            }
        }

        [HttpPut("ticket/update")]
        [Authorize(Roles = "admin,marketing")]
        public async Task<IActionResult> UpdateTicket([FromBody] UpdateTicketModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var ticket = await _ticketManagement.UpdateTicketAsync(model);
                return Ok(new { Message = "Ticket updated successfully", Data = ticket });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Ticket not found for update");
                return NotFound(new { Message = "Ticket not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating ticket");
                return StatusCode(500, new { Message = "An error occurred while updating the ticket. Please try again later." });
            }
        }

        [HttpDelete("ticket/{id}")]
        [Authorize(Roles = "admin,marketing")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            try
            {
                var result = await _ticketManagement.DeleteTicketAsync(id);

                if (!result)
                    return NotFound(new { Message = "Ticket not found" });

                return Ok(new { Message = "Ticket deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting ticket: {TicketId}", id);
                return StatusCode(500, new { Message = "An error occurred while deleting the ticket. Please try again later." });
            }
        }

        [HttpPut("ticket/{id}/status")]
        [Authorize(Roles = "admin,marketing")]
        public async Task<IActionResult> UpdateTicketStatus(int id, [FromBody] TicketStatus ticketStatus)
        {
            try
            {
                var result = await _ticketManagement.UpdateTicketStatusAsync(id, ticketStatus);

                if (!result)
                    return NotFound(new { Message = "Ticket not found" });

                return Ok(new { Message = $"Ticket status updated to {ticketStatus}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating ticket status: {TicketId}", id);
                return StatusCode(500, new { Message = "An error occurred while updating the ticket status. Please try again later." });
            }
        }

        #endregion

        #region Ticket Activity Endpoints
        [Authorize(Roles = "admin,marketing")]
        [HttpGet("ticket/{ticketId}/activities")]
        public async Task<IActionResult> GetTicketActivities(int ticketId)
        {
            try
            {
                var activities = await _ticketManagement.GetTicketActivitiesAsync(ticketId);
                return Ok(activities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving ticket activities: {TicketId}", ticketId);
                return StatusCode(500, new { Message = "An error occurred while retrieving ticket activities. Please try again later." });
            }
        }
        [Authorize(Roles = "admin,marketing")]
        [HttpPost("ticket-activity/create")]
        public async Task<IActionResult> CreateTicketActivity([FromBody] CreateTicketActivityModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var activity = await _ticketManagement.CreateTicketActivityAsync(model);
                return Ok(new { Message = "Ticket activity created successfully", Data = activity });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Ticket not found for activity creation");
                return NotFound(new { Message = "Ticket not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating ticket activity");
                return StatusCode(500, new { Message = "An error occurred while creating the ticket activity. Please try again later." });
            }
        }

        [HttpPut("ticket-activity/update")]
        [Authorize(Roles = "admin,marketing")]
        public async Task<IActionResult> UpdateTicketActivity([FromBody] UpdateTicketActivityModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var activity = await _ticketManagement.UpdateTicketActivityAsync(model);
                return Ok(new { Message = "Ticket activity updated successfully", Data = activity });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Ticket activity not found for update");
                return NotFound(new { Message = "Ticket activity not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating ticket activity");
                return StatusCode(500, new { Message = "An error occurred while updating the ticket activity. Please try again later." });
            }
        }

        [HttpDelete("ticket-activity/{id}")]
        [Authorize(Roles = "admin,marketing")]
        public async Task<IActionResult> DeleteTicketActivity(int id)
        {
            try
            {
                var result = await _ticketManagement.DeleteTicketActivityAsync(id);

                if (!result)
                    return NotFound(new { Message = "Ticket activity not found" });

                return Ok(new { Message = "Ticket activity deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting ticket activity: {ActivityId}", id);
                return StatusCode(500, new { Message = "An error occurred while deleting the ticket activity. Please try again later." });
            }
        }

        #endregion
    }
}
