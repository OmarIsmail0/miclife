using micpanel.ModelDto;

namespace micpanel.Repository
{
    public interface IAlbumService
    {
        Task<List<AlbumModel>> GetAllAlbumsAsync(string? languageCode = null);
        Task<AlbumModel?> GetAlbumByIdAsync(int id, string? languageCode = null);
        Task<AlbumModel> CreateAlbumAsync(CreateAlbumModel model);
        Task<AlbumModel> UpdateAlbumAsync(UpdateAlbumModel model);
        Task<bool> DeleteAlbumAsync(int id);
        Task<bool> AlbumExistsAsync(int id);
    }
}

