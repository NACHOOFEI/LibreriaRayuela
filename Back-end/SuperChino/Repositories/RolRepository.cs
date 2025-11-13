using LibreriaOnline.Config;
using LibreriaOnline.Models.Rol;

namespace LibreriaOnline.Repositories
{
    public interface IRolRepository : IRepository<Rol> { }
    public class RolRepository : Repository<Rol> , IRolRepository
    {
        private readonly ApplicationDbContext _db;

        public RolRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
    
}
