using micpanel.Context;
using micpanel.ModelDto;
using micpanel.Models;
using Microsoft.EntityFrameworkCore;

namespace micpanel.Repository
{
    public class ContentManage : IContentManage
    {
        private readonly CommerceDb _context;

        public ContentManage(CommerceDb context)
        {
            _context = context;
        }

        #region LOB Methods

        public async Task<PaginationResponse<LOBModel>> GetAllLOBsAsync(LOBFilterModel filter)
        {
            var query = _context.LOBs.AsQueryable();

            if (filter.IsActive.HasValue)
                query = query.Where(l => l.IsActive == filter.IsActive.Value);

            var totalCount = await query.CountAsync();
            var lobs = await query
                .Include(l => l.LOBTranslations)
                .OrderBy(l => l.DisplayOrder)
                .ThenBy(l => l.Id)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var lobModels = lobs.Select(MapToLOBModel).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginationResponse<LOBModel>
            {
                Data = lobModels,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.PageNumber > 1,
                HasNextPage = filter.PageNumber < totalPages
            };
        }

        public async Task<LOBModel?> GetLOBByIdAsync(int id)
        {
            var lob = await _context.LOBs
                .Include(l => l.LOBTranslations)
                .FirstOrDefaultAsync(l => l.Id == id);

            return lob == null ? null : MapToLOBModel(lob);
        }

        public async Task<LOBModel?> GetLOBBySlugAsync(string slug)
        {
            var lob = await _context.LOBs
                .Include(l => l.LOBTranslations)
                .FirstOrDefaultAsync(l => l.Slug == slug);

            return lob == null ? null : MapToLOBModel(lob);
        }

        public async Task<LOBModel> CreateLOBAsync(CreateLOBModel model)
        {
            var lob = new LOB
            {
                Slug = model.Slug,
                IconUrl = model.IconUrl,
                IsActive = model.IsActive,
                DisplayOrder = model.DisplayOrder
            };

            _context.LOBs.Add(lob);
            await _context.SaveChangesAsync();

            // Add translations
            foreach (var translation in model.Translations)
            {
                var lobTranslation = new LOBTranslation
                {
                    LOBId = lob.Id,
                    LanguageCode = translation.LanguageCode,
                    Name = translation.Name,
                    Description = translation.Description
                };
                _context.LOBTranslations.Add(lobTranslation);
            }

            await _context.SaveChangesAsync();

            return await GetLOBByIdAsync(lob.Id) ?? throw new InvalidOperationException("Failed to create LOB");
        }

        public async Task<LOBModel> UpdateLOBAsync(UpdateLOBModel model)
        {
            var lob = await _context.LOBs.FindAsync(model.Id);
            if (lob == null)
                throw new ArgumentException("LOB not found");

            lob.Slug = model.Slug;
            lob.IconUrl = model.IconUrl;
            lob.IsActive = model.IsActive;
            lob.DisplayOrder = model.DisplayOrder;

            if (model.Translations != null)
            {
                // Remove existing translations
                var existingTranslations = await _context.LOBTranslations
                    .Where(t => t.LOBId == model.Id)
                    .ToListAsync();
                _context.LOBTranslations.RemoveRange(existingTranslations);

                // Add updated translations
                foreach (var translation in model.Translations)
                {
                    var lobTranslation = new LOBTranslation
                    {
                        LOBId = lob.Id,
                        LanguageCode = translation.LanguageCode,
                        Name = translation.Name,
                        Description = translation.Description
                    };
                    _context.LOBTranslations.Add(lobTranslation);
                }
            }

            await _context.SaveChangesAsync();

            return await GetLOBByIdAsync(lob.Id) ?? throw new InvalidOperationException("Failed to update LOB");
        }

