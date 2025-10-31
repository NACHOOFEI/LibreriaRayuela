import React, { useState } from "react";
import { Loader2, Plus, Minus, X } from "lucide-react";

export default function ProductModal({ product, onClose, onAdd }) {
  const [isAdding, setIsAdding] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const stock = product?.stock ?? 0;
  const isOutOfStock = stock === 0;
  const wouldExceedStock = cantidad >= stock;

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-64 object-contain mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                disabled={cantidad <= 1}
                className="bg-gray-200 p-1 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={20} />
              </button>
              <span className="font-semibold w-10 text-center">{cantidad}</span>
              <button
                onClick={() => setCantidad((c) => c + 1)}
                disabled={wouldExceedStock}
                className="bg-gray-200 p-1 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
              </button>
            </div>
            {stock > 0 && (
              <span className="text-sm text-gray-500">
                {stock} unidades disponibles
              </span>
            )}
          </div>
          <button
            onClick={async () => {
              setIsAdding(true);
              try {
                await onAdd(product, cantidad);
                onClose();
              } finally {
                setIsAdding(false);
              }
            }}
            disabled={isAdding || isOutOfStock || wouldExceedStock}
            className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${
              isAdding || isOutOfStock || wouldExceedStock
                ? "opacity-75 cursor-not-allowed"
                : ""
            }`}
          >
            {isAdding ? <Loader2 size={20} className="animate-spin" /> : null}
            {isOutOfStock
              ? "Sin stock"
              : `Agregar $${product.price * cantidad}`}
          </button>
        </div>
      </div>
    </div>
  );
}
