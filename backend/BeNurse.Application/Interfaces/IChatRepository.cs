using BeNurse.Domain.Entities;

namespace BeNurse.Application.Interfaces;

public interface IChatRepository
{
    Task SaveAsync(ChatMessage message);
    Task<List<string>> GetSessionIdsAsync();
    Task<List<ChatMessage>> GetBySessionIdAsync(string sessionId);
    Task<(List<QuestionDto> Items, int Total)> GetQuestionsAsync(string? search, int page, int pageSize);
}

public class QuestionDto
{
    public string SessionId { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public DateTime QuestionDate { get; set; }
    public string? Answer { get; set; }
    public DateTime? AnswerDate { get; set; }
}
