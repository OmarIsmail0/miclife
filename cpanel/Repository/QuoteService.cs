using micpanel.Context;
using micpanel.Helpers;
using micpanel.ModelDto;
using micpanel.Models;
using Microsoft.EntityFrameworkCore;

namespace micpanel.Repository
{
    public class QuoteService : IQuoteService
    {
        private readonly CommerceDb _context;

        public QuoteService(CommerceDb context)
        {
            _context = context;
        }

        #region QuoteTemplate Methods

        public async Task<PaginationResponse<QuoteTemplateModel>> GetAllQuoteTemplatesAsync(QuoteTemplateFilterModel filter)
        {
            var query = _context.QuoteTemplates
                .Include(q => q.FormTemplate)
                .AsQueryable();

            if (!string.IsNullOrEmpty(filter.Type))
            {
                var (isValid, sanitizedType, _) = SearchInputValidator.ValidateFilterField(filter.Type);
                if (isValid && !string.IsNullOrEmpty(sanitizedType))
                {
                    query = query.Where(q => q.Type == sanitizedType);
                }
            }

            if (filter.Replied.HasValue)
                query = query.Where(q => q.Replied == filter.Replied.Value);

            if (filter.isActive.HasValue)
                query = query.Where(q => q.isActive == filter.isActive.Value);

            var totalCount = await query.CountAsync();
            var quoteTemplates = await query
                .OrderByDescending(q => q.CreatedAt)
                .ThenBy(q => q.Id)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var quoteTemplateModels = quoteTemplates.Select(MapToQuoteTemplateModel).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginationResponse<QuoteTemplateModel>
            {
                Data = quoteTemplateModels,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.PageNumber > 1,
                HasNextPage = filter.PageNumber < totalPages
            };
        }

        public async Task<QuoteTemplateModel?> GetQuoteTemplateByIdAsync(int id)
        {
            var quoteTemplate = await _context.QuoteTemplates
                .Include(q => q.FormTemplate)
                .FirstOrDefaultAsync(q => q.Id == id);

            return quoteTemplate == null ? null : MapToQuoteTemplateModel(quoteTemplate);
        }

        public async Task<QuoteTemplateModel?> GetQuoteTemplateByRandomIdAsync(string randomId, string? language = null)
        {
            var (isValid, sanitizedRandomId, _) = SearchInputValidator.ValidateFilterField(randomId);
            if (!isValid || string.IsNullOrEmpty(sanitizedRandomId))
                return null;

            var query = _context.QuoteTemplates
                .Include(q => q.FormTemplate)
                .Where(q => q.RandomId == sanitizedRandomId);

            if (!string.IsNullOrEmpty(language))
            {
                var (langValid, sanitizedLanguage, _) = SearchInputValidator.ValidateFilterField(language);
                if (langValid && !string.IsNullOrEmpty(sanitizedLanguage))
                {
                    query = query.Where(q => q.FormTemplate != null && q.FormTemplate.Language == sanitizedLanguage);
                }
            }

            var quoteTemplate = await query.FirstOrDefaultAsync();

            return quoteTemplate == null ? null : MapToQuoteTemplateModel(quoteTemplate);
        }

        public async Task<QuoteTemplateModel> CreateQuoteTemplateAsync(CreateQuoteTemplateModel model)
        {
            // Validate that FormTemplate exists
            var formTemplateExists = await _context.FormTemplates.AnyAsync(ft => ft.Id == model.FormTemplateId);
            if (!formTemplateExists)
                throw new ArgumentException("FormTemplate not found");

            var quoteTemplate = new QuoteTemplate
            {
                RandomId = Guid.NewGuid().ToString("N")[..16], // Generate 16-character random ID
                Name = model.Name,
                FormTemplateId = model.FormTemplateId,
                Type = model.Type,
                ReplyJson = model.ReplyJson,
                Contact = model.Contact,
                Replied = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Expiration = model.Expiration,
                isActive = model.isActive
            };

            _context.QuoteTemplates.Add(quoteTemplate);
            await _context.SaveChangesAsync();

            return await GetQuoteTemplateByIdAsync(quoteTemplate.Id) ?? throw new InvalidOperationException("Failed to create QuoteTemplate");
        }

        public async Task<QuoteTemplateModel> UpdateQuoteTemplateAsync(UpdateQuoteTemplateModel model)
        {
            var quoteTemplate = await _context.QuoteTemplates.FindAsync(model.Id);
            if (quoteTemplate == null)
                throw new ArgumentException("QuoteTemplate not found");

            // Validate that FormTemplate exists
            var formTemplateExists = await _context.FormTemplates.AnyAsync(ft => ft.Id == model.FormTemplateId);
            if (!formTemplateExists)
                throw new ArgumentException("FormTemplate not found");

            quoteTemplate.Name = model.Name;
            quoteTemplate.FormTemplateId = model.FormTemplateId;
            quoteTemplate.Type = model.Type;
            quoteTemplate.ReplyJson = model.ReplyJson;
            quoteTemplate.Contact = model.Contact;
            quoteTemplate.Replied = model.Replied;
            quoteTemplate.UpdatedAt = DateTime.UtcNow;
            quoteTemplate.Expiration = model.Expiration;
            quoteTemplate.isActive = model.isActive;

            await _context.SaveChangesAsync();

            return await GetQuoteTemplateByIdAsync(quoteTemplate.Id) ?? throw new InvalidOperationException("Failed to update QuoteTemplate");
        }

