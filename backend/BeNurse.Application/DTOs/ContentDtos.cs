using System.ComponentModel.DataAnnotations;

namespace BeNurse.Application.DTOs;

public class ContentBlockDto
{
    [Required]
    [StringLength(20)]
    public string Type { get; set; } = "text";

    [Required(AllowEmptyStrings = true)]
    [StringLength(20000, ErrorMessage = "El texto no puede superar los 20000 caracteres.")]
    public string Value { get; set; } = string.Empty;
}

public class ContentCardDto
{
    public int? Id { get; set; }

    [StringLength(300)]
    public string Title { get; set; } = string.Empty;

    [StringLength(4000)]
    public string Body { get; set; } = string.Empty;

    public List<string> Items { get; set; } = [];

    /// <summary>Secciones propias de la card, por nombre.</summary>
    public Dictionary<string, string> Fields { get; set; } = [];

    [StringLength(500)]
    public string Image { get; set; } = string.Empty;

    [StringLength(120)]
    public string Badge { get; set; } = string.Empty;
}

/// <summary>Reemplaza el grupo entero: cubre alta, edicion, borrado y reordenacion.</summary>
public class ContentGroupDto
{
    [MaxLength(50, ErrorMessage = "Un grupo no puede tener mas de 50 cards.")]
    public List<ContentCardDto> Cards { get; set; } = [];
}

/// <summary>Todo lo personalizado de una pagina, en una sola respuesta.</summary>
public class PageContentDto
{
    public Dictionary<string, ContentBlockDto> Blocks { get; set; } = [];
    public Dictionary<string, List<ContentCardDto>> Groups { get; set; } = [];
}
