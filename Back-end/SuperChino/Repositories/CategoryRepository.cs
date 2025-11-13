using LibreriaOnline.Config;
using LibreriaOnline.Models.Category;

namespace LibreriaOnline.Repositories
{
    public interface ICategoryRepository : IRepository<Category> { }
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        private readonly ApplicationDbContext _db;
        public CategoryRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}

