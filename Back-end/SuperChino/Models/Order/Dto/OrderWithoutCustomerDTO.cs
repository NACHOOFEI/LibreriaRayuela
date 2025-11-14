using LibreriaOnline.Models.OrderItem.Dto;

namespace LibreriaOnline.Models.Order.Dto
{
    public class OrderWithoutCustomerDTO
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public IEnumerable<OrderItemDTO> Items { get; set; }
        public decimal Total { get; set; }
    }
}
