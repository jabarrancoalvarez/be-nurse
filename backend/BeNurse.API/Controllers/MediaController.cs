using BeNurse.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BeNurse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MediaController : ControllerBase
{
    /// <summary>El frontend ya redimensiona antes de subir; esto es solo el tope de seguridad.</summary>
    private const int MaxBytes = 4 * 1024 * 1024;

    private static readonly string[] AllowedTypes = ["image/jpeg", "image/png", "image/webp"];

    private readonly IMediaService _mediaService;

    public MediaController(IMediaService mediaService)
    {
        _mediaService = mediaService;
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var asset = await _mediaService.GetAsync(id, ct);
        if (asset is null) return NotFound();

        // El id cambia con cada subida, asi que el contenido de una url nunca varia.
        Response.Headers.CacheControl = "public, max-age=31536000, immutable";

        return File(asset.Value.Data, asset.Value.ContentType);
    }

    [HttpPost]
    [Authorize]
    [RequestSizeLimit(MaxBytes)]
    public async Task<IActionResult> Upload(IFormFile file, CancellationToken ct)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { error = "No se ha recibido ninguna imagen." });
        }

        if (file.Length > MaxBytes)
        {
            return BadRequest(new { error = "La imagen no puede superar los 4 MB." });
        }

        var contentType = file.ContentType?.ToLowerInvariant() ?? string.Empty;
        if (!AllowedTypes.Contains(contentType))
        {
            return BadRequest(new { error = "Formato no admitido. Usa JPG, PNG o WebP." });
        }

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream, ct);
        var data = stream.ToArray();

        if (!LooksLikeImage(data))
        {
            return BadRequest(new { error = "El archivo no parece una imagen valida." });
        }

        var id = await _mediaService.SaveAsync(file.FileName, contentType, data, ct);
        return Ok(new { id });
    }

    /// <summary>
    /// Comprueba la firma del archivo: el content-type que declara el cliente no
    /// es de fiar por si solo.
    /// </summary>
    private static bool LooksLikeImage(byte[] data)
    {
        if (data.Length < 12) return false;

        // JPEG: FF D8 FF
        if (data[0] == 0xFF && data[1] == 0xD8 && data[2] == 0xFF) return true;

        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (data[0] == 0x89 && data[1] == 0x50 && data[2] == 0x4E && data[3] == 0x47
            && data[4] == 0x0D && data[5] == 0x0A && data[6] == 0x1A && data[7] == 0x0A) return true;

        // WebP: "RIFF" .... "WEBP"
        if (data[0] == 'R' && data[1] == 'I' && data[2] == 'F' && data[3] == 'F'
            && data[8] == 'W' && data[9] == 'E' && data[10] == 'B' && data[11] == 'P') return true;

        return false;
    }
}
