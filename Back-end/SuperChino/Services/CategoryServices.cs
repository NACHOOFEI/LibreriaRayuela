using AutoMapper;
using SuperChino.Models.Category;
using SuperChino.Models.Category.Dto;
using SuperChino.Repositories;

namespace SuperChino.Services
{
    public class CategoryServices
    {
        private readonly ICategoryRepository _repo;
        private IMapper _mapper;
        public CategoryServices(ICategoryRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CategoryDTO>> GetAll()
        {
            var categories = await _repo.GetAll();
            return categories.Select(c => _mapper.Map<CategoryDTO>(c));
        }
        public async Task<CategoryDTO> GetById(int id)
        {
            var category = await _repo.GetOne(c => c.Id == id);
            if (category != null)
            {
                var categoryDto = _mapper.Map<CategoryDTO>(category);
                return categoryDto;
            }
            return null;
        }
        public async Task<CategoryDTO> CreateOne(CategoryInsertDTO categoryInsertDTO)
        {
            var category = _mapper.Map<Category>(categoryInsertDTO);

            await _repo.CreateOne(category);
            await _repo.Save();

            var categoryDto = _mapper.Map<CategoryDTO>(category);
            return categoryDto;
        }

        public async Task<CategoryDTO> UpdateOne(int id, CategoryUpdateDTO categoryUpdateDTO)
        {
            var category = await _repo.GetOne(c => c.Id == id);
            if (category != null)
            {
                category = _mapper.Map<CategoryUpdateDTO, Category>(categoryUpdateDTO, category);
            
                _repo.UpdateOne(category);
                await _repo.Save();
            
                var categoryDto = _mapper.Map<CategoryDTO>(category);
                return categoryDto;
            }
            return null;
        }

        public async Task<CategoryDTO> DeleteOne(int id)
        {
            var category = await _repo.GetOne(c => c.Id == id);
            if (category != null)
            {
                _repo.DeleteOne(category);
                await _repo.Save();

                var categoryDto = _mapper.Map<CategoryDTO>(category);
                return categoryDto;
            }
            return null;
        }
    }
}
