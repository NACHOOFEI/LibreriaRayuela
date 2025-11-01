import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import api from "../api/api";

export default function Elementos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [categoria, setCategoria] = useState("all");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get("/products");
        setProductos(res.data);
      } catch {
        alert("Error cargando productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const categorias = ["all", ...new Set(productos.map((p) => p.category))];
  const filtrados = productos.filter(
    (p) =>
      (categoria === "all" || p.category === categoria) &&
      p.title.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Nuestros Productos</h1>
      <div className="mb-6 flex gap-4 flex-wrap">
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar..."
          className="flex-1 min-w-64 border border-gray-300 rounded px-4 py-2"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Todas" : "c"}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtrados.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-48 object-contain p-4"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2">
                  {p.title.substring(0, 60)}...
                </h3>
                <p className="text-2xl font-bold text-green-600 mb-2">
                  ${p.price}
                </p>
                <Link href={`/elementos/${p.id}`}>
                  <a className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700">
                    Ver detalles
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
