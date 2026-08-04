using BeNurse.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BeNurse.Infrastructure.Data;

public class BeNurseDbContext : DbContext
{
    public BeNurseDbContext(DbContextOptions<BeNurseDbContext> options) : base(options) { }

    public DbSet<Article> Articles => Set<Article>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<ContactForm> ContactForms => Set<ContactForm>();
    public DbSet<ContentBlock> ContentBlocks => Set<ContentBlock>();
    public DbSet<ContentGroup> ContentGroups => Set<ContentGroup>();
    public DbSet<ContentCard> ContentCards => Set<ContentCard>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
        });

        modelBuilder.Entity<ChatMessage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.SessionId);
            entity.Property(e => e.SessionId).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Content).IsRequired();
        });

        modelBuilder.Entity<ContactForm>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
        });

        modelBuilder.Entity<ContentBlock>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Key).IsUnique();
            entity.Property(e => e.Key).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
        });

        modelBuilder.Entity<ContentGroup>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Key).IsUnique();
            entity.Property(e => e.Key).IsRequired().HasMaxLength(200);
            entity.HasMany(e => e.Cards)
                  .WithOne()
                  .HasForeignKey(c => c.ContentGroupId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ContentCard>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ContentGroupId, e.Position });
        });

        modelBuilder.Entity<MediaAsset>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ContentType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FileName).HasMaxLength(300);
        });
    }
}
