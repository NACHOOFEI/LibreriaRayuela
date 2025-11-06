import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api/api";
import { useAuthStore } from "../store/authStore";

const elementoSchema = z.object({
  title: z.string().min(3),
  price: z.number().min(0.01),
  description: z.string().min(10),
  category: z.string().min(1),
  stock: z.number().int().min(0),
});

export default function AdminPanel() {
  const { user } = useAuthStore();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: zodResolver(elementoSchema) });

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/products");
      setProductos(res.data || []);
    } catch (error) {
      console.error("Error cargando productos:", error);
      const mensaje = error.response?.data?.message || error.message;
      alert("Error cargando productos: " + mensaje);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/api/products/${editingId}`, data);
      } else {
        await api.post("/api/products", data);
      }
      // Recargar productos para tener la lista actualizada
      await loadProductos();
      reset();
      setShowForm(false);
      setEditingId(null);
      alert(
        editingId
          ? "Producto actualizado con éxito"
          : "Producto creado con éxito"
      );
    } catch (error) {
      console.error("Error al guardar producto:", error);
      const mensaje = error.response?.data?.message || error.message;
      alert("Error al guardar producto: " + mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setValue("title", p.title);
    setValue("price", p.price);
    setValue("description", p.description);
    setValue("category", p.category);
    setValue("stock", p.stock ?? 0);
    setShowForm(true);
  };
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      setLoading(true);
      await api.delete(`/api/products/${id}`);
      await loadProductos(); // Recargar lista después de eliminar
      alert("Producto eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar:", error);
      const mensaje = error.response?.data?.message || error.message;
      alert("Error al eliminar: " + mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            reset();
            setEditingId(null);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {showForm ? "Cancelar" : "Nuevo Producto"}
        </button>
      </div>
      <div className="bg-blue-100 p-4 mb-6">
        Usuario: <strong>{user?.email}</strong>
      </div>

      {showForm && (
        <form
          className="bg-white p-6 rounded shadow mb-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {["title", "price", "description", "category", "stock"].map((f) => {
            return (
              <div className="mb-4" key={f}>
                <label className="block font-semibold mb-1">
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </label>
                {f === "description" ? (
                  <textarea
                    {...register(f)}
                    rows="3"
                    className="w-full border px-3 py-2 rounded"
                  />
                ) : (
                  <input
                    type={f === "price" || f === "stock" ? "number" : "text"}
                    step={f === "price" ? "0.01" : undefined}
                    {...register(f, {
                      valueAsNumber: f === "price" || f === "stock",
                    })}
                    className="w-full border px-3 py-2 rounded"
                  />
                )}
                {errors[f] && (
                  <p className="text-red-600 text-sm">{errors[f]?.message}</p>
                )}
              </div>
            );
          })}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {editingId ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">Cargando...</td>
            </tr>
          ) : productos.length === 0 ? (
            <tr>
              <td colSpan="5">No hay productos</td>
            </tr>
          ) : (
            productos.map((p) => (
              <tr key={p.id} className="border-t">
                <td>{p.id}</td>
                <td>{p.title.substring(0, 30)}...</td>
                <td>${p.price}</td>
                <td>{p.category}</td>
                <td>{p.stock ?? 0}</td>
                <td>
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
