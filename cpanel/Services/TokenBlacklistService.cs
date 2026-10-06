using micpanel.Context;
using micpanel.Models;
using Microsoft.EntityFrameworkCore;

namespace micpanel.Services
{
    public class TokenBlacklistService
    {
        private readonly CommerceDb _context;
        public TokenBlacklistService(CommerceDb context)
        {
            _context = context;
        }
        public async Task BlacklistTokenAsync(string token, DateTime expiry)
        {
            _context.BlacklistedTokens.Add(new BlacklistedToken { Token = token, ExpiryDate = expiry });
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsTokenBlacklistedAsync(string token)
        {
            return await _context.BlacklistedTokens.AnyAsync(b => b.Token == token && b.ExpiryDate > DateTime.UtcNow);
        }

        public async Task<List<BlacklistedToken>> GetActiveBlacklistedTokensAsync()
        {
            return await _context.BlacklistedTokens
                .Where(b => b.ExpiryDate > DateTime.UtcNow)
                .OrderByDescending(b => b.ExpiryDate)
                .ToListAsync();
        }

        public async Task<int> GetActiveBlacklistedTokensCountAsync()
        {
            return await _context.BlacklistedTokens
                .Where(b => b.ExpiryDate > DateTime.UtcNow)
                .CountAsync();
        }

        public async Task RemoveExpiredTokensAsync()
        {
            var expiredTokens = await _context.BlacklistedTokens
                .Where(b => b.ExpiryDate <= DateTime.UtcNow)
                .ToListAsync();

            _context.BlacklistedTokens.RemoveRange(expiredTokens);
            await _context.SaveChangesAsync();
        }
    }
}