        public async Task<bool> DeleteQuoteTemplateAsync(int id)
        {
            var quoteTemplate = await _context.QuoteTemplates.FindAsync(id);
            if (quoteTemplate == null)
                return false;

            _context.QuoteTemplates.Remove(quoteTemplate);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleQuoteTemplateStatusAsync(int id, bool isActive)
        {
            var quoteTemplate = await _context.QuoteTemplates.FindAsync(id);
            if (quoteTemplate == null)
                return false;

            quoteTemplate.isActive = isActive;
            quoteTemplate.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region FormTemplate Methods

        public async Task<PaginationResponse<FormTemplateModel>> GetAllFormTemplatesAsync(FormTemplateFilterModel filter)
        {
            var query = _context.FormTemplates.AsQueryable();

            if (!string.IsNullOrEmpty(filter.Language))
            {
                var (isValid, sanitizedLanguage, _) = SearchInputValidator.ValidateFilterField(filter.Language);
                if (isValid && !string.IsNullOrEmpty(sanitizedLanguage))
                {
                    query = query.Where(f => f.Language == sanitizedLanguage);
                }
            }

            var totalCount = await query.CountAsync();
            var formTemplates = await query
                .OrderByDescending(f => f.Id)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var formTemplateModels = formTemplates.Select(MapToFormTemplateModel).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginationResponse<FormTemplateModel>
            {
                Data = formTemplateModels,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.PageNumber > 1,
                HasNextPage = filter.PageNumber < totalPages
            };
        }

        public async Task<FormTemplateModel?> GetFormTemplateByIdAsync(int id)
        {
            var formTemplate = await _context.FormTemplates
                .FirstOrDefaultAsync(f => f.Id == id);

            return formTemplate == null ? null : MapToFormTemplateModel(formTemplate);
        }

        public async Task<FormTemplateModel> CreateFormTemplateAsync(CreateFormTemplateModel model)
        {
            var formTemplate = new FormTemplate
            {
                Name = model.Name,
                Design = model.Design,
                Language = model.Language
            };

            _context.FormTemplates.Add(formTemplate);
            await _context.SaveChangesAsync();

            return await GetFormTemplateByIdAsync(formTemplate.Id) ?? throw new InvalidOperationException("Failed to create FormTemplate");
        }

        public async Task<FormTemplateModel> UpdateFormTemplateAsync(UpdateFormTemplateModel model)
        {
            var formTemplate = await _context.FormTemplates.FindAsync(model.Id);
            if (formTemplate == null)
                throw new ArgumentException("FormTemplate not found");

            formTemplate.Name = model.Name;
            formTemplate.Design = model.Design;
            formTemplate.Language = model.Language;

            await _context.SaveChangesAsync();

            return await GetFormTemplateByIdAsync(formTemplate.Id) ?? throw new InvalidOperationException("Failed to update FormTemplate");
        }

        public async Task<bool> DeleteFormTemplateAsync(int id)
        {
            var formTemplate = await _context.FormTemplates.FindAsync(id);
            if (formTemplate == null)
                return false;

            _context.FormTemplates.Remove(formTemplate);
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Mapping Methods

        private static QuoteTemplateModel MapToQuoteTemplateModel(QuoteTemplate quoteTemplate)
        {
            return new QuoteTemplateModel
            {
                Id = quoteTemplate.Id,
                RandomId = quoteTemplate.RandomId,
                Name = quoteTemplate.Name,
                FormTemplateId = quoteTemplate.FormTemplateId,
                FormTemplate = quoteTemplate.FormTemplate != null ? MapToFormTemplateModel(quoteTemplate.FormTemplate) : null,
                Type = quoteTemplate.Type,
                ReplyJson = quoteTemplate.ReplyJson,
                Contact = quoteTemplate.Contact,
                Replied = quoteTemplate.Replied,
                CreatedAt = quoteTemplate.CreatedAt,
                UpdatedAt = quoteTemplate.UpdatedAt,
                Expiration = quoteTemplate.Expiration,
                isActive = quoteTemplate.isActive
            };
        }

        private static FormTemplateModel MapToFormTemplateModel(FormTemplate formTemplate)
        {
            return new FormTemplateModel
            {
                Id = formTemplate.Id,
                Name = formTemplate.Name ?? string.Empty,
                Design = formTemplate.Design ?? string.Empty,
                Language = formTemplate.Language
            };
        }

        #endregion
    }
}

