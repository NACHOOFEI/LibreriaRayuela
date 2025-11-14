using AutoMapper;
using LibreriaOnline.Models.Product;
using LibreriaOnline.Models.Product.Dto;
using LibreriaOnline.Repositories;
using LibreriaOnline.Utils;
using System.Net;

namespace LibreriaOnline.Services
{
    public class ProductServices
    {
        private readonly IProductRepository _repo;
        private IMapper _mapper;
        private readonly ICategoryRepository _categoryRepo;
        private readonly IOrderItemRepository _orderItemRepo;
        private readonly S3Services _s3;
        public ProductServices(IProductRepository repo, IMapper mapper, S3Services s3, ICategoryRepository categoryRepo, IOrderItemRepository orderItemRepository)
        {
            _repo = repo;
            _mapper = mapper;
            _s3 = s3;
            _categoryRepo = categoryRepo;
            _orderItemRepo = orderItemRepository;
        }

        public async Task<IEnumerable<ProductDTO>> GetAll()
        {
            var products = await _repo.GetAll();

            foreach (var product in products)
            {
                if (product.CategoryId != null)
                {
                    var category = await _categoryRepo.GetOne(c => c.Id == product.CategoryId);
                    if (category == null)
                    {
                        throw new HttpResponseError(HttpStatusCode.NotFound, "Categoría no encontrada");
                    }

                    product.Category = category;
                }
            }

            return products.Select(c => _mapper.Map<ProductDTO>(c));
        }
        public async Task<ProductDTO> GetById(int id)
        {
            var product = await _repo.GetOne(c => c.Id == id);
            if (product != null)
            {
                if (product.CategoryId != null)
                {
                    var category = await _categoryRepo.GetOne(c => c.Id == product.CategoryId);
                    if (category == null)
                    {
                        throw new HttpResponseError(HttpStatusCode.NotFound, "Categoría no encontrada");
                    }

                    product.Category = category;
                }

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

            var category = await _categoryRepo.GetOne(c => c.Id == productInsertDTO.CategoryId);
            if (category == null)
            {
                throw new HttpResponseError(HttpStatusCode.NotFound, "Categoría no encontrada");
            }

            // Asignar la categoría de navegación
            product.Category = category;

            await _repo.CreateOne(product);
            await _repo.Save();

            var productDto = _mapper.Map<ProductDTO>(product);
            return productDto;
        }

        public async Task<ProductDTO> UpdateOne(int id, ProductUpdateDTO productUpdateDTO)
        {
            var product = await _repo.GetOne(c => c.Id == id);
            if (product == null)
                return null;

            // Solo subimos imagen si se envía
            if (productUpdateDTO.Image != null && productUpdateDTO.Image.Length > 0)
            {
                string imageUrl = await _s3.UploadFileAsync(productUpdateDTO.Image);
                product.ImageUrl = imageUrl;
            }

            // Mapear los demás campos
            _mapper.Map(productUpdateDTO, product);

            // Asegurar que el precio solo se actualice si viene con valor
            if (productUpdateDTO.Price.HasValue)
            {
                product.Price = productUpdateDTO.Price.Value;
            }

            if (product.CategoryId != null)
            {
                var category = await _categoryRepo.GetOne(c => c.Id == product.CategoryId);
                if (category == null)
                {
                    throw new HttpResponseError(HttpStatusCode.NotFound, "Categoría no encontrada");
                }

                product.Category = category;
            }

            await _repo.UpdateOne(product);
            await _repo.Save();

            return _mapper.Map<ProductDTO>(product);
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

        public async Task<IEnumerable<Product>> GetByIds(List<int> ids)
        {
            return await _repo.GetAll(p => ids.Contains(p.Id));
        }

        public async Task<Product> GetByOrderItemId(int orderItemId)
        {
            var orderItem = await _orderItemRepo.GetOne(oi => oi.Id == orderItemId);
            var product = await _repo.GetOne(p => p.Id == orderItem.ProductId);
            return product;
        }
    }
}
