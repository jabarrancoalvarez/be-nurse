using System.Net;
using System.Text;
using BeNurse.Application.DTOs;
using BeNurse.Application.Interfaces;
using BeNurse.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace BeNurse.Application.Services;

public class ContactService : IContactService
{
    private readonly IContactRepository _repository;
    private readonly IEmailSender _emailSender;
    private readonly ILogger<ContactService> _logger;

    public ContactService(
        IContactRepository repository,
        IEmailSender emailSender,
        ILogger<ContactService> logger)
    {
        _repository = repository;
        _emailSender = emailSender;
        _logger = logger;
    }

    public async Task SubmitAsync(ContactFormDto dto)
    {
        var form = new ContactForm
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim(),
            Subject = dto.Subject?.Trim() ?? string.Empty,
            Message = dto.Message.Trim(),
            SubmittedAt = DateTime.UtcNow
        };

        // La base de datos es la fuente de verdad: si el correo falla, el mensaje no se pierde.
        await _repository.SaveAsync(form);

        try
        {
            await _emailSender.SendAsync(BuildNotification(form));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "No se pudo enviar la notificacion del formulario de contacto {ContactFormId}. El mensaje sigue guardado en base de datos.",
                form.Id);
        }
    }

    private static EmailMessage BuildNotification(ContactForm form)
    {
        var subject = string.IsNullOrWhiteSpace(form.Subject) ? "Sin asunto" : form.Subject;

        var html = new StringBuilder()
            .Append("<h2 style=\"font-family:sans-serif;\">Nuevo mensaje del formulario de contacto</h2>")
            .Append("<table style=\"font-family:sans-serif;font-size:14px;border-collapse:collapse;\">")
            .Append(Row("Nombre", form.Name))
            .Append(Row("Email", form.Email))
            .Append(Row("Asunto", subject))
            .Append(Row("Recibido", form.SubmittedAt.ToString("dd/MM/yyyy HH:mm") + " UTC"))
            .Append("</table>")
            .Append("<p style=\"font-family:sans-serif;font-size:14px;\"><strong>Mensaje:</strong></p>")
            .Append("<p style=\"font-family:sans-serif;font-size:14px;white-space:pre-wrap;\">")
            .Append(WebUtility.HtmlEncode(form.Message))
            .Append("</p>")
            .ToString();

        var text = new StringBuilder()
            .AppendLine("Nuevo mensaje del formulario de contacto")
            .AppendLine()
            .AppendLine($"Nombre: {form.Name}")
            .AppendLine($"Email: {form.Email}")
            .AppendLine($"Asunto: {subject}")
            .AppendLine($"Recibido: {form.SubmittedAt:dd/MM/yyyy HH:mm} UTC")
            .AppendLine()
            .AppendLine("Mensaje:")
            .AppendLine(form.Message)
            .ToString();

        return new EmailMessage(
            Subject: $"[BE-nurse] {Sanitize(subject)}",
            HtmlBody: html,
            TextBody: text,
            ReplyToAddress: form.Email,
            ReplyToName: form.Name);
    }

    private static string Row(string label, string value) =>
        $"<tr><td style=\"padding:4px 12px 4px 0;color:#666;\">{label}</td>" +
        $"<td style=\"padding:4px 0;\"><strong>{WebUtility.HtmlEncode(value)}</strong></td></tr>";

    /// <summary>Evita inyeccion de cabeceras a traves del asunto y lo recorta a una longitud razonable.</summary>
    private static string Sanitize(string value)
    {
        var clean = new string(value.Where(c => !char.IsControl(c)).ToArray()).Trim();
        return clean.Length > 120 ? clean[..120] + "..." : clean;
    }
}
