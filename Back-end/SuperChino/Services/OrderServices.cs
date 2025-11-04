using AutoMapper;
using SuperChino.Models.Order;
using SuperChino.Models.Order.Dto;
using SuperChino.Models.OrderItem;
using SuperChino.Repositories;

namespace SuperChino.Services
{
    public class OrderServices
    {
        private readonly IOrderRepository _repo;
        private readonly ICustomerRepository _customerRepository;
        private readonly IOrderItemService _orderItemService;

        private IMapper _mapper;
        public OrderServices(IOrderRepository repo, IMapper mapper, ICustomerRepository customerRepository, IOrderItemService orderItemService)
        {
            _repo = repo;
            _mapper = mapper;
            _customerRepository = customerRepository;
            _orderItemService = orderItemService;
        }

        public async Task<IEnumerable<OrderDTO>> GetAll()
        {
            var orders = await _repo.GetAll();
            return orders.Select(c => _mapper.Map<OrderDTO>(c));
        }
        public async Task<OrderDTO> GetById(int id)
        {
            var order = await _repo.GetOne(c => c.Id == id);
            if (order != null)
            {
                var orderDto = _mapper.Map<OrderDTO>(order);
                return orderDto;
            }
            return null;
        }
        public async Task<OrderDTO> CreateOne(OrderInsertDTO orderInsertDTO)
        {
            var customer = await _customerRepository.GetOne(c => c.Id == orderInsertDTO.CustomerId);

            if (customer == null)
            {
                throw new Exception("El cliente especificado no existe.");
            }

            var order = _mapper.Map<Order>(orderInsertDTO);

            foreach (var itemDto in orderInsertDTO.Items)
            {
                var orderItem = await _orderItemService.CreateOne(itemDto);
                order.Items.Add(_mapper.Map<OrderItem>(orderItem));
            }

            order.OrderDate = DateTime.UtcNow;
            order.Total = order.Items.Sum(i => i.Subtotal);

            await _repo.CreateOne(order);
            await _repo.Save();

            var orderDto = _mapper.Map<OrderDTO>(order);
            return orderDto;
        }



        public async Task<OrderDTO> DeleteOne(int id)
        {
            var order = await _repo.GetOne(c => c.Id == id);
            if (order != null)
            {
                _repo.DeleteOne(order);
                await _repo.Save();

                var orderDto = _mapper.Map<OrderDTO>(order);
                return orderDto;
            }
            return null;
        }
    }
}
