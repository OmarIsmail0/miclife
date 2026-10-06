using micpanel.ModelDto;
using micpanel.ModelDto.Enums;

namespace micpanel.Repository
{
    public interface ITicketManagement
    {
        // Ticket Methods
        Task<PaginationResponse<TicketModel>> GetAllTicketsAsync(TicketFilterModel filter);
        Task<TicketModel?> GetTicketByIdAsync(int id);
        Task<TicketModel> CreateTicketAsync(CreateTicketModel model);
        Task<TicketModel> UpdateTicketAsync(UpdateTicketModel model);
        Task<bool> DeleteTicketAsync(int id);
        Task<bool> UpdateTicketStatusAsync(int id, TicketStatus ticketStatus);

        // Ticket Activity Methods
        Task<IEnumerable<TicketActivityModel>> GetTicketActivitiesAsync(int ticketId);
        Task<TicketActivityModel> CreateTicketActivityAsync(CreateTicketActivityModel model);
        Task<TicketActivityModel> UpdateTicketActivityAsync(UpdateTicketActivityModel model);
        Task<bool> DeleteTicketActivityAsync(int id);
    }
}
