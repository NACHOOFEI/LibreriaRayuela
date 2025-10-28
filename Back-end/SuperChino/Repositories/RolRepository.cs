using SuperChino.Config;
using SuperChino.Models.Rol;

namespace SuperChino.Repositories
{
    public interface IrolRepository : IRepository<Rol> { }
    public class RolRepository : Repository<Rol> , IrolRepository
    {
        private readonly AplicationDnContext _db;

        public RolRepository(AplicationDnContext db) : base(db)
        {
            _db = db;
        }
    }
    
}
