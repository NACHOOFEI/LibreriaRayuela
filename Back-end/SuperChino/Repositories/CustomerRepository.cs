using SuperChino.Config;
using SuperChino.Models.Customer;

namespace SuperChino.Repositories
{
    public interface ICustomerRepository : IRepository<Customer> { }
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        private readonly ApplicationDbContext _db;
        public CustomerRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}
