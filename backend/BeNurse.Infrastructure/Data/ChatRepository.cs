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

    public async Task<(List<QuestionDto> Items, int Total)> GetQuestionsAsync(
        string? search, int page, int pageSize)
    {
        // Load all messages in one query and group in memory
        var allMessages = await _context.ChatMessages
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();

        var grouped = allMessages
            .GroupBy(m => m.SessionId)
            .Select(g =>
            {
                var userMsg = g.FirstOrDefault(m => m.IsFromUser);
                // Use !IsFromUser for nurse replies — covers replies sent before IsNurseReply field existed
                var nurseMsg = g.LastOrDefault(m => !m.IsFromUser);
                return new { userMsg, nurseMsg };
            })
            .Where(g => g.userMsg != null)
            .Select(g => new QuestionDto
            {
                SessionId = g.userMsg!.SessionId,
                Question = g.userMsg.Content,
                QuestionDate = g.userMsg.CreatedAt,
                Answer = g.nurseMsg?.Content,
                AnswerDate = g.nurseMsg?.CreatedAt
            })
            .ToList();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            grouped = grouped
                .Where(q => q.Question.ToLower().Contains(term) ||
                            (q.Answer?.ToLower().Contains(term) ?? false))
                .ToList();
        }

        grouped = grouped.OrderByDescending(q => q.QuestionDate).ToList();

        var total = grouped.Count;
        var items = grouped.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        return (items, total);
    }
}
