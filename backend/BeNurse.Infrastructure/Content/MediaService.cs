using BeNurse.Application.Interfaces;
using BeNurse.Domain.Entities;
using BeNurse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BeNurse.Infrastructure.Content;

public class MediaService : IMediaService
{
    private readonly BeNurseDbContext _context;

    public MediaService(BeNurseDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> SaveAsync(string fileName, string contentType, byte[] data, CancellationToken ct = default)
    {
        var asset = new MediaAsset
        {
            Id = Guid.NewGuid(),
            FileName = fileName,
            ContentType = contentType,
            Data = data,
            CreatedAt = DateTime.UtcNow
        };

        _context.MediaAssets.Add(asset);
        await _context.SaveChangesAsync(ct);

        return asset.Id;
    }

    public async Task<(byte[] Data, string ContentType)?> GetAsync(Guid id, CancellationToken ct = default)
    {
        var asset = await _context.MediaAssets
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id, ct);

        return asset is null ? null : (asset.Data, asset.ContentType);
    }
}
