import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import api from "../api/api"; // se mantiene para mutaciones directas
import { useProducts, useCategories } from "../services/queries";
import StatsChart from "../components/statsChart";
import { useAuthStore } from "../store/authStore";
import { useLocation } from "wouter";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

// Base de validaciones compartidas
const baseSchema = {
  name: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres"),
  description: z
    .string()
    .min(10, "Mínimo 10 caracteres")
    .max(2000, "Máximo 2000 caracteres"),
  price: z.number().min(0.01, "El precio debe ser mayor a 0"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
};

// 1. Schema para CREAR (Obligatorio: Categoría y Nueva Imagen)
const createElementoSchema = z.object({
  ...baseSchema,
  categoryId: z.number().min(1, "Debe seleccionar una categoría"),
  image: z
    .any()
    .refine((fileList) => fileList && fileList.length === 1, {
      message: "Debe subir una imagen",
    })
    .refine((fileList) => fileList[0].size <= MAX_FILE_SIZE, {
      message: `El tamaño máximo es ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine((fileList) => ACCEPTED_IMAGE_TYPES.includes(fileList[0].type), {
      message: `Solo se aceptan los formatos: ${ACCEPTED_IMAGE_TYPES.map(
        (t) => t.split("/")[1]
      ).join(", ")}`,
    }),
});

// 2. Schema para ACTUALIZAR (Opcional: Categoría e Imagen)
const updateElementoSchema = z.object({
  ...baseSchema,
  // Permite z.number, "" (opción vacía del select), o null.
  categoryId: z
    .union([
      z.number().min(1, "Debe seleccionar una categoría válida"),
      z.literal(""),
      z.null(),
    ])
    .optional()
    .transform((e) => {
      // Transforma la cadena vacía ("") a null.
      if (e === "") return null;
      if (typeof e === "number") return e;
      return e;
    }),

  image: z
    .any()
    .optional()
    .refine(
      (fileList) => !fileList || fileList.length === 0 || fileList.length === 1,
      {
        message:
          "Debe subir una imagen o no subir nada, pero no múltiples archivos.",
      }
    )
    .refine(
      (fileList) => {
        if (!fileList || fileList.length === 0) return true;
        const file = fileList[0];
        return file && file.size <= MAX_FILE_SIZE;
      },
      {
        message: `El tamaño máximo es ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      }
    )
    .refine(
      (fileList) => {
        if (!fileList || fileList.length === 0) return true;
        const file = fileList[0];
        return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
      },
      {
        message: `Solo se aceptan los formatos: ${ACCEPTED_IMAGE_TYPES.map(
          (t) => t.split("/")[1]
        ).join(", ")}`,
      }
    ),
});

export default function AdminPanel() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const {
    data: productos = [],
    isLoading: loadingProductos,
    error: errorProductos,
  } = useProducts();
  const { data: categorias = [], isLoading: loadingCategorias } =
    useCategories();

  const usuarios = []; // Temporal
  const loadingUsuarios = false; // Temporal
  const [saving, setSaving] = useState(false);
  const loading =
    loadingProductos || loadingUsuarios || loadingCategorias || saving;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [sortConfig, setSortConfig] = useState({ key: "id", dir: "asc" });
  const formRef = useRef(null);
  const tableRef = useRef(null);
  const [highlightId, setHighlightId] = useState(null);

  // Seleccionar el esquema según el modo
  const currentSchema = useMemo(() => {
    return editingId ? updateElementoSchema : createElementoSchema;
  }, [editingId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0.01,
      stock: 0,
      categoryId: "", // Inicializar con "" para la opción vacía del select
      image: null,
    },
  });

  // Datos provistos por React Query; error se maneja desde hook productos
  useEffect(() => {
    if (errorProductos) {
      const mensaje =
        errorProductos.response?.data?.message || errorProductos.message;
      setErrorMsg("Error cargando productos: " + mensaje);
    }
  }, [errorProductos]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      const formData = new FormData();

      // Usamos PascalCase para coincidir con tu DTO de C#
      formData.append("Name", data.name);
      formData.append("Description", data.description);
      formData.append("Price", String(data.price));
      formData.append("Stock", String(data.stock ?? 0));

      let resp;
      let isUpdating = !!editingId;

      if (isUpdating) {
        // --- Lógica de Edición ---

        let categoryIdValue = data.categoryId;

        // Si el valor no es nulo/vacío, lo convertimos a número (ya que el select no usa valueAsNumber)
        if (
          categoryIdValue !== null &&
          categoryIdValue !== undefined &&
          categoryIdValue !== ""
        ) {
          categoryIdValue = Number(categoryIdValue);
        } else {
          categoryIdValue = null;
        }

        // Solo agregar categoryId si es un número válido (> 0)
        // Esto previene enviar null o 0 al backend, dejando que preserve el valor.
        if (categoryIdValue > 0) {
          formData.append("CategoryId", String(categoryIdValue));
        }

        // Imagen: Solo si hay un nuevo archivo seleccionado
        if (data.image && data.image.length > 0) {
          formData.append("Image", data.image[0]);
        }

        // Hacemos el PUT con el ID
        resp = await api.put(`/api/products/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // --- Lógica de Creación ---

        // Categoría y Imagen son obligatorias y ya validadas por createElementoSchema
        if (!data.categoryId) {
          // Este chequeo es redundante si Zod funciona, pero es buena práctica de seguridad
          throw new Error(
            "Debe seleccionar una categoría para crear el producto."
          );
        }

        // Aquí data.categoryId es un número (gracias a valueAsNumber: !editingId)
        formData.append("CategoryId", String(data.categoryId));

        // La imagen es obligatoria para crear
        formData.append("Image", data.image[0]);

        resp = await api.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Invalidar cache de productos para refrescar la lista
      await queryClient.invalidateQueries({ queryKey: ["products"] });

      reset();
      setShowForm(false);
      setEditingId(null);
      setSuccessMsg(
        isUpdating
          ? "Producto actualizado con éxito"
          : "Producto creado con éxito"
      );
      // Lógica de scroll y highlight
      setTimeout(() => {
        tableRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
      const updatedId = editingId || resp?.data?.id;
      if (updatedId) {
        setHighlightId(updatedId);
        setTimeout(() => setHighlightId(null), 1800);
      }
    } catch (error) {
      const mensaje = error.response?.data?.message || error.message;
      setErrorMsg("Error al guardar producto: " + mensaje);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setValue("name", p.name);
    setValue("price", p.price);
    setValue("description", p.description);
    // Inicializar categoryId con el ID o "" si es nulo, para que la opción vacía funcione.
    setValue("categoryId", p.categoryId > 0 ? p.categoryId : "");
    setValue("stock", p.stock ?? 0);
    // Asegurarse de que el campo de archivo esté limpio
    setValue("image", null);
    setShowForm(true);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");
      await api.delete(`/api/products/${id}`);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setSuccessMsg("Producto eliminado con éxito");
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMsg(
          "Error de autorización: El backend no acepta el token JWT. Contacte al administrador del sistema."
        );
      } else {
        const mensaje = error.response?.data?.message || error.message;
        setErrorMsg("Error al eliminar: " + mensaje);
      }
    } finally {
      setSaving(false);
    }
  };

  // Métricas derivadas
  const totalProductos = productos.length;
  const totalUsuarios = usuarios.length;
  const productosPorCategoria = useMemo(() => {
    const map = new Map();
    for (const p of productos) {
      map.set(p.category?.name, (map.get(p.category?.name) || 0) + 1);
    }
    return Array.from(map, ([label, value]) => ({ label, value })).sort(
      (a, b) => b.value - a.value
    );
  }, [productos]);
  const stockTotal = useMemo(
    () => productos.reduce((acc, p) => acc + (p.stock ?? 0), 0),
    [productos]
  );

  // Derivar categorías únicas para filtros
  const categoriasUnicas = useMemo(() => {
    const setCat = new Set(productos.map((p) => p.category?.name));
    return Array.from(setCat).sort();
  }, [productos]);

  // Filtrado + búsqueda + ordenamiento
  const productosFiltrados = useMemo(() => {
    let data = productos.slice();
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          String(p.id).includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "todos") {
      data = data.filter((p) => p.category?.name === categoryFilter);
    }
    if (sortConfig.key) {
      data.sort((a, b) => {
        const { key, dir } = sortConfig;
        let va = a[key];
        let vb = b[key];
        if (key === "name" || key === "category" || key === "description") {
          va = String(va).toLowerCase();
          vb = String(vb).toLowerCase();
        }
        if (va < vb) return dir === "asc" ? -1 : 1;
        if (va > vb) return dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [productos, search, categoryFilter, sortConfig]);

  // Separar por stock
  const sinStock = useMemo(
    () => productosFiltrados.filter((p) => (p.stock ?? 0) === 0),
    [productosFiltrados]
  );
  const conStock = useMemo(
    () => productosFiltrados.filter((p) => (p.stock ?? 0) > 0),
    [productosFiltrados]
  );

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  // Scroll automático cuando el formulario se muestra
  useEffect(() => {
    if (showForm) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  // ---- UI enriquecida de estadísticas ----
  const statsHeader = (
    <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="bg-white rounded-2xl shadow p-6 border border-blue-50">
        <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Usuario
        </h2>
        <p className="text-lg font-medium text-gray-800 truncate">
          {user?.email}
        </p>
        <p className="text-xs text-gray-500 mt-1">Rol: {user?.role || "—"}</p>
      </div>
      <div className="bg-white rounded-2xl shadow p-6 border border-purple-50">
        <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Total productos
        </h2>
        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {totalProductos}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Stock acumulado: {stockTotal}
        </p>
      </div>
      <div
        className="bg-white rounded-2xl shadow p-6 border border-green-50"
        onClick={() => setLocation("/admin/users")}
      >
        <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Usuarios
        </h2>
        <p className="text-4xl font-bold text-green-600">{totalUsuarios}</p>
        <p className="text-xs text-gray-500 mt-1">(mock)</p>
      </div>
    </div>
  );
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <button
          onClick={() => {
            const abrir = !showForm;
            setShowForm(abrir);
            reset();
            setEditingId(null);
            if (abrir) {
              setTimeout(() => {
                formRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 50);
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {showForm ? "Cancelar" : "Nuevo Producto"}
        </button>
      </div>
      {statsHeader}

      {/* Barra de controles de tabla */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6 bg-white/60 backdrop-blur rounded-xl p-4 border border-gray-200">
        <div className="flex-1 grid gap-4 md:grid-cols-3">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="id, título o categoría..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todas</option>
              {categoriasUnicas.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Orden actual
            </label>
            <div className="text-xs px-3 py-2 border rounded-lg bg-gray-50 text-gray-700">
              {sortConfig.key} ({sortConfig.dir})
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSearch("");
              setCategoryFilter("todos");
              setSortConfig({ key: "id", dir: "asc" });
            }}
            className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Reset
          </button>
          <button
            onClick={() => {
              // Exportar CSV rápido
              const header = ["id", "name", "price", "category", "stock"].join(
                ","
              );
              const rows = productosFiltrados.map((p) =>
                [p.id, p.name, p.price, p.category?.name, p.stock ?? 0].join(",")
              );
              const csv = [header, ...rows].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "productos.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {productosPorCategoria.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-purple-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3v18h18"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 15l4-8 4 6 3-4"
              />
            </svg>
            Productos por categoría
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <StatsChart data={productosPorCategoria} type="bar" height={320} />
            <StatsChart data={productosPorCategoria} type="pie" height={320} />
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {successMsg}
        </div>
      )}

      {showForm && (
        <form
          ref={formRef}
          className="bg-white p-6 rounded shadow mb-6 scroll-mt-24"
          onSubmit={handleSubmit(onSubmit)}
        >
          {["name", "price", "description", "stock"].map((f) => {
            return (
              <div className="mb-4" key={f}>
                <label className="block font-semibold mb-1">
                  {f === "name"
                    ? "Nombre"
                    : f.charAt(0).toUpperCase() + f.slice(1)}
                </label>
                {f === "description" ? (
                  <textarea
                    {...register(f)}
                    rows="3"
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Descripción del producto (máximo 100 caracteres)"
                  />
                ) : (
                  <input
                    type={f === "price" || f === "stock" ? "number" : "text"}
                    step={f === "price" ? "0.01" : undefined}
                    placeholder={
                      f === "name"
                        ? "Nombre del producto (máximo 30 caracteres)"
                        : f === "price"
                        ? "Precio (mayor a 0)"
                        : f === "stock"
                        ? "Stock disponible"
                        : ""
                    }
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

          {/* Campo de categoría */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Categoría{" "}
              {editingId ? "(opcional - dejar vacío para no cambiar)" : ""}
            </label>
            <select
              // 💡 CORRECCIÓN: valueAsNumber solo activo cuando NO estamos editando (crear)
              {...register("categoryId", { valueAsNumber: !editingId })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">
                {editingId ? "No cambiar categoría" : "Seleccionar categoría"}
              </option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-600 text-sm">
                {errors.categoryId?.message}
              </p>
            )}
          </div>

          {/* Campo de imagen */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Imagen{" "}
              {editingId ? "(opcional - dejar vacío para no cambiar)" : ""}
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.image && (
              <p className="text-red-600 text-sm">{errors.image?.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded transition-colors"
          >
            {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}

      <div
        ref={tableRef}
        className="relative overflow-auto rounded-xl shadow ring-1 ring-gray-200"
      >
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10 text-xs uppercase text-gray-600">
            <tr>
              {[
                { key: "id", label: "ID" },
                { key: "name", label: "Nombre" },
                { key: "price", label: "Precio" },
                { key: "category", label: "Categoría" },
                { key: "stock", label: "Stock" },
              ].map((col) => (
                <th key={col.key} className="font-semibold text-left">
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="flex items-center gap-1 py-3 px-4 hover:text-blue-600 transition"
                  >
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span className="text-[10px]">
                        {sortConfig.dir === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </button>
                </th>
              ))}
              <th className="font-semibold text-left py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : conStock.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  {productos.length === 0
                    ? "No hay productos"
                    : "Sin resultados (no hay productos con stock > 0)"}
                </td>
              </tr>
            ) : (
              conStock.map((p) => (
                <tr
                  key={p.id}
                  className={`group transition-colors ${
                    highlightId === p.id
                      ? "bg-yellow-50 ring-2 ring-yellow-300"
                      : "hover:bg-blue-50/40"
                  }`}
                >
                  <td className="px-4 py-3 tabular-nums text-gray-700">
                    {p.id}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <span className="font-medium text-gray-800">
                      {p.name && p.name.length > 40
                        ? p.name.substring(0, 40) + "…"
                        : p.name || "Sin nombre"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">${p.price}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold">
                      {p.category?.name || "Sin categoría"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold ${
                        (p.stock ?? 0) === 0
                          ? "bg-red-100 text-red-700"
                          : (p.stock ?? 0) < 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.stock ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-2 py-1 rounded-md bg-yellow-500/90 hover:bg-yellow-600 text-white text-xs font-semibold shadow-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-2 py-1 rounded-md bg-red-600/90 hover:bg-red-700 text-white text-xs font-semibold shadow-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sinStock.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
              0
            </span>
            Productos sin stock
            <span className="text-sm font-normal text-red-500">
              ({sinStock.length})
            </span>
          </h2>
          <div className="relative overflow-auto rounded-xl shadow ring-1 ring-red-200">
            <table className="min-w-full text-sm">
              <thead className="bg-red-50 text-xs uppercase text-red-600">
                <tr>
                  <th className="text-left py-2 px-3">ID</th>
                  <th className="text-left py-2 px-3">Título</th>
                  <th className="text-left py-2 px-3">Precio</th>
                  <th className="text-left py-2 px-3">Categoría</th>
                  <th className="text-left py-2 px-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100">
                {sinStock.map((p) => (
                  <tr
                    key={p.id}
                    className={`bg-white transition ${
                      highlightId === p.id
                        ? "bg-yellow-50 ring-2 ring-yellow-300"
                        : "hover:bg-red-50/60"
                    }`}
                  >
                    <td className="px-3 py-2 tabular-nums">{p.id}</td>
                    <td className="px-3 py-2 max-w-xs">
                      {p.name && p.name.length > 50
                        ? p.name.substring(0, 50) + "…"
                        : p.name || "Sin nombre"}
                    </td>
                    <td className="px-3 py-2">${p.price}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-semibold">
                        {p.category?.name || "Sin categoría"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-2 py-1 rounded-md bg-yellow-500/90 hover:bg-yellow-600 text-white text-xs font-semibold shadow-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-2 py-1 rounded-md bg-red-600/90 hover:bg-red-700 text-white text-xs font-semibold shadow-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
