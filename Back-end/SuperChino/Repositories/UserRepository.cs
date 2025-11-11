using Microsoft.EntityFrameworkCore;
using SuperChino.Config;
using SuperChino.Models.User;
using System.Linq.Expressions;

namespace SuperChino.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetOneWithRoles(Expression<Func<User, bool>> filter);
    }
    public class UserRepository : Repository<User> , IUserRepository
    {
        private readonly ApplicationDbContext _db;

        public UserRepository(ApplicationDbContext db) : base(db) 
        {
            _db = db;
        }
        public async Task<User> GetOneWithRoles(Expression<Func<User, bool>> filter)
        {
            return await _db.Users
                            .Include(u => u.Roles) 
                            .FirstOrDefaultAsync(filter);
        }
    }
}
