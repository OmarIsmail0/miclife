using micpanel.Context;
using micpanel.ModelDto;
using micpanel.ModelDto.Enums;
using micpanel.Models;
using Microsoft.EntityFrameworkCore;

namespace micpanel.Repository
{
    public class AlbumService : IAlbumService
    {
        private readonly CommerceDb _context;
        private readonly IDocumentService _documentService;

        public AlbumService(CommerceDb context, IDocumentService documentService)
        {
            _context = context;
            _documentService = documentService;
        }

        public async Task<List<AlbumModel>> GetAllAlbumsAsync(string? languageCode = null)
        {
            var albums = await _context.Albums
                .Include(a => a.Translations)
                .Where(a => a.IsActive)
                .OrderBy(a => a.DisplayOrder)
                .ThenByDescending(a => a.CreatedAt)
                .ToListAsync();

            var albumModels = new List<AlbumModel>();

            foreach (var album in albums)
            {
                var albumModel = await MapToAlbumModelAsync(album, languageCode);
                albumModels.Add(albumModel);
            }

            return albumModels;
        }

        public async Task<AlbumModel?> GetAlbumByIdAsync(int id, string? languageCode = null)
        {
            var album = await _context.Albums
                .Include(a => a.Translations)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (album == null)
                return null;

            return await MapToAlbumModelAsync(album, languageCode);
        }

        public async Task<AlbumModel> CreateAlbumAsync(CreateAlbumModel model)
        {
            var album = new Album
            {
                DisplayOrder = model.DisplayOrder,
                IsActive = model.IsActive,
                Type = model.Type,
                CreatedAt = DateTime.UtcNow
            };

            foreach (var translation in model.Translations)
            {
                album.Translations.Add(new AlbumTranslation
                {
                    LanguageCode = translation.LanguageCode,
                    Name = translation.Name,
                    Description = translation.Description
                });
            }

            _context.Albums.Add(album);
            await _context.SaveChangesAsync();

            return await MapToAlbumModelAsync(album, null);
        }

        public async Task<AlbumModel> UpdateAlbumAsync(UpdateAlbumModel model)
        {
            var album = await _context.Albums
                .Include(a => a.Translations)
                .FirstOrDefaultAsync(a => a.Id == model.Id);

            if (album == null)
                throw new ArgumentException("Album not found");

            album.DisplayOrder = model.DisplayOrder;
            album.Type = model.Type;
            album.IsActive = model.IsActive;
            album.UpdatedAt = DateTime.UtcNow;

            // Update or add translations
            foreach (var translationModel in model.Translations)
            {
                var existingTranslation = album.Translations
                    .FirstOrDefault(t => t.Id == translationModel.Id && translationModel.Id.HasValue);

                if (existingTranslation != null)
                {
                    // Update existing translation
                    existingTranslation.LanguageCode = translationModel.LanguageCode;
                    existingTranslation.Name = translationModel.Name;
                    existingTranslation.Description = translationModel.Description;
                }
                else
                {
                    // Add new translation
                    album.Translations.Add(new AlbumTranslation
                    {
                        LanguageCode = translationModel.LanguageCode,
                        Name = translationModel.Name,
                        Description = translationModel.Description
                    });
                }
            }

            await _context.SaveChangesAsync();

            return await MapToAlbumModelAsync(album, null);
        }

        public async Task<bool> DeleteAlbumAsync(int id)
        {
            var album = await _context.Albums.FindAsync(id);
            if (album == null)
                return false;

            _context.Albums.Remove(album);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AlbumExistsAsync(int id)
        {
            return await _context.Albums.AnyAsync(a => a.Id == id);
        }

        private async Task<AlbumModel> MapToAlbumModelAsync(Album album, string? languageCode)
        {
            // Get translations
            var translations = album.Translations
                .Select(t => new AlbumTranslationModel
                {
                    Id = t.Id,
                    AlbumId = t.AlbumId,
                    LanguageCode = t.LanguageCode,
                    Name = t.Name,
                    Description = t.Description
                })
                .ToList();

            // Filter by language if specified
            if (!string.IsNullOrEmpty(languageCode))
            {
                translations = translations.Where(t => t.LanguageCode == languageCode).ToList();
            }

            // Get all images linked to this album using Tags field
            // We'll store "album-{albumId}" in the Tags field
            var documentsResponse = await _documentService.GetAllDocumentsAsync(new DocumentFilterModel
            {
                Tags = $"album-{album.Id}",
                PageNumber = 1,
                PageSize = 1000 // Get all documents for this album
            });

            var images = documentsResponse.Data.ToList();

            return new AlbumModel
            {
                Id = album.Id,
                DisplayOrder = album.DisplayOrder,
                IsActive = album.IsActive,
                Type = album.Type,
                CreatedAt = album.CreatedAt,
                UpdatedAt = album.UpdatedAt,
                Translations = translations,
                Images = images
            };
        }
    }
}

