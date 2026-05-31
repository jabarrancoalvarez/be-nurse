using BeNurse.Domain.Entities;

namespace BeNurse.Application.Interfaces;

public interface IChatRepository
{
    Task SaveAsync(ChatMessage message);
}
