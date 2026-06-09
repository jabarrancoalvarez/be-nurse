using BeNurse.Application.DTOs;
using BeNurse.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BeNurse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly IChatRepository _chatRepository;

    public ChatController(IChatService chatService, IChatRepository chatRepository)
    {
        _chatService = chatService;
        _chatRepository = chatRepository;
    }

    [HttpPost("message")]
    public async Task<IActionResult> SendMessage([FromBody] ChatRequestDto request)
    {
        var response = await _chatService.ProcessMessageAsync(request.SessionId, request.Content);
        return Ok(new { message = response });
    }

    [HttpGet("questions")]
    public async Task<IActionResult> GetQuestions(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 50) pageSize = 10;

        var (items, total) = await _chatRepository.GetQuestionsAsync(search, page, pageSize);

        return Ok(new
        {
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling((double)total / pageSize),
            items
        });
    }
}
