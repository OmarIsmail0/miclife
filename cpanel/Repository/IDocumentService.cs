using micpanel.ModelDto;
using micpanel.ModelDto.Enums;

namespace micpanel.Repository
{
    public interface IDocumentService
    {
        Task<PaginationResponse<DocumentModel>> GetAllDocumentsAsync(DocumentFilterModel filter);
        Task<DocumentModel?> GetDocumentByIdAsync(int id);
        Task<IEnumerable<DocumentModel>> GetDocumentsByEntityAsync(EntityType entityType);
        Task<DocumentModel> CreateDocumentAsync(CreateDocumentModel model);
        Task<FileUploadValidationResult> ValidateFileUploadAsync(IFormFile file);
        Task<bool> DeleteDocumentAsync(int id);
        Task<bool> SoftDeleteDocumentAsync(int id);
        Task<PaginationResponse<DocumentModel>> SearchDocumentsAsync(string searchTerm, int pageNumber = 1, int pageSize = 10);
        Task<IEnumerable<DocumentModel>> GetDocumentsByTagsAsync(string tags);
        Task<bool> DocumentExistsAsync(int id);
        FileValidationResult ValidateFileUpload(string fileExtension, long fileSize, string fileName);
        string GetAllowedFileTypesInfo();
    }
}
