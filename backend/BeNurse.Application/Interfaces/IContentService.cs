using BeNurse.Application.DTOs;

namespace BeNurse.Application.Interfaces;

public interface IContentService
{
    /// <summary>Devuelve solo lo personalizado cuya clave empieza por el prefijo dado.</summary>
    Task<PageContentDto> GetByPrefixAsync(string prefix, CancellationToken ct = default);

    Task SaveBlockAsync(string key, ContentBlockDto dto, CancellationToken ct = default);

    /// <summary>Elimina la personalizacion y devuelve el hueco al contenido del build.</summary>
    Task<bool> ResetBlockAsync(string key, CancellationToken ct = default);

    Task<List<ContentCardDto>> SaveGroupAsync(string groupKey, ContentGroupDto dto, CancellationToken ct = default);

    Task<bool> ResetGroupAsync(string groupKey, CancellationToken ct = default);
}

public interface IMediaService
{
    Task<Guid> SaveAsync(string fileName, string contentType, byte[] data, CancellationToken ct = default);
    Task<(byte[] Data, string ContentType)?> GetAsync(Guid id, CancellationToken ct = default);
}
