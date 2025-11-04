using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using SuperChino.Models.Category;
using SuperChino.Models.Customer;
using SuperChino.Models.Product;
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
        public DbSet<Product> products { get; set; }
        public DbSet<Customer> customers { get; set; }
        public DbSet<Category> categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(X => X.Email).IsUnique();
            modelBuilder.Entity<User>()
                .HasMany(x => x.Roles)
                .WithMany()
                .UsingEntity<RolUser>(
                l => l.HasOne<Rol>().WithMany().HasForeignKey(x => x.RolId),
                r => r.HasOne<User>().WithMany().HasForeignKey(x => x.UserId)
                );
        }

    }
}
