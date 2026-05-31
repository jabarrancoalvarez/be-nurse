using BeNurse.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BeNurse.Infrastructure.Data;

public class BeNurseDbContext : DbContext
{
    public BeNurseDbContext(DbContextOptions<BeNurseDbContext> options) : base(options) { }

    public DbSet<Article> Articles => Set<Article>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<ContactForm> ContactForms => Set<ContactForm>();

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
    }
}
