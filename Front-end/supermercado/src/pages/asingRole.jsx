import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoles } from "../services/authServices";
import Loader from "../components/loader";


export default function AsingRole({ id }) {
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState("");

  // Roles fijos
  const roles = [
    { id: 1, name: "User" },
    { id: 2, name: "Admin" }
  ];

  // Obtenemos el usuario de la lista cacheada
  const users = queryClient.getQueryData(["users"]) || [];
  const currentUser = users.find(u => u.id === Number(id));

  // Mutación para actualizar roles
const mutation = useMutation({
  mutationFn: ({ userId, roleId }) =>
    updateRoles(userId, [roleId]), // <-- directamente un array
  onSuccess: () => {
    queryClient.invalidateQueries(["users"]);
  },
});

  // Si no existe el usuario, mostramos loader
  if (!currentUser) return <Loader />;

  const handleAssign = async () => {
    if (!selectedRole) return alert("Selecciona un rol para asignar");
    try {
      await mutation.mutateAsync({ userId: currentUser.id, roleId: Number(selectedRole) });
      alert("Rol asignado correctamente");
      setSelectedRole(""); // limpiar selección
    } catch (err) {
      alert("Error al asignar rol: " + (err.message || err));
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Asignar Roles</h2>
            <p className="text-sm text-gray-500">
              Usuario: {currentUser.userName} (ID: {currentUser.id})
            </p>
          </div>
          <div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
            >
              Volver
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Roles actuales</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.roles?.length ? (
              currentUser.roles.map((r) => (
                <span
                  key={r.id}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    r.name === "Admin"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {r.name}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">Sin roles asignados</span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asignar nuevo rol
          </label>
          <div className="flex gap-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Selecciona un rol --</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              disabled={mutation.isLoading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-95 disabled:opacity-60"
            >
              {mutation.isLoading ? "Asignando..." : "Asignar"}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Nota: al asignar se enviará el `userId` y el `roleId` al backend.
        </div>
      </div>
    </div>
  );
}
