using BeNurse.Application.DTOs;
using BeNurse.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BeNurse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost("message")]
    public async Task<IActionResult> SendMessage([FromBody] ChatRequestDto request)
    {
        var response = await _chatService.ProcessMessageAsync(request.SessionId, request.Content);
        return Ok(new { message = response });
    }
}
