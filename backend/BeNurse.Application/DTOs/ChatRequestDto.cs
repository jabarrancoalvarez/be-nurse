namespace BeNurse.Application.DTOs;

public class ChatRequestDto
{
    public string SessionId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
