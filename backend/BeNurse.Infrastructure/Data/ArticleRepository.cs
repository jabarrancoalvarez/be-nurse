using BeNurse.Application.Interfaces;
using BeNurse.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BeNurse.Infrastructure.Data;

public class ArticleRepository : IArticleRepository
{
    private readonly BeNurseDbContext _context;

    public ArticleRepository(BeNurseDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Article>> GetAllPublishedAsync() =>
        await _context.Articles
            .Where(a => a.IsPublished)
            .OrderByDescending(a => a.PublishedAt)
            .ToListAsync();

    public async Task<Article?> GetBySlugAsync(string slug) =>
        await _context.Articles
            .FirstOrDefaultAsync(a => a.Slug == slug && a.IsPublished);

    public async Task<IEnumerable<Article>> GetByCategoryAsync(string category) =>
        await _context.Articles
            .Where(a => a.Category == category && a.IsPublished)
            .OrderByDescending(a => a.PublishedAt)
            .ToListAsync();
}
