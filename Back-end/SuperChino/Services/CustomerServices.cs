using AutoMapper;
using LibreriaOnline.Models.Customer;
using LibreriaOnline.Models.Customer.Dto;
using LibreriaOnline.Models.User;
using LibreriaOnline.Repositories;

namespace LibreriaOnline.Services
{
    public class CustomerServices
    {
        private readonly ICustomerRepository _repo;
        private IMapper _mapper;
       
        public CustomerServices(ICustomerRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
          
        }

        public async Task<IEnumerable<CustomerDTO>> GetAll()
        {
            var categories = await _repo.GetAll();
            return categories.Select(c => _mapper.Map<CustomerDTO>(c));
        }
        public async Task<CustomerDTO> GetById(int id)
        {
            var customer = await _repo.GetOne(c => c.Id == id);
            if (customer != null)
            {
                var customerDto = _mapper.Map<CustomerDTO>(customer);
                return customerDto;
            }
            return null;
        }
        public async Task<CustomerDTO> CreateOne(CustomerInsertDTO customerInsertDTO)
        {
            var existingCustomer = await _repo.GetByUserIdAsync(customerInsertDTO.UserId);

            if (existingCustomer != null)
            {
                return _mapper.Map<CustomerDTO>(existingCustomer);
            }

            var customer = _mapper.Map<Customer>(customerInsertDTO);

            await _repo.CreateOne(customer);
            await _repo.Save();

            return _mapper.Map<CustomerDTO>(customer);
        }

        public async Task<CustomerDTO> UpdateOne(int id, CustomerUpdateDTO customerUpdateDTO)
        {
            var customer = await _repo.GetOne(c => c.Id == id);
            if (customer != null)
            {
                customer = _mapper.Map<CustomerUpdateDTO, Customer>(customerUpdateDTO, customer);

                _repo.UpdateOne(customer);
                await _repo.Save();

                var customerDto = _mapper.Map<CustomerDTO>(customer);
                return customerDto;
            }
            return null;
        }

        public async Task<CustomerDTO> DeleteOne(int id)
        {
            var customer = await _repo.GetOne(c => c.Id == id);
            if (customer != null)
            {
                _repo.DeleteOne(customer);
                await _repo.Save();

                var customerDto = _mapper.Map<CustomerDTO>(customer);
                return customerDto;
            }
            return null;
        }
    }
}
