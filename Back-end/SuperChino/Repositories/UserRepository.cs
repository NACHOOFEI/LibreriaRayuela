using SuperChino.Config;
using SuperChino.Models.User;

namespace SuperChino.Repositories
{
    public interface IUserRepository : IRepository<User>{}
    public class UserRepository : Repository<User> , IUserRepository
    {
        private readonly AplicationDnContext _db;

        public UserRepository(AplicationDnContext db) : base(db) 
        {
            _db = db;
        }
    }
}
