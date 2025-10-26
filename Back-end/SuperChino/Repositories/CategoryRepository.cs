using SuperChino.Config;
using SuperChino.Models.Category;

namespace SuperChino.Repositories
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

