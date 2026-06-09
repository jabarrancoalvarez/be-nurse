using BeNurse.Application.Interfaces;
using BeNurse.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BeNurse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IContactRepository _contacts;
    private readonly IChatRepository _chat;

    public AdminController(IContactRepository contacts, IChatRepository chat)
    {
        _contacts = contacts;
        _chat = chat;
    }

    [HttpGet("contacts")]
    public async Task<IActionResult> GetContacts()
    {
        var list = await _contacts.GetAllAsync();
        return Ok(list);
    }

    [HttpGet("chat/sessions")]
    public async Task<IActionResult> GetSessions()
    {
        var sessionIds = await _chat.GetSessionIdsAsync();
        var sessions = new List<object>();

        foreach (var id in sessionIds)
        {
            var messages = await _chat.GetBySessionIdAsync(id);
            var last = messages.LastOrDefault();
            sessions.Add(new
            {
                sessionId = id,
                messageCount = messages.Count,
                lastMessage = last?.Content,
                lastAt = last?.CreatedAt,
                hasUnreplied = messages.Any(m => m.IsFromUser) &&
                               !messages.Any(m => !m.IsFromUser && m.CreatedAt > messages.Last(u => u.IsFromUser).CreatedAt)
            });
        }

        return Ok(sessions.OrderByDescending(s => ((dynamic)s).lastAt));
    }

    [HttpGet("chat/{sessionId}/messages")]
    public async Task<IActionResult> GetMessages(string sessionId)
    {
        var messages = await _chat.GetBySessionIdAsync(sessionId);
        return Ok(messages);
    }

    [HttpPost("chat/{sessionId}/reply")]
    public async Task<IActionResult> Reply(string sessionId, [FromBody] ReplyDto dto)
    {
        var message = new ChatMessage
        {
            SessionId = sessionId,
            Content = dto.Content,
            IsFromUser = false,
            IsNurseReply = true,
            CreatedAt = DateTime.UtcNow
        };
        await _chat.SaveAsync(message);
        return Ok(message);
    }
}

public record ReplyDto(string Content);
