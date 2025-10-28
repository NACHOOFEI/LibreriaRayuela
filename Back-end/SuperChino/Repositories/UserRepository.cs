using SuperChino.Config;
using SuperChino.Models.User;

namespace SuperChino.Repositories
{
    public interface IUserRepository : IRepository<User>{}
    public class UserRepository : Repository<User> , IUserRepository
    {
        private readonly ApplicationDbContext _db;

        public UserRepository(ApplicationDbContext db) : base(db) 
        {
            _db = db;
        }
    }
}
