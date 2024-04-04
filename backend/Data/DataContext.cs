namespace backend.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
public class DataContext : IdentityDbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) {}
    public DbSet<Note>? Note { get; set; }
    public DbSet<Category>? Category { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Note>().HasIndex(n => n.Id).IsUnique();
        modelBuilder.Entity<Category>().HasIndex(cat => cat.Id).IsUnique();
    }
}