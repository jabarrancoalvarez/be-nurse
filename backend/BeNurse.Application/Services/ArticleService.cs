using BeNurse.Application.DTOs;
using BeNurse.Application.Interfaces;
using BeNurse.Domain.Entities;

namespace BeNurse.Application.Services;

public class ArticleService : IArticleService
{
    private readonly IArticleRepository _repository;

    public ArticleService(IArticleRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ArticleDto>> GetAllAsync()
    {
        var articles = await _repository.GetAllPublishedAsync();
        return articles.Select(MapToDto);
    }

    public async Task<ArticleDto?> GetBySlugAsync(string slug)
    {
        var article = await _repository.GetBySlugAsync(slug);
        return article is null ? null : MapToDto(article);
    }

    public async Task<IEnumerable<ArticleDto>> GetByCategoryAsync(string category)
    {
        var articles = await _repository.GetByCategoryAsync(category);
        return articles.Select(MapToDto);
    }

    private static ArticleDto MapToDto(Article a) => new()
    {
        Id = a.Id,
        Title = a.Title,
        Slug = a.Slug,
        Content = a.Content,
        Excerpt = a.Excerpt,
        Category = a.Category,
        SubCategory = a.SubCategory,
        AuthorName = a.AuthorName,
        PublishedAt = a.PublishedAt,
        IsPublished = a.IsPublished,
        ImageUrl = a.ImageUrl
    };
}
