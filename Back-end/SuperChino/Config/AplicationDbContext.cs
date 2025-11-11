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
        public DbSet<RolUser> RolUsers { get; set; }
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
            modelBuilder.Entity<RolUser>()
    .HasKey(ru => new { ru.UserId, ru.RolId });


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
                    Password = "$2b$13$W1O.Zf5bmG91EqOi1CKXi.hTCLbaAMaUyAW/qzMTMV7/0QDgnh4QS"
                },
                new User
                {
                    Id = 2,
                    Username = "azul",
                    Email = "azul@gmail.com",
                    Password = "$2b$13$8oRm86j0GyQpTcSzsSCd4OfNwisqqqi3lJBocBALR4QnFBjQGRneq"
                },
                new User
                {
                    Id = 3,
                    Username = "nacho",
                    Email = "nacho@gmail.com",
                    Password = "$2b$13$rWB6p/FCtu/IQ2tZmhAWaOk0aH33Exn8LUuMLq2ASbgZORO.EwAZi"
                },
                new User
                {
                    Id = 4,
                    Username = "lolo",
                    Email = "lolo@gmail.com",
                    Password = "$2b$13$OH9dbbOwvOdRHOj0C.vO0e2n6rHYNWsDqmp59QzwC124/vrJff1rq"
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