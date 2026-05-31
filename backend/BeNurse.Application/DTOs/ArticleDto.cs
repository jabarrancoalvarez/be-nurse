namespace BeNurse.Application.DTOs;

public class ArticleDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string SubCategory { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public DateTime PublishedAt { get; set; }
    public bool IsPublished { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}
