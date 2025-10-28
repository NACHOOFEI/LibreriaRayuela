using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using SuperChino.Models.Rol;
using SuperChino.Models.User;

namespace SuperChino.Config
{
    public class AplicationDnContext : DbContext
    {
        public AplicationDnContext(DbContextOptions<AplicationDnContext> options) : base(options)
        {
            
        }

        public DbSet<User> users { get; set; } 
        public DbSet<Rol> roles { get; set; }

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
