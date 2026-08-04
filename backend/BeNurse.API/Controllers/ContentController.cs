using BeNurse.Application.DTOs;
using BeNurse.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BeNurse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContentController : ControllerBase
{
    private readonly IContentService _contentService;

    public ContentController(IContentService contentService)
    {
        _contentService = contentService;
    }

    /// <summary>
    /// Solo devuelve lo que el administrador ha personalizado. Lo que no aparezca
    /// aqui lo pinta el frontend con el contenido que trae embebido en el build.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PageContentDto>> Get([FromQuery] string prefix, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(prefix))
        {
            return BadRequest(new { error = "El parametro prefix es obligatorio." });
        }

        return Ok(await _contentService.GetByPrefixAsync(prefix, ct));
    }

    [HttpPut("blocks/{key}")]
    [Authorize]
    public async Task<IActionResult> SaveBlock(string key, [FromBody] ContentBlockDto dto, CancellationToken ct)
    {
        if (!IsValidKey(key)) return BadRequest(new { error = "Clave no valida." });

        await _contentService.SaveBlockAsync(key, dto, ct);
        return NoContent();
    }

    /// <summary>Idempotente: restaurar algo que ya esta en su valor original no es un error.</summary>
    [HttpDelete("blocks/{key}")]
    [Authorize]
    public async Task<IActionResult> ResetBlock(string key, CancellationToken ct)
    {
        if (!IsValidKey(key)) return BadRequest(new { error = "Clave no valida." });

        await _contentService.ResetBlockAsync(key, ct);
        return NoContent();
    }

    [HttpPut("groups/{groupKey}")]
    [Authorize]
    public async Task<ActionResult<List<ContentCardDto>>> SaveGroup(string groupKey, [FromBody] ContentGroupDto dto, CancellationToken ct)
    {
        if (!IsValidKey(groupKey)) return BadRequest(new { error = "Clave no valida." });

        return Ok(await _contentService.SaveGroupAsync(groupKey, dto, ct));
    }

    [HttpDelete("groups/{groupKey}")]
    [Authorize]
    public async Task<IActionResult> ResetGroup(string groupKey, CancellationToken ct)
    {
        if (!IsValidKey(groupKey)) return BadRequest(new { error = "Clave no valida." });

        await _contentService.ResetGroupAsync(groupKey, ct);
        return NoContent();
    }

    /// <summary>Las claves las fija el frontend; se acotan para que no entre cualquier cosa.</summary>
    private static bool IsValidKey(string key) =>
        !string.IsNullOrWhiteSpace(key)
        && key.Length <= 200
        && key.All(c => char.IsLetterOrDigit(c) || c is '.' or '-' or '_');
}
