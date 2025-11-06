using SuperChino.Config;
using SuperChino.Models.OrderItem;

namespace SuperChino.Repositories
{
    public interface IOrderItemRepository : IRepository<OrderItem>
    {

    }
    public class OrderItemRepository : Repository<OrderItem>,IOrderItemRepository
    {
        private readonly ApplicationDbContext _db;

        public OrderItemRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}
