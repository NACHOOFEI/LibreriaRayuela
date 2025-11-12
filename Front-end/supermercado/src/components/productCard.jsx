import React, { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { ShoppingCart, Loader2 } from "lucide-react";

export default function ProductCard({ product, onAdd, onOpen }) {
  const [isAdding, setIsAdding] = useState(false);
  const cartItems = useCartStore((s) => s.items);
  const existing = cartItems.find((p) => p.id === product.id);
  const currentQty = existing?.quantity || 0;
  const maxStock = typeof product.stock === "number" ? product.stock : Infinity;
  const atMax = currentQty >= maxStock && maxStock !== Infinity;

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      await onAdd(product);
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <div
      onClick={(e) => {
        if (!e.target.closest("button")) onOpen(product);
      }}
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-60 object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <p className="text-sm line-clamp-2 mb-2">{product.description}</p>
          <div className="flex items-center space-x-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            <span>Stock: {product.stock}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 flex-1 mr-4">
            {product.name}
          </h3>
          <div className="flex items-center justify-center bg-green-100 text-green-800 text-lg font-bold px-4 py-2 rounded-full">
            ${product.price}
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={isAdding || atMax}
          className={`
            flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl
            font-medium text-sm transition-all duration-300
            ${
              isAdding || atMax
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/30"
            }
          `}
        >
          {isAdding ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Agregando...
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              {atMax ? "Stock máximo" : "Agregar al carrito"}
            </>
          )}
        </button>
        {atMax && (
          <p className="mt-2 text-xs text-red-500 font-medium text-center">
            Alcanzaste el stock máximo ({maxStock}).
          </p>
        )}
      </div>

      {/* Descuento removido de la UI */}
    </div>
  );
}
