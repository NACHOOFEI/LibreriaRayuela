import React, { useState, useEffect } from "react";
import api from "../api/api";
import ProductCard from "../components/productCard";
import ProductModal from "../components/productModal";
import useCartStore from "../store/cartStore";
import Loader from "../components/loader";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProducto, setModalProducto] = useState(null);
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get("/products");
        setProductos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-3 gap-6">
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
    </div>
  );
}
