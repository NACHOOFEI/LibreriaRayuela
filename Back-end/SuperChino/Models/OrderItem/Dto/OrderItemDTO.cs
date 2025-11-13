namespace LibreriaOnline.Models.OrderItem.Dto
{
    public class OrderItemDTO
    {
        public int Id { get; set; }
        public Product.Product Product { get; set; }
        public int Quantity { get; set; }
    }
}
