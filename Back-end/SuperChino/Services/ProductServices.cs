using AutoMapper;
using SuperChino.Models.Product;
using SuperChino.Models.Product.Dto;
using SuperChino.Repositories;
using SuperChino.Utils;
using System.Net;

namespace SuperChino.Services
{
    public class ProductServices
    {
        private readonly IProductRepository _repo;
        private IMapper _mapper;
        private readonly S3Services _s3;
        public ProductServices(IProductRepository repo, IMapper mapper, S3Services s3)
        {
            _repo = repo;
            _mapper = mapper;
            _s3=s3;
        }

        public async Task<IEnumerable<ProductDTO>> GetAll()
        {
            var products = await _repo.GetAll();
            return products.Select(c => _mapper.Map<ProductDTO>(c));
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
            if(productInsertDTO.Image == null || productInsertDTO.Image.Length == 0)
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest,"Tienes que tener una imagen");
            }
            string imageUrl = await _s3.UploadFileAsync(productInsertDTO.Image);

            var product = _mapper.Map<Product>(productInsertDTO);
            
            product.ImageUrl = imageUrl;

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
                if (productUpdateDTO.Image == null || productUpdateDTO.Image.Length == 0)
                {
                    throw new HttpResponseError(HttpStatusCode.BadRequest, "Tienes que tener una imagen");
                }
                string imageUrl = await _s3.UploadFileAsync(productUpdateDTO.Image);

                product = _mapper.Map<Product>(productUpdateDTO);

                product.ImageUrl = imageUrl;
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
        public async Task RestarStock(int productId, int quantity)
        {
            var product = await _repo.GetOne(p => p.Id == productId)
                ?? throw new Exception("El producto no existe.");

            if (product.Stock < quantity)
                throw new Exception("No hay stock suficiente.");

            product.Stock -= quantity;
            _repo.UpdateOne(product);
            await _repo.Save();
        }
        public async Task SumarStock(int productId, int quantity)
        {
            var product = await _repo.GetOne(p => p.Id == productId)
                ?? throw new Exception("El producto no existe.");

            product.Stock += quantity; // No validar acá

            _repo.UpdateOne(product);
            await _repo.Save();
        }
    }
}
