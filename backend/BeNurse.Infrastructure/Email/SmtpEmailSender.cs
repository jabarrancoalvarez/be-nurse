using BeNurse.Application.Interfaces;
using BeNurse.Application.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace BeNurse.Infrastructure.Email;

public class SmtpEmailSender : IEmailSender
{
    private readonly EmailSettings _settings;
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(IOptions<EmailSettings> settings, ILogger<SmtpEmailSender> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendAsync(EmailMessage message, CancellationToken cancellationToken = default)
    {
        if (!_settings.Enabled)
        {
            _logger.LogInformation("Envio de correo deshabilitado (Email:Enabled=false). Asunto: {Subject}", message.Subject);
            return;
        }

        if (string.IsNullOrWhiteSpace(_settings.FromAddress) || string.IsNullOrWhiteSpace(_settings.ToAddress))
        {
            throw new InvalidOperationException("Email:FromAddress y Email:ToAddress son obligatorios cuando Email:Enabled es true.");
        }

        var mime = new MimeMessage();
        mime.From.Add(new MailboxAddress(_settings.FromName, _settings.FromAddress));
        mime.To.Add(MailboxAddress.Parse(_settings.ToAddress));
        mime.Subject = message.Subject;

        // Permite responder directamente a quien escribio, sin exponer la cuenta SMTP.
        if (!string.IsNullOrWhiteSpace(message.ReplyToAddress) &&
            MailboxAddress.TryParse(message.ReplyToAddress, out var replyTo))
        {
            replyTo.Name = message.ReplyToName ?? replyTo.Name;
            mime.ReplyTo.Add(replyTo);
        }

        mime.Body = new BodyBuilder
        {
            HtmlBody = message.HtmlBody,
            TextBody = message.TextBody
        }.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(_settings.SmtpHost, _settings.SmtpPort, SecureSocketOptions.StartTlsWhenAvailable, cancellationToken);

        if (!string.IsNullOrWhiteSpace(_settings.Username))
        {
            await client.AuthenticateAsync(_settings.Username, _settings.Password, cancellationToken);
        }

        await client.SendAsync(mime, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);

        _logger.LogInformation("Correo enviado a {To}. Asunto: {Subject}", _settings.ToAddress, message.Subject);
    }
}
