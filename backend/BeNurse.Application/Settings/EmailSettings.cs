namespace BeNurse.Application.Settings;

public class EmailSettings
{
    public const string SectionName = "Email";

    /// <summary>Si es false, no se intenta enviar nada (el formulario solo se guarda en base de datos).</summary>
    public bool Enabled { get; set; }

    /// <summary>
    /// "brevo" usa la API HTTP de Brevo; "smtp" usa un servidor SMTP clasico.
    /// Render bloquea los puertos SMTP en los servicios del plan gratuito, por eso "brevo" es el valor por defecto.
    /// </summary>
    public string Provider { get; set; } = "brevo";

    /// <summary>Clave de la API de Brevo. Solo se usa con Provider = "brevo".</summary>
    public string ApiKey { get; set; } = string.Empty;

    public string SmtpHost { get; set; } = "smtp.gmail.com";
    public int SmtpPort { get; set; } = 587;

    /// <summary>Cuenta SMTP. En Gmail, la propia direccion de correo.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>En Gmail, una contrasena de aplicacion (nunca la del usuario).</summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>Remitente. Gmail exige que coincida con la cuenta autenticada.</summary>
    public string FromAddress { get; set; } = string.Empty;
    public string FromName { get; set; } = "BE-nurse";

    /// <summary>Buzon que recibe los mensajes del formulario de contacto.</summary>
    public string ToAddress { get; set; } = string.Empty;
}
