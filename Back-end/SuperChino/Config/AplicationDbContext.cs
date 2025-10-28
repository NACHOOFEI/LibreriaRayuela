using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using SuperChino.Models.Category;
using SuperChino.Models.Rol;
using SuperChino.Models.User;

namespace SuperChino.Config
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }

        public DbSet<User> users { get; set; } 
        public DbSet<Rol> roles { get; set; }

        public DbSet<Category> categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(X => X.Email).IsUnique();
            modelBuilder.Entity<User>()
                .HasMany(x => x.Roles)
                .WithMany()
                .UsingEntity<RolUser>(
                r => r.HasOne<Rol>().WithMany().HasForeignKey(x => x.RolId),
                u => u.HasOne<User>().WithMany().HasForeignKey(x => x.UserId)
                );
        }

    }
}
