using System.ComponentModel.DataAnnotations;

namespace BeNurse.Application.DTOs;

public class ContactFormDto
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(120, ErrorMessage = "El nombre no puede superar los 120 caracteres.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "El email es obligatorio.")]
    [EmailAddress(ErrorMessage = "El email no tiene un formato valido.")]
    [StringLength(200, ErrorMessage = "El email no puede superar los 200 caracteres.")]
    public string Email { get; set; } = string.Empty;

    [StringLength(200, ErrorMessage = "El asunto no puede superar los 200 caracteres.")]
    public string Subject { get; set; } = string.Empty;

    [Required(ErrorMessage = "El mensaje es obligatorio.")]
    [StringLength(4000, ErrorMessage = "El mensaje no puede superar los 4000 caracteres.")]
    public string Message { get; set; } = string.Empty;
}
