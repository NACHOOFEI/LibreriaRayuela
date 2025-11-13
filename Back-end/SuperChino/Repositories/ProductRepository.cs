using LibreriaOnline.Config;
using LibreriaOnline.Models.Product;

namespace LibreriaOnline.Repositories
{
    public interface IProductRepository : IRepository<Product> { }
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        private readonly ApplicationDbContext _db;
        public ProductRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}
