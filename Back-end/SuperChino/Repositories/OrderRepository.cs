using LibreriaOnline.Config;
using LibreriaOnline.Models.Order;

namespace LibreriaOnline.Repositories
{
    public interface IOrderRepository : IRepository<Order> { }
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        private readonly ApplicationDbContext _db;
        public OrderRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}
