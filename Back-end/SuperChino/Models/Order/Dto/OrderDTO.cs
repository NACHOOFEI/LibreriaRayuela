using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SuperChino.Models.Order.Dto
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public Customer.Customer Customer { get; set; }
        public ICollection<OrderItem.OrderItem> Items { get; set; }
        public decimal Total { get; set; }
    }
}
