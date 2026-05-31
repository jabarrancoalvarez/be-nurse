namespace BeNurse.Domain.Entities;

public class ChatMessage
{
    public int Id { get; set; }
    public string SessionId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsFromUser { get; set; }
    public DateTime CreatedAt { get; set; }
}
