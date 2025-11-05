using SuperChino.Config;
using SuperChino.Models.OrderItem;

namespace SuperChino.Repositories
{
    public interface IOrderItems : IRepository<OrderItem>
    {

    }
    public class OrderItemRepository : Repository<OrderItem>,IOrderItems
    {
        private readonly ApplicationDbContext _db;

        public OrderItemRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}
