// src/pages/ProductList.jsx
import React, { useState, useEffect } from "react";
import api from "../api/api";
import ProductCard from "../components/productCard";
import ProductModal from "../components/productModal";
import useCartStore from "../store/cartStore";

export default function ProductList() {
  const [productos, setProductos] = useState([]);
  const [modalProducto, setModalProducto] = useState(null);
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get("/products?limit=6");
        setProductos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProductos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-6 md:grid-cols-3">
      {productos.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onAdd={addToCart}
          onOpen={(prod) => setModalProducto(prod)}
        />
      ))}
      {modalProducto && (
        <ProductModal
          product={modalProducto}
          onClose={() => setModalProducto(null)}
          onAdd={addToCart}
        />
      )}
    </div>
  );
}
