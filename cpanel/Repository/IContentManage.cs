using micpanel.ModelDto;

namespace micpanel.Repository
{
    public interface IContentManage
    {
        // LOB Methods
        Task<PaginationResponse<LOBModel>> GetAllLOBsAsync(LOBFilterModel filter);
        Task<LOBModel?> GetLOBByIdAsync(int id);
        Task<LOBModel?> GetLOBBySlugAsync(string slug);
        Task<LOBModel> CreateLOBAsync(CreateLOBModel model);
        Task<LOBModel> UpdateLOBAsync(UpdateLOBModel model);
        Task<bool> DeleteLOBAsync(int id);
        Task<bool> ToggleLOBStatusAsync(int id, bool isActive);

        // Product Methods
        Task<PaginationResponse<ProductModel>> GetAllProductsAsync(ProductFilterModel filter);
        Task<ProductModel?> GetProductByIdAsync(int id);
        Task<ProductModel?> GetProductBySlugAsync(string slug);
        Task<IEnumerable<ProductModel>> GetProductsByLOBAsync(int lobId);
        Task<ProductModel> CreateProductAsync(CreateProductModel model);
        Task<ProductModel> UpdateProductAsync(UpdateProductModel model);
        Task<bool> DeleteProductAsync(int id);
        Task<bool> ToggleProductStatusAsync(int id, bool isActive);

        // Section Methods
        Task<PaginationResponse<SectionModel>> GetAllSectionsAsync(SectionFilterModel filter);
        Task<SectionModel?> GetSectionByIdAsync(int id);
        Task<SectionModel?> GetSectionByKeyAsync(string sectionKey);
        Task<SectionModel?> GetSectionBySlugAsync(string slug);
        Task<SectionModel> CreateSectionAsync(CreateSectionModel model);
        Task<SectionModel> UpdateSectionAsync(UpdateSectionModel model);
        Task<bool> DeleteSectionAsync(int id);
        Task<bool> ToggleSectionStatusAsync(int id, bool isActive);

        // Question Methods
        Task<PaginationResponse<QuestionModel>> GetAllQuestionsAsync(QuestionFilterModel filter);
        Task<QuestionModel?> GetQuestionByIdAsync(int id);
        Task<QuestionModel> CreateQuestionAsync(CreateQuestionModel model);
        Task<QuestionModel> UpdateQuestionAsync(UpdateQuestionModel model);
        Task<bool> DeleteQuestionAsync(int id);
        Task<bool> ToggleQuestionStatusAsync(int id, bool isActive);

        // Innvestore Methods
        Task<PaginationResponse<InnvestoreModel>> GetAllInnvestoresAsync(InnvestoreFilterModel filter);
        Task<InnvestoreModel?> GetInnvestoreByIdAsync(int id);
        Task<InnvestoreModel> CreateInnvestoreAsync(CreateInnvestoreModel model);
        Task<InnvestoreModel> UpdateInnvestoreAsync(UpdateInnvestoreModel model);
        Task<bool> DeleteInnvestoreAsync(int id);

        // Block Methods
        Task<PaginationResponse<BlockModel>> GetAllBlocksAsync(BlockFilterModel filter);
        Task<BlockModel?> GetBlockByIdAsync(int id);
        Task<BlockModel?> GetBlockBySlugAsync(string slug);
        Task<BlockModel> CreateBlockAsync(CreateBlockModel model);
        Task<BlockModel> UpdateBlockAsync(UpdateBlockModel model);
        Task<bool> DeleteBlockAsync(int id);
        Task<bool> ToggleBlockStatusAsync(int id, bool isActive);

        // Section-Block Relationship Methods
        Task<IEnumerable<BlockModel>> GetBlocksBySectionIdAsync(int sectionId);
        Task<IEnumerable<SectionModel>> GetSectionsByBlockIdAsync(int blockId);
        Task<bool> AssignBlocksToSectionAsync(AssignBlocksToSectionModel model);
        Task<bool> AssignSectionToBlockAsync(AssignSectionToBlockModel model);
        Task<bool> RemoveBlockFromSectionAsync(int sectionId, int blockId);
        Task<bool> UpdateSectionBlockOrderAsync(int sectionBlockId, int displayOrder);

        // Branch Methods
        Task<PaginationResponse<BranchModel>> GetAllBranchesAsync(BranchFilterModel filter);
        Task<BranchModel?> GetBranchByIdAsync(int id);
        Task<BranchModel> CreateBranchAsync(CreateBranchModel model);
        Task<BranchModel> UpdateBranchAsync(UpdateBranchModel model);
        Task<bool> DeleteBranchAsync(int id);

        // ShareHolder Methods
        Task<PaginationResponse<ShareHolderModel>> GetAllShareHoldersAsync(ShareHolderFilterModel filter);
        Task<ShareHolderModel?> GetShareHolderByIdAsync(int id);
        Task<ShareHolderModel> CreateShareHolderAsync(CreateShareHolderModel model);
        Task<ShareHolderModel> UpdateShareHolderAsync(UpdateShareHolderModel model);
        Task<bool> DeleteShareHolderAsync(int id);

        // BoardMember Methods
        Task<PaginationResponse<BoardMemberModel>> GetAllBoardMembersAsync(BoardMemberFilterModel filter);
        Task<BoardMemberModel?> GetBoardMemberByIdAsync(int id);
        Task<BoardMemberModel> CreateBoardMemberAsync(CreateBoardMemberModel model);
        Task<BoardMemberModel> UpdateBoardMemberAsync(UpdateBoardMemberModel model);
        Task<bool> DeleteBoardMemberAsync(int id);
    }
}
