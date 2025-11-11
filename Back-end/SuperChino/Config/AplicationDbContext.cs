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

            // Seeding de datos

            modelBuilder.Entity<Rol>().HasData(
                new Rol { Id = 1, Name = ROL.USER },
                new Rol { Id = 2, Name = ROL.ADMIN }
            );

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@gmail.com",
                    // hashea la contraseña "admin123"
                    Password = BCrypt.Net.BCrypt.HashPassword("admin123")
                },
                new User
                {
                    Id = 2,
                    Username = "azul",
                    Email = "azul@gmail.com",
                    Password = BCrypt.Net.BCrypt.HashPassword("azul123")
                },
                new User
                {
                    Id = 3,
                    Username = "nacho",
                    Email = "nacho@gmail.com",
                    Password = BCrypt.Net.BCrypt.HashPassword("nacho123")
                },
                new User
                {
                    Id = 4,
                    Username = "lolo",
                    Email = "lolo@gmail.com",
                    Password = BCrypt.Net.BCrypt.HashPassword("lolo123")
                }
            );

            modelBuilder.Entity<RolUser>().HasData(
                new RolUser { UserId = 1, RolId = 2 },
                new RolUser { UserId = 2, RolId = 1 },
                new RolUser { UserId = 3, RolId = 1 },
                new RolUser { UserId = 4, RolId = 1 }
            );


        }

    }
}