using BeNurse.Domain.Entities;

namespace BeNurse.Application.Interfaces;

public interface IChatRepository
{
    Task SaveAsync(ChatMessage message);
    Task<List<string>> GetSessionIdsAsync();
    Task<List<ChatMessage>> GetBySessionIdAsync(string sessionId);
}
