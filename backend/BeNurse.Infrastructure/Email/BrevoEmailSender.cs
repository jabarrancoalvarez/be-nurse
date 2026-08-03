using System.Net.Http.Json;
using System.Text.Json.Serialization;
using BeNurse.Application.Interfaces;
using BeNurse.Application.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BeNurse.Infrastructure.Email;

/// <summary>
/// Envia el correo por la API HTTP de Brevo. A diferencia de SMTP, funciona en hosts que
/// bloquean los puertos 25/465/587 (Render en plan gratuito, entre otros).
/// </summary>
public class BrevoEmailSender : IEmailSender
{
    private const string SendEndpoint = "https://api.brevo.com/v3/smtp/email";

    private readonly HttpClient _http;
    private readonly EmailSettings _settings;
    private readonly ILogger<BrevoEmailSender> _logger;

    public BrevoEmailSender(HttpClient http, IOptions<EmailSettings> settings, ILogger<BrevoEmailSender> logger)
    {
        _http = http;
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

        if (string.IsNullOrWhiteSpace(_settings.ApiKey))
        {
            throw new InvalidOperationException("Email:ApiKey es obligatorio cuando Email:Provider es \"brevo\".");
        }

        if (string.IsNullOrWhiteSpace(_settings.FromAddress) || string.IsNullOrWhiteSpace(_settings.ToAddress))
        {
            throw new InvalidOperationException("Email:FromAddress y Email:ToAddress son obligatorios cuando Email:Enabled es true.");
        }

        var payload = new BrevoEmailRequest
        {
            Sender = new BrevoContact { Name = _settings.FromName, Email = _settings.FromAddress },
            To = [new BrevoContact { Email = _settings.ToAddress }],
            ReplyTo = string.IsNullOrWhiteSpace(message.ReplyToAddress)
                ? null
                : new BrevoContact { Name = message.ReplyToName, Email = message.ReplyToAddress },
            Subject = message.Subject,
            HtmlContent = message.HtmlBody,
            TextContent = message.TextBody
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, SendEndpoint)
        {
            Content = JsonContent.Create(payload)
        };
        request.Headers.Add("api-key", _settings.ApiKey);
        request.Headers.Add("accept", "application/json");

        using var response = await _http.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new HttpRequestException(
                $"Brevo devolvio {(int)response.StatusCode} {response.ReasonPhrase}: {body}");
        }

        _logger.LogInformation("Correo enviado a {To} via Brevo. Asunto: {Subject}", _settings.ToAddress, message.Subject);
    }

    private sealed class BrevoEmailRequest
    {
        [JsonPropertyName("sender")]
        public BrevoContact Sender { get; init; } = null!;

        [JsonPropertyName("to")]
        public BrevoContact[] To { get; init; } = [];

        [JsonPropertyName("replyTo")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public BrevoContact? ReplyTo { get; init; }

        [JsonPropertyName("subject")]
        public string Subject { get; init; } = string.Empty;

        [JsonPropertyName("htmlContent")]
        public string HtmlContent { get; init; } = string.Empty;

        [JsonPropertyName("textContent")]
        public string TextContent { get; init; } = string.Empty;
    }

    private sealed class BrevoContact
    {
        [JsonPropertyName("email")]
        public string Email { get; init; } = string.Empty;

        [JsonPropertyName("name")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Name { get; init; }
    }
}
