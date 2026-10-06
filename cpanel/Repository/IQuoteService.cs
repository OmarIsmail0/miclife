using micpanel.ModelDto;

namespace micpanel.Repository
{
    public interface IQuoteService
    {
        // QuoteTemplate Methods
        Task<PaginationResponse<QuoteTemplateModel>> GetAllQuoteTemplatesAsync(QuoteTemplateFilterModel filter);
        Task<QuoteTemplateModel?> GetQuoteTemplateByIdAsync(int id);
        Task<QuoteTemplateModel?> GetQuoteTemplateByRandomIdAsync(string randomId, string? language = null);
        Task<QuoteTemplateModel> CreateQuoteTemplateAsync(CreateQuoteTemplateModel model);
        Task<QuoteTemplateModel> UpdateQuoteTemplateAsync(UpdateQuoteTemplateModel model);
        Task<bool> DeleteQuoteTemplateAsync(int id);
        Task<bool> ToggleQuoteTemplateStatusAsync(int id, bool isActive);

        // FormTemplate Methods
        Task<PaginationResponse<FormTemplateModel>> GetAllFormTemplatesAsync(FormTemplateFilterModel filter);
        Task<FormTemplateModel?> GetFormTemplateByIdAsync(int id);
        Task<FormTemplateModel> CreateFormTemplateAsync(CreateFormTemplateModel model);
        Task<FormTemplateModel> UpdateFormTemplateAsync(UpdateFormTemplateModel model);
        Task<bool> DeleteFormTemplateAsync(int id);
    }
}

