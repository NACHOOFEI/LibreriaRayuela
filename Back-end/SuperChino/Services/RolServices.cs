using SuperChino.Models.Rol;
using SuperChino.Repositories;
using SuperChino.Utils;
using System.Net;

namespace SuperChino.Services
{
    public class RolServices
    {
        private readonly IRepository _repo;

        public RolServices(IRepository repo)
        {
            _repo = repo;
        }


        async public Task<Rol> GetOneByName(string name)
        {
            var rol = await _repo.GetOne(r => r.Name == name);
            return rol;
        }

        async public Task<List<Rol>> GetManyById(List<int> idsRol)
        {
            if (idsRol.Count == 0 || idsRol == null)
            {
                throw new HttpResponseError( HttpStatusCode.BadRequest, "por lo menos debe ingresar un id");
            }
            var rols = await _repo.GetAll(r => idsRol.Contains(r.id));
            if (rols.ToList().count > 0)
            {
                return rols.ToList();
            }
            throw new HttpResponseError(HttpStatusCode.BadRequest, "nunguno de los ids que ingreso coincide");
         
        }
    }
}