        public async Task<bool> DeleteLOBAsync(int id)
        {
            var lob = await _context.LOBs.FindAsync(id);
            if (lob == null)
                return false;

            _context.LOBs.Remove(lob);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleLOBStatusAsync(int id, bool isActive)
        {
            var lob = await _context.LOBs.FindAsync(id);
            if (lob == null)
                return false;

            lob.IsActive = isActive;
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Product Methods

        public async Task<PaginationResponse<ProductModel>> GetAllProductsAsync(ProductFilterModel filter)
        {
            var query = _context.Products.AsQueryable();

            if (filter.LOBId.HasValue)
                query = query.Where(p => p.LOBId == filter.LOBId.Value);

            if (filter.IsActive.HasValue)
                query = query.Where(p => p.IsActive == filter.IsActive.Value);

            var totalCount = await query.CountAsync();
            var products = await query
                .Include(p => p.ProductTranslations)
                .OrderBy(p => p.DisplayOrder)
                .ThenBy(p => p.Id)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var productModels = products.Select(MapToProductModel).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginationResponse<ProductModel>
            {
                Data = productModels,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.PageNumber > 1,
                HasNextPage = filter.PageNumber < totalPages
            };
        }

        public async Task<ProductModel?> GetProductByIdAsync(int id)
        {
            var product = await _context.Products
                .Include(p => p.ProductTranslations)
                .FirstOrDefaultAsync(p => p.Id == id);

            return product == null ? null : MapToProductModel(product);
        }

        public async Task<ProductModel?> GetProductBySlugAsync(string slug)
        {
            var product = await _context.Products
                .Include(p => p.ProductTranslations)
                .FirstOrDefaultAsync(p => p.Slug == slug);

            return product == null ? null : MapToProductModel(product);
        }

        public async Task<IEnumerable<ProductModel>> GetProductsByLOBAsync(int lobId)
        {
            var products = await _context.Products
                .Where(p => p.LOBId == lobId)
                .Include(p => p.ProductTranslations)
                .OrderBy(p => p.DisplayOrder)
                .ThenBy(p => p.Id)
                .ToListAsync();

            return products.Select(MapToProductModel);
        }

        public async Task<ProductModel> CreateProductAsync(CreateProductModel model)
        {
            var product = new Product
            {
                LOBId = model.LOBId,
                Slug = model.Slug,
                ImageUrl = model.ImageUrl,
                DisplayOrder = model.DisplayOrder,
                IsActive = model.IsActive
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Add translations
            foreach (var translation in model.Translations)
            {
                var productTranslation = new ProductTranslation
                {
                    ProductId = product.Id,
                    LanguageCode = translation.LanguageCode,
                    Name = translation.Name,
                    ShortDescription = translation.ShortDescription,
                    FullDescription = translation.FullDescription,
                    SEO_Title = translation.SEO_Title,
                    SEO_Description = translation.SEO_Description
                };
                _context.ProductTranslations.Add(productTranslation);
            }

            await _context.SaveChangesAsync();

            return await GetProductByIdAsync(product.Id) ?? throw new InvalidOperationException("Failed to create Product");
        }

        public async Task<ProductModel> UpdateProductAsync(UpdateProductModel model)
        {
            var product = await _context.Products.FindAsync(model.Id);
            if (product == null)
                throw new ArgumentException("Product not found");

            product.LOBId = model.LOBId;
            product.Slug = model.Slug;
            product.ImageUrl = model.ImageUrl;
            product.DisplayOrder = model.DisplayOrder;
            product.IsActive = model.IsActive;

            if (model.Translations != null)
            {
                // Remove existing translations
                var existingTranslations = await _context.ProductTranslations
                    .Where(t => t.ProductId == model.Id)
                    .ToListAsync();
                _context.ProductTranslations.RemoveRange(existingTranslations);

                // Add updated translations
                foreach (var translation in model.Translations)
                {
                    var productTranslation = new ProductTranslation
                    {
                        ProductId = product.Id,
                        LanguageCode = translation.LanguageCode,
                        Name = translation.Name,
                        ShortDescription = translation.ShortDescription,
                        FullDescription = translation.FullDescription,
                        SEO_Title = translation.SEO_Title,
                        SEO_Description = translation.SEO_Description
                    };
                    _context.ProductTranslations.Add(productTranslation);
                }
            }

            await _context.SaveChangesAsync();

            return await GetProductByIdAsync(product.Id) ?? throw new InvalidOperationException("Failed to update Product");
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleProductStatusAsync(int id, bool isActive)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return false;

            product.IsActive = isActive;
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Section Methods

        public async Task<PaginationResponse<SectionModel>> GetAllSectionsAsync(SectionFilterModel filter)
        {
            var query = _context.Sections.AsQueryable();

            if (!string.IsNullOrEmpty(filter.SectionKey))
                query = query.Where(s => s.SectionKey == filter.SectionKey);

            if (filter.IsActive.HasValue)
                query = query.Where(s => s.IsActive == filter.IsActive.Value);

            var totalCount = await query.CountAsync();
            var sections = await query
                .Include(s => s.SectionTranslations)
                .Include(s => s.SectionBlocks)
                    .ThenInclude(sb => sb.Block)
                        .ThenInclude(b => b.BlockTranslations)
                .OrderBy(s => s.SectionKey)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var sectionModels = sections.Select(MapToSectionModel).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginationResponse<SectionModel>
            {
                Data = sectionModels,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.PageNumber > 1,
                HasNextPage = filter.PageNumber < totalPages
            };
        }

        public async Task<SectionModel?> GetSectionByIdAsync(int id)
        {
            var section = await _context.Sections
                .Include(s => s.SectionTranslations)
                .Include(s => s.SectionBlocks)
                    .ThenInclude(sb => sb.Block)
                        .ThenInclude(b => b.BlockTranslations)
                .FirstOrDefaultAsync(s => s.Id == id);

            return section == null ? null : MapToSectionModel(section);
        }

        public async Task<SectionModel?> GetSectionByKeyAsync(string sectionKey)
        {
            var section = await _context.Sections
                .Include(s => s.SectionTranslations)
                .Include(s => s.SectionBlocks)
                    .ThenInclude(sb => sb.Block)
                        .ThenInclude(b => b.BlockTranslations)
                .FirstOrDefaultAsync(s => s.SectionKey == sectionKey);

            return section == null ? null : MapToSectionModel(section);
        }

        public async Task<SectionModel?> GetSectionBySlugAsync(string slug)
        {
            var section = await _context.Sections
                .Include(s => s.SectionTranslations)
                .Include(s => s.SectionBlocks)
                    .ThenInclude(sb => sb.Block)
                        .ThenInclude(b => b.BlockTranslations)
                .FirstOrDefaultAsync(s => s.Slug == slug);

            return section == null ? null : MapToSectionModel(section);
        }

        public async Task<SectionModel> CreateSectionAsync(CreateSectionModel model)
        {
            var section = new Section
            {
                SectionKey = model.SectionKey,
                Slug = model.Slug,
                ImageUrl = model.ImageUrl,
                IsActive = model.IsActive,
                LastUpdated = DateTime.UtcNow
            };

            _context.Sections.Add(section);
            await _context.SaveChangesAsync();

            // Add translations
            foreach (var translation in model.Translations)
            {
                var sectionTranslation = new SectionTranslation
                {
                    SectionId = section.Id,
                    LanguageCode = translation.LanguageCode,
                    Title = translation.Title,
                    Content = translation.Content,
                    SEO_Title = translation.SEO_Title,
                    SEO_Description = translation.SEO_Description
                };
                _context.SectionTranslations.Add(sectionTranslation);
            }

            await _context.SaveChangesAsync();

            return await GetSectionByIdAsync(section.Id) ?? throw new InvalidOperationException("Failed to create Section");
        }

        public async Task<SectionModel> UpdateSectionAsync(UpdateSectionModel model)
        {
            var section = await _context.Sections.FindAsync(model.Id);
            if (section == null)
                throw new ArgumentException("Section not found");

            if (!string.IsNullOrEmpty(model.SectionKey))
                section.SectionKey = model.SectionKey;

            section.Slug = model.Slug;
            section.ImageUrl = model.ImageUrl;
            section.IsActive = model.IsActive;
            section.LastUpdated = DateTime.UtcNow;

            if (model.Translations != null)
            {
                // Remove existing translations
                var existingTranslations = await _context.SectionTranslations
                    .Where(t => t.SectionId == model.Id)
                    .ToListAsync();
                _context.SectionTranslations.RemoveRange(existingTranslations);

                // Add updated translations
                foreach (var translation in model.Translations)
                {
                    var sectionTranslation = new SectionTranslation
                    {
                        SectionId = section.Id,
                        LanguageCode = translation.LanguageCode,
                        Title = translation.Title,
                        Content = translation.Content,
                        SEO_Title = translation.SEO_Title,
                        SEO_Description = translation.SEO_Description
                    };
                    _context.SectionTranslations.Add(sectionTranslation);
                }
            }

            await _context.SaveChangesAsync();

            return await GetSectionByIdAsync(section.Id) ?? throw new InvalidOperationException("Failed to update Section");
        }

        public async Task<bool> DeleteSectionAsync(int id)
        {
            var section = await _context.Sections.FindAsync(id);
            if (section == null)
                return false;

            _context.Sections.Remove(section);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleSectionStatusAsync(int id, bool isActive)
        {
            var section = await _context.Sections.FindAsync(id);
            if (section == null)
                return false;

            section.IsActive = isActive;
            section.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Question Methods

        public async Task<PaginationResponse<QuestionModel>> GetAllQuestionsAsync(QuestionFilterModel filter)
        {
            var query = _context.Questions.AsQueryable();

            if (filter.IsActive.HasValue)
                query = query.Where(q => q.IsActive == filter.IsActive.Value);

            var totalCount = await query.CountAsync();
            var questions = await query
                .OrderBy(q => q.DisplayOrder)
                .ThenBy(q => q.Id)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var questionModels = questions.Select(MapToQuestionModel).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginationResponse<QuestionModel>
            {
                Data = questionModels,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.PageNumber > 1,
                HasNextPage = filter.PageNumber < totalPages
            };
        }

        public async Task<QuestionModel?> GetQuestionByIdAsync(int id)
        {
            var question = await _context.Questions.FindAsync(id);

            return question == null ? null : MapToQuestionModel(question);
        }

        public async Task<QuestionModel> CreateQuestionAsync(CreateQuestionModel model)
        {
            var question = new Question
            {
                QuestionText = model.QuestionText,
                Answer = model.Answer,
                DisplayOrder = model.DisplayOrder,
                IsActive = model.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return MapToQuestionModel(question);
        }

        public async Task<QuestionModel> UpdateQuestionAsync(UpdateQuestionModel model)
        {
            var question = await _context.Questions.FindAsync(model.Id);
            if (question == null)
                throw new ArgumentException("Question not found");

            question.QuestionText = model.QuestionText;
            question.Answer = model.Answer;
            question.DisplayOrder = model.DisplayOrder;
            question.IsActive = model.IsActive;
            question.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToQuestionModel(question);
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
                return false;

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleQuestionStatusAsync(int id, bool isActive)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
                return false;

            question.IsActive = isActive;
            question.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Innvestore Methods

        public async Task<PaginationResponse<InnvestoreModel>> GetAllInnvestoresAsync(InnvestoreFilterModel filter)
        {
            var query = _context.Innvestores.AsQueryable();

            var totalCount = await query.CountAsync();
            var innvestores = await query
                .OrderBy(i => i.Id)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var innvestoreModels = innvestores.Select(MapToInnvestoreModel).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginationResponse<InnvestoreModel>
            {
                Data = innvestoreModels,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.PageNumber > 1,
                HasNextPage = filter.PageNumber < totalPages
            };
        }

        public async Task<InnvestoreModel?> GetInnvestoreByIdAsync(int id)
        {
            var innvestore = await _context.Innvestores.FindAsync(id);

            return innvestore == null ? null : MapToInnvestoreModel(innvestore);
        }

        public async Task<InnvestoreModel> CreateInnvestoreAsync(CreateInnvestoreModel model)
        {
            var innvestore = new Innvestore
            {
                Title = model.Title,
                UrlFrm = model.UrlFrm,
                ImageUrl = model.ImageUrl,
                UrlFrmAr = model.UrlFrmAr,
                TitleAr = model.TitleAr
            };

            _context.Innvestores.Add(innvestore);
            await _context.SaveChangesAsync();

            return MapToInnvestoreModel(innvestore);
        }

        public async Task<InnvestoreModel> UpdateInnvestoreAsync(UpdateInnvestoreModel model)
        {
            var innvestore = await _context.Innvestores.FindAsync(model.Id);
            if (innvestore == null)
                throw new ArgumentException("Innvestore not found");

            innvestore.Title = model.Title;
            innvestore.UrlFrm = model.UrlFrm;
            innvestore.ImageUrl = model.ImageUrl;
            innvestore.UrlFrmAr = model.UrlFrmAr;
            innvestore.TitleAr = model.TitleAr;

            await _context.SaveChangesAsync();

            return MapToInnvestoreModel(innvestore);
        }

        public async Task<bool> DeleteInnvestoreAsync(int id)
        {
            var innvestore = await _context.Innvestores.FindAsync(id);
            if (innvestore == null)
                return false;

            _context.Innvestores.Remove(innvestore);
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Block Methods

        public async Task<PaginationResponse<BlockModel>> GetAllBlocksAsync(BlockFilterModel filter)
        {
            var query = _context.Blocks.AsQueryable();

            if (filter.IsActive.HasValue)
                query = query.Where(b => b.IsActive == filter.IsActive.Value);

            var totalCount = await query.CountAsync();
            var blocks = await query
                .Include(b => b.BlockTranslations)
                .Include(b => b.SectionBlocks)
                .OrderBy(b => b.DisplayOrder)
                .ThenBy(b => b.Id)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var blockModels = blocks.Select(MapToBlockModel).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginationResponse<BlockModel>
            {
                Data = blockModels,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.PageNumber > 1,
                HasNextPage = filter.PageNumber < totalPages
            };
        }

        public async Task<BlockModel?> GetBlockByIdAsync(int id)
        {
            var block = await _context.Blocks
                .Include(b => b.BlockTranslations)
                .Include(b => b.SectionBlocks)
                .FirstOrDefaultAsync(b => b.Id == id);

            return block == null ? null : MapToBlockModel(block);
        }

        public async Task<BlockModel?> GetBlockBySlugAsync(string slug)
        {
            var block = await _context.Blocks
                .Include(b => b.BlockTranslations)
                .Include(b => b.SectionBlocks)
                .FirstOrDefaultAsync(b => b.Slug == slug);

            return block == null ? null : MapToBlockModel(block);
        }

        public async Task<BlockModel> CreateBlockAsync(CreateBlockModel model)
        {
            var block = new Block
            {
                Slug = model.Slug,
                ImageUrl = model.ImageUrl,
                DisplayOrder = model.DisplayOrder,
                IsActive = model.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.Blocks.Add(block);
            await _context.SaveChangesAsync();

            // Add translations
            foreach (var translation in model.Translations)
            {
                var blockTranslation = new BlockTranslation
                {
                    BlockId = block.Id,
                    LanguageCode = translation.LanguageCode,
                    Title = translation.Title,
                    Description = translation.Description,
                    SEO_Title = translation.SEO_Title,
                    SEO_Description = translation.SEO_Description
                };
                _context.BlockTranslations.Add(blockTranslation);
            }

            await _context.SaveChangesAsync();

            return await GetBlockByIdAsync(block.Id) ?? throw new InvalidOperationException("Failed to create Block");
        }

        public async Task<BlockModel> UpdateBlockAsync(UpdateBlockModel model)
        {
            var block = await _context.Blocks.FindAsync(model.Id);
            if (block == null)
                throw new ArgumentException("Block not found");

            block.Slug = model.Slug;
            block.ImageUrl = model.ImageUrl;
            block.DisplayOrder = model.DisplayOrder;
            block.IsActive = model.IsActive;
            block.UpdatedAt = DateTime.UtcNow;

            if (model.Translations != null)
            {
                // Remove existing translations
                var existingTranslations = await _context.BlockTranslations
                    .Where(t => t.BlockId == model.Id)
                    .ToListAsync();
                _context.BlockTranslations.RemoveRange(existingTranslations);

                // Add updated translations
                foreach (var translation in model.Translations)
                {
                    var blockTranslation = new BlockTranslation
                    {
                        BlockId = block.Id,
                        LanguageCode = translation.LanguageCode,
                        Title = translation.Title,
                        Description = translation.Description,
                        SEO_Title = translation.SEO_Title,
                        SEO_Description = translation.SEO_Description
                    };
                    _context.BlockTranslations.Add(blockTranslation);
                }
            }

            await _context.SaveChangesAsync();

            return await GetBlockByIdAsync(block.Id) ?? throw new InvalidOperationException("Failed to update Block");
        }

        public async Task<bool> DeleteBlockAsync(int id)
        {
            var block = await _context.Blocks.FindAsync(id);
            if (block == null)
                return false;

            _context.Blocks.Remove(block);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleBlockStatusAsync(int id, bool isActive)
        {
            var block = await _context.Blocks.FindAsync(id);
            if (block == null)
                return false;

            block.IsActive = isActive;
            block.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Section-Block Relationship Methods

        public async Task<IEnumerable<BlockModel>> GetBlocksBySectionIdAsync(int sectionId)
        {
            var sectionBlocks = await _context.SectionBlocks
                .Where(sb => sb.SectionId == sectionId)
                .Include(sb => sb.Block)
                    .ThenInclude(b => b.BlockTranslations)
                .OrderBy(sb => sb.DisplayOrder)
                .ThenBy(sb => sb.Id)
                .ToListAsync();

            return sectionBlocks.Select(sb => MapToBlockModel(sb.Block));
        }

        public async Task<IEnumerable<SectionModel>> GetSectionsByBlockIdAsync(int blockId)
        {
            var sectionBlocks = await _context.SectionBlocks
                .Where(sb => sb.BlockId == blockId)
                .Include(sb => sb.Section)
                    .ThenInclude(s => s.SectionTranslations)
                .ToListAsync();

            return sectionBlocks.Select(sb => MapToSectionModel(sb.Section));
        }

        public async Task<bool> AssignBlocksToSectionAsync(AssignBlocksToSectionModel model)
        {
            var section = await _context.Sections.FindAsync(model.SectionId);
            if (section == null)
                return false;

            // Get existing blocks for this section
            var existingSectionBlocks = await _context.SectionBlocks
                .Where(sb => sb.SectionId == model.SectionId)
                .ToListAsync();

            // Remove blocks that are not in the new list
            var blocksToRemove = existingSectionBlocks
                .Where(esb => !model.BlockIds.Contains(esb.BlockId))
                .ToList();
            _context.SectionBlocks.RemoveRange(blocksToRemove);

            // Add new blocks that don't already exist
            var existingBlockIds = existingSectionBlocks.Select(esb => esb.BlockId).ToList();
            var blocksToAdd = model.BlockIds
                .Where(blockId => !existingBlockIds.Contains(blockId))
                .ToList();

            var maxDisplayOrder = existingSectionBlocks.Any() 
                ? existingSectionBlocks.Max(esb => esb.DisplayOrder) 
                : 0;

            foreach (var blockId in blocksToAdd)
            {
                var block = await _context.Blocks.FindAsync(blockId);
                if (block != null)
                {
                    var sectionBlock = new SectionBlock
                    {
                        SectionId = model.SectionId,
                        BlockId = blockId,
                        DisplayOrder = ++maxDisplayOrder,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.SectionBlocks.Add(sectionBlock);
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AssignSectionToBlockAsync(AssignSectionToBlockModel model)
        {
            var block = await _context.Blocks.FindAsync(model.BlockId);
            if (block == null)
                return false;

            // Get existing sections for this block
            var existingSectionBlocks = await _context.SectionBlocks
                .Where(sb => sb.BlockId == model.BlockId)
                .ToListAsync();

            // Remove sections that are not in the new list
            var sectionsToRemove = existingSectionBlocks
                .Where(esb => !model.SectionIds.Contains(esb.SectionId))
                .ToList();
            _context.SectionBlocks.RemoveRange(sectionsToRemove);

            // Add new sections that don't already exist
            var existingSectionIds = existingSectionBlocks.Select(esb => esb.SectionId).ToList();
            var sectionsToAdd = model.SectionIds
                .Where(sectionId => !existingSectionIds.Contains(sectionId))
                .ToList();

            foreach (var sectionId in sectionsToAdd)
            {
                var section = await _context.Sections.FindAsync(sectionId);
                if (section != null)
                {
                    var maxDisplayOrder = await _context.SectionBlocks
                        .Where(sb => sb.SectionId == sectionId)
                        .MaxAsync(sb => (int?)sb.DisplayOrder) ?? 0;

                    var sectionBlock = new SectionBlock
                    {
                        SectionId = sectionId,
                        BlockId = model.BlockId,
                        DisplayOrder = maxDisplayOrder + 1,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.SectionBlocks.Add(sectionBlock);
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveBlockFromSectionAsync(int sectionId, int blockId)
        {
            var sectionBlock = await _context.SectionBlocks
                .FirstOrDefaultAsync(sb => sb.SectionId == sectionId && sb.BlockId == blockId);

            if (sectionBlock == null)
                return false;

            _context.SectionBlocks.Remove(sectionBlock);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSectionBlockOrderAsync(int sectionBlockId, int displayOrder)
        {
            var sectionBlock = await _context.SectionBlocks.FindAsync(sectionBlockId);
            if (sectionBlock == null)
                return false;

            sectionBlock.DisplayOrder = displayOrder;
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Branch Methods

        public async Task<PaginationResponse<BranchModel>> GetAllBranchesAsync(BranchFilterModel filter)
        {
            var query = _context.Branches.AsQueryable();

            var totalCount = await query.CountAsync();
            var branches = await query
                .OrderBy(b => b.Id)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var branchModels = branches.Select(MapToBranchModel).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginationResponse<BranchModel>
            {
                Data = branchModels,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.PageNumber > 1,
                HasNextPage = filter.PageNumber < totalPages
            };
        }

        public async Task<BranchModel?> GetBranchByIdAsync(int id)
        {
            var branch = await _context.Branches.FindAsync(id);

            return branch == null ? null : MapToBranchModel(branch);
        }

        public async Task<BranchModel> CreateBranchAsync(CreateBranchModel model)
        {
            var branch = new Branch
            {
                Title = model.Title,
                Descrption = model.Descrption
            };

            _context.Branches.Add(branch);
            await _context.SaveChangesAsync();

            return MapToBranchModel(branch);
        }

        public async Task<BranchModel> UpdateBranchAsync(UpdateBranchModel model)
        {
            var branch = await _context.Branches.FindAsync(model.Id);
            if (branch == null)
                throw new ArgumentException("Branch not found");

            branch.Title = model.Title;
            branch.Descrption = model.Descrption;

            await _context.SaveChangesAsync();

            return MapToBranchModel(branch);
        }

        public async Task<bool> DeleteBranchAsync(int id)
        {
            var branch = await _context.Branches.FindAsync(id);
            if (branch == null)
                return false;

            _context.Branches.Remove(branch);
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region ShareHolder Methods

        public async Task<PaginationResponse<ShareHolderModel>> GetAllShareHoldersAsync(ShareHolderFilterModel filter)
        {
            var query = _context.ShareHolders.AsQueryable();

            var totalCount = await query.CountAsync();
            var shareHolders = await query
                .OrderBy(sh => sh.DisplayOrder)
                .ThenBy(sh => sh.Id)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var shareHolderModels = shareHolders.Select(MapToShareHolderModel).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginationResponse<ShareHolderModel>
            {
                Data = shareHolderModels,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.PageNumber > 1,
                HasNextPage = filter.PageNumber < totalPages
            };
        }

        public async Task<ShareHolderModel?> GetShareHolderByIdAsync(int id)
        {
            var shareHolder = await _context.ShareHolders.FindAsync(id);

            return shareHolder == null ? null : MapToShareHolderModel(shareHolder);
        }

        public async Task<ShareHolderModel> CreateShareHolderAsync(CreateShareHolderModel model)
        {
            var shareHolder = new ShareHolder
            {
                Title = model.Title,
                Descrption = model.Descrption,
                ImageUrl = model.ImageUrl,
                DisplayOrder = model.DisplayOrder,
                Share = model.Share
            };

            _context.ShareHolders.Add(shareHolder);
            await _context.SaveChangesAsync();

            return MapToShareHolderModel(shareHolder);
        }

        public async Task<ShareHolderModel> UpdateShareHolderAsync(UpdateShareHolderModel model)
        {
            var shareHolder = await _context.ShareHolders.FindAsync(model.Id);
            if (shareHolder == null)
                throw new ArgumentException("ShareHolder not found");

            shareHolder.Title = model.Title;
            shareHolder.Descrption = model.Descrption;
            shareHolder.ImageUrl = model.ImageUrl;
            shareHolder.DisplayOrder = model.DisplayOrder;
            shareHolder.Share = model.Share;

            await _context.SaveChangesAsync();

            return MapToShareHolderModel(shareHolder);
        }

        public async Task<bool> DeleteShareHolderAsync(int id)
        {
            var shareHolder = await _context.ShareHolders.FindAsync(id);
            if (shareHolder == null)
                return false;

            _context.ShareHolders.Remove(shareHolder);
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region BoardMember Methods

        public async Task<PaginationResponse<BoardMemberModel>> GetAllBoardMembersAsync(BoardMemberFilterModel filter)
        {
            var query = _context.BoardMembers.AsQueryable();

            var totalCount = await query.CountAsync();
            var boardMembers = await query
                .OrderBy(bm => bm.Id)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var boardMemberModels = boardMembers.Select(MapToBoardMemberModel).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginationResponse<BoardMemberModel>
            {
                Data = boardMemberModels,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.PageNumber > 1,
                HasNextPage = filter.PageNumber < totalPages
            };
        }

        public async Task<BoardMemberModel?> GetBoardMemberByIdAsync(int id)
        {
            var boardMember = await _context.BoardMembers.FindAsync(id);

            return boardMember == null ? null : MapToBoardMemberModel(boardMember);
        }

        public async Task<BoardMemberModel> CreateBoardMemberAsync(CreateBoardMemberModel model)
        {
            var boardMember = new BoardMember
            {
                Name = model.Name,
                Title = model.Title,
                ImageUrl = model.ImageUrl,
                IconUrl = model.IconUrl,
                Description = model.Description
            };

            _context.BoardMembers.Add(boardMember);
            await _context.SaveChangesAsync();

            return MapToBoardMemberModel(boardMember);
        }

        public async Task<BoardMemberModel> UpdateBoardMemberAsync(UpdateBoardMemberModel model)
        {
            var boardMember = await _context.BoardMembers.FindAsync(model.Id);
            if (boardMember == null)
                throw new ArgumentException("BoardMember not found");

            boardMember.Name = model.Name;
            boardMember.Title = model.Title;
            boardMember.ImageUrl = model.ImageUrl;
            boardMember.IconUrl = model.IconUrl;
            boardMember.Description = model.Description;

            await _context.SaveChangesAsync();

            return MapToBoardMemberModel(boardMember);
        }

        public async Task<bool> DeleteBoardMemberAsync(int id)
        {
            var boardMember = await _context.BoardMembers.FindAsync(id);
            if (boardMember == null)
                return false;

            _context.BoardMembers.Remove(boardMember);
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Mapping Methods

        private static LOBModel MapToLOBModel(LOB lob)
        {
            return new LOBModel
            {
                Id = lob.Id,
                Slug = lob.Slug,
                IconUrl = lob.IconUrl,
                IsActive = lob.IsActive,
                DisplayOrder = lob.DisplayOrder,
                Translations = lob.LOBTranslations?.Select(t => new LOBTranslationModel
                {
                    Id = t.Id,
                    LOBId = t.LOBId,
                    LanguageCode = t.LanguageCode,
                    Name = t.Name,
                    Description = t.Description
                }).ToList()
            };
        }

        private static ProductModel MapToProductModel(Product product)
        {
            return new ProductModel
            {
                Id = product.Id,
                LOBId = product.LOBId,
                Slug = product.Slug,
                ImageUrl = product.ImageUrl,
                DisplayOrder = product.DisplayOrder,
                IsActive = product.IsActive,
                Translations = product.ProductTranslations?.Select(t => new ProductTranslationModel
                {
                    Id = t.Id,
                    ProductId = t.ProductId,
                    LanguageCode = t.LanguageCode,
                    Name = t.Name,
                    ShortDescription = t.ShortDescription,
                    FullDescription = t.FullDescription,
                    SEO_Title = t.SEO_Title,
                    SEO_Description = t.SEO_Description
                }).ToList()
            };
        }

        private static SectionModel MapToSectionModel(Section section)
        {
            return new SectionModel
            {
                Id = section.Id,
                SectionKey = section.SectionKey,
                Slug = section.Slug,
                ImageUrl = section.ImageUrl,
                LastUpdated = section.LastUpdated,
                IsActive = section.IsActive,
                Translations = section.SectionTranslations?.Select(t => new SectionTranslationModel
                {
                    Id = t.Id,
                    SectionId = t.SectionId,
                    LanguageCode = t.LanguageCode,
                    Title = t.Title,
                    Content = t.Content,
                    SEO_Title = t.SEO_Title,
                    SEO_Description = t.SEO_Description
                }).ToList(),
                Blocks = section.SectionBlocks?.Select(sb => new SectionBlockModel
                {
                    Id = sb.Id,
                    SectionId = sb.SectionId,
                    BlockId = sb.BlockId,
                    DisplayOrder = sb.DisplayOrder,
                    CreatedAt = sb.CreatedAt,
                    Block = sb.Block != null ? MapToBlockModel(sb.Block) : null
                }).OrderBy(sb => sb.DisplayOrder).ToList()
            };
        }

        private static QuestionModel MapToQuestionModel(Question question)
        {
            return new QuestionModel
            {
                Id = question.Id,
                QuestionText = question.QuestionText,
                Answer = question.Answer,
                DisplayOrder = question.DisplayOrder,
                IsActive = question.IsActive,
                CreatedAt = question.CreatedAt,
                UpdatedAt = question.UpdatedAt
            };
        }

        private static InnvestoreModel MapToInnvestoreModel(Innvestore innvestore)
        {
            return new InnvestoreModel
            {
                Id = innvestore.Id,
                Title = innvestore.Title,
                UrlFrm = innvestore.UrlFrm,
                ImageUrl = innvestore.ImageUrl,
                TitleAr = innvestore.TitleAr,
                UrlFrmAr = innvestore.UrlFrmAr
            };
        }

        private static BlockModel MapToBlockModel(Block block)
        {
            return new BlockModel
            {
                Id = block.Id,
                Slug = block.Slug,
                ImageUrl = block.ImageUrl,
                DisplayOrder = block.DisplayOrder,
                IsActive = block.IsActive,
                CreatedAt = block.CreatedAt,
                UpdatedAt = block.UpdatedAt,
                Translations = block.BlockTranslations?.Select(t => new BlockTranslationModel
                {
                    Id = t.Id,
                    BlockId = t.BlockId,
                    LanguageCode = t.LanguageCode,
                    Title = t.Title,
                    Description = t.Description,
                    SEO_Title = t.SEO_Title,
                    SEO_Description = t.SEO_Description
                }).ToList(),
                SectionIds = block.SectionBlocks?.Select(sb => sb.SectionId).ToList()
            };
        }

        private static BranchModel MapToBranchModel(Branch branch)
        {
            return new BranchModel
            {
                Id = branch.Id,
                Title = branch.Title ?? string.Empty,
                Descrption = branch.Descrption ?? string.Empty
            };
        }

        private static ShareHolderModel MapToShareHolderModel(ShareHolder shareHolder)
        {
            return new ShareHolderModel
            {
                Id = shareHolder.Id,
                Title = shareHolder.Title ?? string.Empty,
                Descrption = shareHolder.Descrption ?? string.Empty,
                ImageUrl = shareHolder.ImageUrl,
                DisplayOrder = shareHolder.DisplayOrder,
                Share = shareHolder.Share
            };
        }

        private static BoardMemberModel MapToBoardMemberModel(BoardMember boardMember)
        {
            return new BoardMemberModel
            {
                Id = boardMember.Id,
                Name = boardMember.Name,
                Title = boardMember.Title,
                ImageUrl = boardMember.ImageUrl,
                IconUrl = boardMember.IconUrl,
                Description = boardMember.Description
            };
        }

        #endregion
    }
}
