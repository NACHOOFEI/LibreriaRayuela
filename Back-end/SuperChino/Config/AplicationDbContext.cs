using Microsoft.EntityFrameworkCore;
using SuperChino.Enums;
using SuperChino.Models.Category;
using SuperChino.Models.Customer;
using SuperChino.Models.Order;
using SuperChino.Models.OrderItem;
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

        public DbSet<User> Users { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
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


            modelBuilder.Entity<Order>()
                .HasMany(o => o.Items)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seeding de roles
            modelBuilder.Entity<Rol>().HasData(
                new Rol { Id = 1, Name = ROL.USER },
                new Rol { Id = 2, Name = ROL.ADMIN }
            );

        }

    }
}