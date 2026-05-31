using BeNurse.Application.Interfaces;
using BeNurse.Domain.Entities;

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
}
