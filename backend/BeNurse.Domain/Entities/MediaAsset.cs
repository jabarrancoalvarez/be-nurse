namespace BeNurse.Domain.Entities;

/// <summary>
/// Imagen subida por el administrador. Se guarda en la propia base de datos para
/// no depender de un servicio externo de almacenamiento.
/// </summary>
public class MediaAsset
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public byte[] Data { get; set; } = [];
    public DateTime CreatedAt { get; set; }
}
