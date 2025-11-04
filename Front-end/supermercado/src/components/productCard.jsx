import React, { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";


export default function ProductCard({ product, onAdd, onOpen }) {
  const [isAdding, setIsAdding] = useState(false);

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
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <img
        src={product.image}
        alt={product.title}
        loading="lazy"
        className="w-full h-52 object-contain bg-gray-50 p-4"
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">
          {product.title}
        </h3>
        <p className="text-green-600 font-bold text-xl mb-3">
          ${product.price}
        </p>
        <button
          onClick={handleAdd}
          disabled={isAdding}
          className={`flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors ${
            isAdding ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isAdding ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ShoppingCart size={18} />
          )}
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
