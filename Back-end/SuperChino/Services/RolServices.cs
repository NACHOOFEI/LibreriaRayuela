using SuperChino.Models.Rol;
using SuperChino.Repositories;
using SuperChino.Utils;
using System.Net;

namespace SuperChino.Services
{
    public class RolServices
    {
        private readonly IRolRepository _repo;

        public RolServices(IRolRepository repo)
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
                throw new HttpResponseError( HttpStatusCode.BadRequest, "Por lo menos debe ingresar un Id");
            }
            var rols = await _repo.GetAll(r => idsRol.Contains(r.Id));
            if (rols.ToList().Count > 0)
            {
                return rols.ToList();
            }
            throw new HttpResponseError(HttpStatusCode.BadRequest, "Ninguno de los Ids que ingresó coincide");
         
        }
    }
}
