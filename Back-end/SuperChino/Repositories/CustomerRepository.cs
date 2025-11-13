using Microsoft.EntityFrameworkCore;
using LibreriaOnline.Config;
using LibreriaOnline.Models.Customer;
using LibreriaOnline.Models.Customer.Dto;
using System.Linq.Expressions;

namespace LibreriaOnline.Repositories
{
    public interface ICustomerRepository : IRepository<Customer>
    {
        Task<Customer?> GetByUserIdAsync(int userId);
    }
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        private readonly ApplicationDbContext _db;

        public CustomerRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<Customer?> GetByUserIdAsync(int userId)
        {
            return await dbSet
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }
    }

}
