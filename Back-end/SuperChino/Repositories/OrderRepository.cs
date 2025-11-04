using SuperChino.Config;
using SuperChino.Models.Order;

namespace SuperChino.Repositories
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
