import React, { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import ProductCard from "../components/productCard";
import AuthPrompt from "../components/authPrompt";
import AboutUs from "../components/aboutUs";
import { useAuthStore } from "../store/authStore";
import ProductModal from "../components/productModal";
import useCartStore from "../store/cartStore";
import Loader from "../components/loader";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalProducto, setModalProducto] = useState(null);
  const addToCart = useCartStore((s) => s.addToCart);
  const { isAuthenticated } = useAuthStore();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const fetchProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/api/products");
      // Normalizar respuesta: algunos backends devuelven { data: [...] } u { products: [...] }
      const payload = res?.data;
      let items = payload;
      if (payload && typeof payload === "object") {
        if (Array.isArray(payload)) items = payload;
        else if (Array.isArray(payload.data)) items = payload.data;
        else if (Array.isArray(payload.products)) items = payload.products;
        else if (Array.isArray(payload.items)) items = payload.items;
        else items = [];
      }
      if (!Array.isArray(items)) items = [];
      setProductos(items);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error al cargar los productos. Intenta nuevamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchProductos}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-3 gap-6">
        {productos.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAdd={(prod) => {
              if (!isAuthenticated) {
                setShowAuthPrompt(true);
                return;
              }
              addToCart(prod);
            }}
            onOpen={(prod) => setModalProducto(prod)}
          />
        ))}
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
      </div>
      <AboutUs />
    </div>
  );
}
