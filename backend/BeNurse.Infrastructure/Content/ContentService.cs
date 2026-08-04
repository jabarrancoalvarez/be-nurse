using System.Text.Json;
using BeNurse.Application.DTOs;
using BeNurse.Application.Interfaces;
using BeNurse.Domain.Entities;
using BeNurse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BeNurse.Infrastructure.Content;

public class ContentService : IContentService
{
    private readonly BeNurseDbContext _context;

    public ContentService(BeNurseDbContext context)
    {
        _context = context;
    }

    public async Task<PageContentDto> GetByPrefixAsync(string prefix, CancellationToken ct = default)
    {
        var result = new PageContentDto();

        var blocks = await _context.ContentBlocks
            .Where(b => b.Key.StartsWith(prefix))
            .AsNoTracking()
            .ToListAsync(ct);

        foreach (var block in blocks)
        {
            result.Blocks[block.Key] = new ContentBlockDto { Type = block.Type, Value = block.Value };
        }

        var groups = await _context.ContentGroups
            .Where(g => g.Key.StartsWith(prefix))
            .Include(g => g.Cards)
            .AsNoTracking()
            .ToListAsync(ct);

        foreach (var group in groups)
        {
            result.Groups[group.Key] = group.Cards
                .OrderBy(c => c.Position)
                .Select(ToDto)
                .ToList();
        }

        return result;
    }

    public async Task SaveBlockAsync(string key, ContentBlockDto dto, CancellationToken ct = default)
    {
        var block = await _context.ContentBlocks.FirstOrDefaultAsync(b => b.Key == key, ct);

        if (block is null)
        {
            block = new ContentBlock { Key = key };
            _context.ContentBlocks.Add(block);
        }

        block.Type = dto.Type;
        block.Value = dto.Value;
        block.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
    }

    public async Task<bool> ResetBlockAsync(string key, CancellationToken ct = default)
    {
        var block = await _context.ContentBlocks.FirstOrDefaultAsync(b => b.Key == key, ct);
        if (block is null) return false;

        _context.ContentBlocks.Remove(block);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<ContentCardDto>> SaveGroupAsync(string groupKey, ContentGroupDto dto, CancellationToken ct = default)
    {
        var group = await _context.ContentGroups
            .Include(g => g.Cards)
            .FirstOrDefaultAsync(g => g.Key == groupKey, ct);

        if (group is null)
        {
            group = new ContentGroup { Key = groupKey };
            _context.ContentGroups.Add(group);
        }
        else
        {
            _context.ContentCards.RemoveRange(group.Cards);
            group.Cards.Clear();
        }

        group.UpdatedAt = DateTime.UtcNow;

        var position = 0;
        foreach (var card in dto.Cards)
        {
            group.Cards.Add(new ContentCard
            {
                Position = position++,
                Title = card.Title,
                Body = card.Body,
                ItemsJson = JsonSerializer.Serialize(card.Items),
                FieldsJson = JsonSerializer.Serialize(card.Fields),
                Image = card.Image,
                Badge = card.Badge
            });
        }

        await _context.SaveChangesAsync(ct);

        return group.Cards.OrderBy(c => c.Position).Select(ToDto).ToList();
    }

    public async Task<bool> ResetGroupAsync(string groupKey, CancellationToken ct = default)
    {
        var group = await _context.ContentGroups
            .Include(g => g.Cards)
            .FirstOrDefaultAsync(g => g.Key == groupKey, ct);

        if (group is null) return false;

        _context.ContentGroups.Remove(group);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    private static ContentCardDto ToDto(ContentCard card) => new()
    {
        Id = card.Id,
        Title = card.Title,
        Body = card.Body,
        Items = Deserialize<List<string>>(card.ItemsJson) ?? [],
        Fields = Deserialize<Dictionary<string, string>>(card.FieldsJson) ?? [],
        Image = card.Image,
        Badge = card.Badge
    };

    private static T? Deserialize<T>(string json) where T : class
    {
        if (string.IsNullOrWhiteSpace(json)) return null;

        try
        {
            return JsonSerializer.Deserialize<T>(json);
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
