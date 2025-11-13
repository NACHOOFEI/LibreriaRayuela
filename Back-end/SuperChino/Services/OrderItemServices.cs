using AutoMapper;
using LibreriaOnline.Models.OrderItem;
using LibreriaOnline.Models.OrderItem.Dto;
using LibreriaOnline.Models.Product;
using LibreriaOnline.Models.Product.Dto;
using LibreriaOnline.Repositories;

namespace LibreriaOnline.Services
{

    public class OrderItemServices 
    {
        private readonly IOrderItemRepository _repo;
        private readonly IProductRepository _productRepository;
        private IMapper _mapper;
        private readonly ProductServices _products;
        public OrderItemServices(IOrderItemRepository repo, IMapper mapper, IProductRepository productRepository, ProductServices products)
        {
            _repo = repo;
            _mapper = mapper;
            _productRepository = productRepository;
            _products=products;
        }

        //public async Task<IEnumerable<OrderItemDTO>> GetAll()
        //{
        //    var categories = await _repo.GetAll();
        //    return categories.Select(c => _mapper.Map<OrderItemDTO>(c));
        //}
        //public async Task<OrderItemDTO> GetById(int id)
        //{
        //    var orderItem = await _repo.GetOne(c => c.Id == id);
        //    if (orderItem != null)
        //    {
        //        var orderItemDto = _mapper.Map<OrderItemDTO>(orderItem);
        //        return orderItemDto;
        //    }
        //    return null;
        //}
        public async Task<OrderItemDTO> CreateOne(OrderItemInsertDTO orderItemInsertDto, int orderId)
        {
            var product = await _productRepository.GetOne(p => p.Id == orderItemInsertDto.ProductId)
                ?? throw new Exception("El producto especificado no existe.");

            if (orderItemInsertDto.Quantity <= 0)
                throw new Exception("La cantidad debe ser mayor a 0.");

            if (product.Stock < orderItemInsertDto.Quantity)
                throw new Exception("No hay stock suficiente.");


            var orderItem = _mapper.Map<OrderItem>(orderItemInsertDto);

            
            orderItem.OrderId = orderId;
            orderItem.UnitPrice = product.Price;
            orderItem.Subtotal = orderItem.UnitPrice * orderItem.Quantity;

            await _products.RestarStock(orderItem.ProductId, orderItem.Quantity);
            await _repo.CreateOne(orderItem);
            await _repo.Save();
            return _mapper.Map<OrderItemDTO>(orderItem);
        }


        public async Task<OrderItemDTO> DeleteOne(int id)
        {
            var orderItem = await _repo.GetOne(c => c.Id == id);
            if (orderItem != null)
            {
                _repo.DeleteOne(orderItem);
                await _repo.Save();

                var orderItemDto = _mapper.Map<OrderItemDTO>(orderItem);
                return orderItemDto;
            }
            return null;
        }

        //public async Task<OrderItemDTO> UpdateOne(int id, OrderItemUpdateDTO orderItemUpdateDTO)
        //{
        //    var orderItem = await _repo.GetOne(c => c.Id == id);
        //    if (orderItem != null)
        //    {
        //        orderItem = _mapper.Map<OrderItemUpdateDTO, OrderItem>(orderItemUpdateDTO, orderItem);

        //        orderItem.Subtotal = orderItem.UnitPrice * orderItem.Quantity;

        //        _repo.UpdateOne(orderItem);
        //        await _repo.Save();
        //        var orderItemDto = _mapper.Map<OrderItemDTO>(orderItem);
        //        return orderItemDto;
        //    }
        //    return null;
        //}
    }
}
