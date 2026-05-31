using BeNurse.Domain.Entities;

namespace BeNurse.Application.Interfaces;

public interface IArticleRepository
{
    Task<IEnumerable<Article>> GetAllPublishedAsync();
    Task<Article?> GetBySlugAsync(string slug);
    Task<IEnumerable<Article>> GetByCategoryAsync(string category);
}
