namespace BeNurse.Domain.Entities;

/// <summary>
/// Grupo de cards personalizado por el administrador. Su sola existencia indica
/// que el grupo ya no usa las cards por defecto del build: a partir de ahi manda
/// la base de datos, incluso si el grupo se queda sin ninguna card.
/// </summary>
public class ContentGroup
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
    public List<ContentCard> Cards { get; set; } = [];
}

public class ContentCard
{
    public int Id { get; set; }
    public int ContentGroupId { get; set; }
    public int Position { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;

    /// <summary>Vinetas de la card, serializadas como JSON.</summary>
    public string ItemsJson { get; set; } = "[]";

    /// <summary>
    /// Campos con nombre, serializados como JSON. Permite que una card tenga
    /// secciones propias (por ejemplo sintomas y tratamiento en las ITS) sin
    /// forzar todo el contenido dentro de body.
    /// </summary>
    public string FieldsJson { get; set; } = string.Empty;

    /// <summary>Identificador de MediaAsset, o la ruta del asset original del build.</summary>
    public string Image { get; set; } = string.Empty;

    public string Badge { get; set; } = string.Empty;
}
