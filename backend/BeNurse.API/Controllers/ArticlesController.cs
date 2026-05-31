using BeNurse.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BeNurse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly IArticleService _articleService;

    public ArticlesController(IArticleService articleService)
    {
        _articleService = articleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var articles = await _articleService.GetAllAsync();
        return Ok(articles);
    }

    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetByCategory(string category)
    {
        var articles = await _articleService.GetByCategoryAsync(category);
        return Ok(articles);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var article = await _articleService.GetBySlugAsync(slug);
        if (article is null) return NotFound();
        return Ok(article);
    }
}
