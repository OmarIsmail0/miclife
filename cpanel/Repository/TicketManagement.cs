using micpanel.Context;
using micpanel.Helpers;
using micpanel.ModelDto;
using micpanel.ModelDto.Enums;
using micpanel.Models;
using Microsoft.EntityFrameworkCore;

namespace micpanel.Repository
{
    public class TicketManagement : ITicketManagement
    {
        private readonly CommerceDb _context;

        public TicketManagement(CommerceDb context)
        {
            _context = context;
        }

        #region Ticket Methods

        public async Task<PaginationResponse<TicketModel>> GetAllTicketsAsync(TicketFilterModel filter)
        {
            var query = _context.Tickets.AsQueryable();

            if (filter.TicketType.HasValue)
                query = query.Where(t => t.TicketType == filter.TicketType.Value);

            if (filter.TicketStatus.HasValue)
                query = query.Where(t => t.TicketStatus == filter.TicketStatus.Value);

            if (!string.IsNullOrEmpty(filter.Email))
            {
                // Validate and sanitize email filter input
                var (isValid, sanitizedEmail, _) = SearchInputValidator.ValidateFilterField(filter.Email);
                if (isValid && !string.IsNullOrEmpty(sanitizedEmail))
                {
                    query = query.Where(t => t.Email != null && t.Email.Contains(sanitizedEmail));
                }
                // If validation fails, skip the email filter (don't throw error, just ignore invalid filter)
            }

            var totalCount = await query.CountAsync();
            var tickets = await query
                .Include(t => t.TicketActivities)
                .OrderByDescending(t => t.CreatedAt)
                .ThenBy(t => t.Id)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var ticketModels = tickets.Select(MapToTicketModel).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginationResponse<TicketModel>
            {
                Data = ticketModels,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.PageNumber > 1,
                HasNextPage = filter.PageNumber < totalPages
            };
        }

        public async Task<TicketModel?> GetTicketByIdAsync(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.TicketActivities)
                .FirstOrDefaultAsync(t => t.Id == id);

            return ticket == null ? null : MapToTicketModel(ticket);
        }

        public async Task<TicketModel> CreateTicketAsync(CreateTicketModel model)
        {
            var ticket = new Ticket
            {
                Title = model.Title,
                Description = model.Description,
                Email = model.Email,
                Phone = model.Phone,
                TicketType = model.TicketType,
                TicketStatus = model.TicketStatus,
                CreatedAt = DateTime.UtcNow,
                IsForm = model.IsForm
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return await GetTicketByIdAsync(ticket.Id) ?? throw new InvalidOperationException("Failed to create Ticket");
        }

        public async Task<TicketModel> UpdateTicketAsync(UpdateTicketModel model)
        {
            var ticket = await _context.Tickets.FindAsync(model.Id);
            if (ticket == null)
                throw new ArgumentException("Ticket not found");

            ticket.Title = model.Title;
            ticket.Description = model.Description;
            ticket.Email = model.Email;
            ticket.Phone = model.Phone;
            ticket.TicketType = model.TicketType;
            ticket.TicketStatus = model.TicketStatus;
            ticket.IsForm = model.IsForm;

            await _context.SaveChangesAsync();

            return await GetTicketByIdAsync(ticket.Id) ?? throw new InvalidOperationException("Failed to update Ticket");
        }

        public async Task<bool> DeleteTicketAsync(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return false;

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateTicketStatusAsync(int id, TicketStatus ticketStatus)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return false;

            ticket.TicketStatus = ticketStatus;
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Ticket Activity Methods

        public async Task<IEnumerable<TicketActivityModel>> GetTicketActivitiesAsync(int ticketId)
        {
            var activities = await _context.TicketActivities
                .Where(ta => ta.TicketId == ticketId)
                .OrderByDescending(ta => ta.CreatedAt)
                .ToListAsync();

            return activities.Select(MapToTicketActivityModel);
        }

        public async Task<TicketActivityModel> CreateTicketActivityAsync(CreateTicketActivityModel model)
        {
            var ticket = await _context.Tickets.FindAsync(model.TicketId);
            if (ticket == null)
                throw new ArgumentException("Ticket not found");

            var ticketActivity = new TicketActivity
            {
                TicketId = model.TicketId,
                TicketComment = model.TicketComment,
                CreatedAt = DateTime.UtcNow
            };

            _context.TicketActivities.Add(ticketActivity);
            await _context.SaveChangesAsync();

            return MapToTicketActivityModel(ticketActivity);
        }

        public async Task<TicketActivityModel> UpdateTicketActivityAsync(UpdateTicketActivityModel model)
        {
            var ticketActivity = await _context.TicketActivities.FindAsync(model.Id);
            if (ticketActivity == null)
                throw new ArgumentException("Ticket activity not found");

            ticketActivity.TicketId = model.TicketId;
            ticketActivity.TicketComment = model.TicketComment;

            await _context.SaveChangesAsync();

            return MapToTicketActivityModel(ticketActivity);
        }

        public async Task<bool> DeleteTicketActivityAsync(int id)
        {
            var ticketActivity = await _context.TicketActivities.FindAsync(id);
            if (ticketActivity == null)
                return false;

            _context.TicketActivities.Remove(ticketActivity);
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Mapping Methods

        private static TicketModel MapToTicketModel(Ticket ticket)
        {
            return new TicketModel
            {
                Id = ticket.Id,
                Title = ticket.Title,
                Description = ticket.Description,
                Email = ticket.Email,
                Phone = ticket.Phone,
                TicketType = ticket.TicketType,
                TicketStatus = ticket.TicketStatus,
                CreatedAt = ticket.CreatedAt,
                TicketActivities = ticket.TicketActivities?.Select(MapToTicketActivityModel).ToList(),
                IsForm = ticket.IsForm,
            };
        }

        private static TicketActivityModel MapToTicketActivityModel(TicketActivity ticketActivity)
        {
            return new TicketActivityModel
            {
                Id = ticketActivity.Id,
                TicketId = ticketActivity.TicketId,
                TicketComment = ticketActivity.TicketComment,
                CreatedAt = ticketActivity.CreatedAt
            };
        }

        #endregion
    }
}
