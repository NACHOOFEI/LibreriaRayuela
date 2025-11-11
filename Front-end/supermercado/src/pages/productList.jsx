// src/pages/ProductList.jsx
import React, { useState } from "react";
import { useProducts } from "../services/queries";
import ProductCard from "../components/productCard";
import ProductModal from "../components/productModal";
import useCartStore from "../store/cartStore";

export default function ProductList() {
  const { data: productos = [], isLoading, error } = useProducts();
  const [modalProducto, setModalProducto] = useState(null);
  const addToCart = useCartStore((s) => s.addToCart);
  const topProductos = productos.slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-6 md:grid-cols-3">
      {isLoading && <div>Cargando...</div>}
      {error && <div>Error al cargar productos</div>}
      {!isLoading &&
        !error &&
        topProductos.map((p) => (
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
