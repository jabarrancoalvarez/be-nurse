namespace BeNurse.Application.Interfaces;

public interface IChatService
{
    Task<string> ProcessMessageAsync(string sessionId, string content);
}
