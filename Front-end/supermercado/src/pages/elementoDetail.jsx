import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useCartStore } from "../store/cartStore";
import { useLocation } from "wouter";

export default function ElementoDetail({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem } = useCartStore();
  const [, navigate] = useLocation();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/products/${params.id}`);
        setProduct(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!product) return <div className="p-6">No encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-6">
      <img
        src={product.image}
        alt={product.title}
        loading="lazy"
        className="w-full h-96 object-contain"
      />
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-green-600 text-2xl font-bold mb-4">
          ${product.price}
        </p>
        <p className="mb-4">{product.description}</p>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            -
          </button>
          <div className="w-10 text-center">{qty}</div>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            +
          </button>
        </div>

        <button
          onClick={() => {
            addItem(product, qty);
            navigate("/carrito");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Agregar y ver carrito
        </button>
      </div>
    </div>
  );
}
