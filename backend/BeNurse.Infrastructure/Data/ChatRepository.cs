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

    public async Task<(List<QuestionDto> Items, int Total)> GetQuestionsAsync(string? search, int page, int pageSize)
    {
        var sessionIds = await _context.ChatMessages
            .Where(m => m.IsFromUser)
            .Select(m => m.SessionId)
            .Distinct()
            .ToListAsync();

        var questions = new List<QuestionDto>();

        foreach (var sid in sessionIds)
        {
            var msgs = await _context.ChatMessages
                .Where(m => m.SessionId == sid)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();

            var firstUser = msgs.FirstOrDefault(m => m.IsFromUser);
            if (firstUser == null) continue;

            var nurseReply = msgs.LastOrDefault(m => m.IsNurseReply);

            questions.Add(new QuestionDto
            {
                SessionId = sid,
                Question = firstUser.Content,
                QuestionDate = firstUser.CreatedAt,
                Answer = nurseReply?.Content,
                AnswerDate = nurseReply?.CreatedAt
            });
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            questions = questions
                .Where(q => q.Question.ToLower().Contains(term) ||
                            (q.Answer?.ToLower().Contains(term) ?? false))
                .ToList();
        }

        questions = questions.OrderByDescending(q => q.QuestionDate).ToList();

        var total = questions.Count;
        var items = questions.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        return (items, total);
    }
}
