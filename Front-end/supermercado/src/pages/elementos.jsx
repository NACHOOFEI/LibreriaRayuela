import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import api from "../api/api";
import ProductCard from "../components/productCard";
import ProductModal from "../components/productModal";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import AuthPrompt from "../components/authPrompt";

export default function Elementos() {
  // Estados para productos y paginación
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("all");
  const [ordenPrecio, setOrdenPrecio] = useState("none");
  const [pagina, setPagina] = useState(1);

  // Estado global del carrito
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [modalProducto, setModalProducto] = useState(null);

  // Constantes de paginación
  const ITEMS_POR_PAGINA = 8;

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/api/products");
        setProductos(res.data);
      } catch (err) {
        setError(
          "Error al cargar los productos. Por favor, intente nuevamente."
        );
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Obtener categorías únicas
  const categorias = ["all", ...new Set(productos.map((p) => p.category))];

  // Filtrar y ordenar productos
  const productosFiltrados = productos
    .filter((p) => {
      const cumpleBusqueda =
        p.title.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.description.toLowerCase().includes(busqueda.toLowerCase());
      const cumpleCategoria = categoria === "all" || p.category === categoria;
      return cumpleBusqueda && cumpleCategoria;
    })
    .sort((a, b) => {
      if (ordenPrecio === "asc") return a.price - b.price;
      if (ordenPrecio === "desc") return b.price - a.price;
      return 0;
    });

  // Calcular paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA);
  const productosEnPagina = productosFiltrados.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Nuestros Productos
        </h1>
        <p className="mt-2 text-gray-600">
          Encuentra los mejores productos al mejor precio
        </p>
      </div>

      {/* Panel de filtros */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o descripción..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "Todas las categorías" : c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por precio
            </label>
            <select
              value={ordenPrecio}
              onChange={(e) => setOrdenPrecio(e.target.value)}
              className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="none">Sin ordenar</option>
              <option value="asc">Menor a mayor</option>
              <option value="desc">Mayor a menor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mensajes de estado */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Lista de productos */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosEnPagina.map((producto) => (
              <ProductCard
                key={producto.id}
                product={producto}
                onAdd={() => {
                  if (!isAuthenticated) {
                    setShowAuthPrompt(true);
                    return;
                  }
                  addToCart(producto);
                }}
                onOpen={(prod) => setModalProducto(prod)}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setPagina(num)}
                    className={`px-4 py-2 rounded-lg ${
                      pagina === num
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          )}

          {/* Mensaje si no hay resultados */}
          {productosEnPagina.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No se encontraron productos que coincidan con los filtros
              aplicados.
            </div>
          )}
          {modalProducto && (
            <ProductModal
              product={modalProducto}
              onClose={() => setModalProducto(null)}
              onAdd={(prod, cant) => {
                if (!isAuthenticated) {
                  setShowAuthPrompt(true);
                  return;
                }
                addToCart(prod, cant);
              }}
            />
          )}
          <AuthPrompt
            isOpen={showAuthPrompt}
            onClose={() => setShowAuthPrompt(false)}
          />
        </>
      )}
    </div>
  );
}
