using AutoMapper;
using SuperChino.Models.Product;
using SuperChino.Models.Product.Dto;
using SuperChino.Repositories;

namespace SuperChino.Services
{
    public class ProductServices
    {
        private readonly IProductRepository _repo;
        private IMapper _mapper;
        public ProductServices(IProductRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductDTO>> GetAll()
        {
            var categories = await _repo.GetAll();
            return categories.Select(c => _mapper.Map<ProductDTO>(c));
        }
        public async Task<ProductDTO> GetById(int id)
        {
            var product = await _repo.GetOne(c => c.Id == id);
            if (product != null)
            {
                var productDto = _mapper.Map<ProductDTO>(product);
                return productDto;
            }
            return null;
        }
        public async Task<ProductDTO> CreateOne(ProductInsertDTO productInsertDTO)
        {
            var product = _mapper.Map<Product>(productInsertDTO);

            await _repo.CreateOne(product);
            await _repo.Save();

            var productDto = _mapper.Map<ProductDTO>(product);
            return productDto;
        }

        public async Task<ProductDTO> UpdateOne(int id, ProductUpdateDTO productUpdateDTO)
        {
            var product = await _repo.GetOne(c => c.Id == id);
            if (product != null)
            {
                product = _mapper.Map<ProductUpdateDTO, Product>(productUpdateDTO, product);

                _repo.UpdateOne(product);
                await _repo.Save();

                var productDto = _mapper.Map<ProductDTO>(product);
                return productDto;
            }
            return null;
        }

        public async Task<ProductDTO> DeleteOne(int id)
        {
            var product = await _repo.GetOne(c => c.Id == id);
            if (product != null)
            {
                _repo.DeleteOne(product);
                await _repo.Save();

                var productDto = _mapper.Map<ProductDTO>(product);
                return productDto;
            }
            return null;
        }
    }
}
