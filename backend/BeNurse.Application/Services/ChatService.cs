using BeNurse.Application.Interfaces;
using BeNurse.Domain.Entities;

namespace BeNurse.Application.Services;

public class ChatService : IChatService
{
    private readonly IChatRepository _repository;

    public ChatService(IChatRepository repository)
    {
        _repository = repository;
    }

    public async Task<string> ProcessMessageAsync(string sessionId, string content)
    {
        var userMessage = new ChatMessage
        {
            SessionId = sessionId,
            Content = content,
            IsFromUser = true,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.SaveAsync(userMessage);

        return "Gracias por tu mensaje. Un miembro del equipo te respondera pronto. Recuerda que este servicio no es una emergencia medica. Si tienes una urgencia, contacta con el 112.";
    }
}
