namespace BeNurse.Domain.Entities;

/// <summary>
/// Sobrescritura de un texto o una imagen de la web. Si no existe fila para una
/// clave, el frontend pinta el contenido que trae embebido en el build, de modo
/// que la web publica nunca depende de que la API responda.
/// </summary>
public class ContentBlock
{
    public int Id { get; set; }

    /// <summary>Clave estable del hueco, por ejemplo "cuidate.hero.title".</summary>
    public string Key { get; set; } = string.Empty;

    /// <summary>"text" o "image".</summary>
    public string Type { get; set; } = "text";

    /// <summary>Texto, o el identificador de un MediaAsset cuando Type es "image".</summary>
    public string Value { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; }
}
