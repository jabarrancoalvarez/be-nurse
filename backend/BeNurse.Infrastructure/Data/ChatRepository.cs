using BeNurse.Application.Interfaces;
using BeNurse.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BeNurse.Infrastructure.Data;

public class ChatRepository : IChatRepository
{
    private readonly BeNurseDbContext _context;

    public ChatRepository(BeNurseDbContext context)
    {
        _context = context;
    }

    public async Task SaveAsync(ChatMessage message)
    {
        _context.ChatMessages.Add(message);
        await _context.SaveChangesAsync();
    }

    public async Task<List<string>> GetSessionIdsAsync()
    {
        return await _context.ChatMessages
            .Select(m => m.SessionId)
            .Distinct()
            .ToListAsync();
    }

    public async Task<List<ChatMessage>> GetBySessionIdAsync(string sessionId)
    {
        return await _context.ChatMessages
            .Where(m => m.SessionId == sessionId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();
    }
}
