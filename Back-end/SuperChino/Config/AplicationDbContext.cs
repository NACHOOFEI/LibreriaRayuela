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

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Policial", Description = "Historias de crímenes, detectives y misterios por resolver." },
                new Category { Id = 2, Name = "Romance", Description = "Relatos centrados en relaciones amorosas y emociones intensas." },
                new Category { Id = 3, Name = "Ciencia Ficción", Description = "Narraciones basadas en avances científicos o mundos futuristas." },
                new Category { Id = 4, Name = "Fantasía", Description = "Historias ambientadas en mundos imaginarios con elementos mágicos." },
                new Category { Id = 5, Name = "Terror", Description = "Relatos diseñados para provocar miedo, suspenso o inquietud." },
                new Category { Id = 6, Name = "Aventura", Description = "Cuentos de exploración, acción y viajes llenos de desafíos." },
                new Category { Id = 7, Name = "Drama", Description = "Narraciones realistas que exploran conflictos humanos y emocionales." },
                new Category { Id = 8, Name = "Histórico", Description = "Obras ambientadas en épocas pasadas con contexto histórico real." },
                new Category { Id = 9, Name = "Biografía", Description = "Historias basadas en la vida real de personajes destacados." },
                new Category { Id = 10, Name = "Comedia", Description = "Relatos ligeros y humorísticos que buscan entretener al lector." },
                new Category { Id = 11, Name = "Suspenso", Description = "Tramas llenas de tensión, incertidumbre y giros inesperados." },
                new Category { Id = 12, Name = "Infantil", Description = "Cuentos y relatos pensados para niños, con moralejas y fantasía." },
                new Category { Id = 13, Name = "Poesía", Description = "Obras escritas en verso que expresan emociones, ideas y belleza." },
                new Category { Id = 14, Name = "Autoayuda", Description = "Libros orientados al crecimiento personal y la superación individual." },
                new Category { Id = 15, Name = "Ensayo", Description = "Textos que analizan o reflexionan sobre temas filosóficos o sociales." }
            );
        }

    }
}