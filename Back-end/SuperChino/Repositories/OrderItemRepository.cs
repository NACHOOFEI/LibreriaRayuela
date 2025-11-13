using LibreriaOnline.Config;
using LibreriaOnline.Models.OrderItem;
using LibreriaOnline.Models.OrderItem.Dto;

namespace LibreriaOnline.Repositories
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
