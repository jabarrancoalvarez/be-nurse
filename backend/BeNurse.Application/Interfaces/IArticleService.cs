using BeNurse.Application.DTOs;

namespace BeNurse.Application.Interfaces;

public interface IArticleService
{
    Task<IEnumerable<ArticleDto>> GetAllAsync();
    Task<ArticleDto?> GetBySlugAsync(string slug);
    Task<IEnumerable<ArticleDto>> GetByCategoryAsync(string category);
}
