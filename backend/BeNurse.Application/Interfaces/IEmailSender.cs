namespace BeNurse.Application.Interfaces;

public record EmailMessage(
    string Subject,
    string HtmlBody,
    string TextBody,
    string? ReplyToAddress = null,
    string? ReplyToName = null);

public interface IEmailSender
{
    Task SendAsync(EmailMessage message, CancellationToken cancellationToken = default);
}
