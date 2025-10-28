using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Identity.Client;
using SuperChino.Config;
using System.Data.SqlTypes;
using System.Linq.Expressions;

namespace SuperChino.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAll(Expression<Func<T, bool>>? filter = null);
        Task<T> GetOne(Expression<Func<T, bool>>? filter = null);
        Task CreateOne(T entity);
        Task UpdateOne(T entity);
        Task DeleteOne(T entity);
        Task Save();
    }

    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly AplicationDnContext _db;
        internal DbSet<T> dbSet;

        public Repository(AplicationDnContext db) 
        {
            _db = db;
            dbSet = _db.Set<T>();

        }

        async public Task CreateOne(T entity)
        {
            await dbSet.AddAsync(entity);
            await Save();
        }

        async public Task DeleteOne(T entity)
        {
            dbSet.Remove(entity);
            await Save();
        }
        async public Task UpdateOne(T entity)
        {
            dbSet.Update(entity);
            await Save();
        }

        async public Task<IEnumerable<T>> GetAll(Expression<Func<T, bool>>? filter = null)
        {
            IQueryable<T> query = dbSet;
            if (filter != null)
            {
                query = query.Where(filter);
            }

            return await query.ToListAsync();
        }

        // Corrección de la firma del método GetOne para solucionar CS1003 y CS8625
        async public Task<T> GetOne(Expression<Func<T, bool>>? filter = null)
        {
            IQueryable<T> query = dbSet;
            if (filter != null)
            {
                query = query.Where(filter);
            }
            return await query.FirstOrDefaultAsync();
        }


        async public Task Save()
        {
            await _db.SaveChangesAsync();
        }
    }
}
