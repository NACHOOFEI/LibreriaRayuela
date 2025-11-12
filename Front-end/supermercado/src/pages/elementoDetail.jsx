import React, { useState } from "react";
import { useProduct } from "../services/queries";
import { useCartStore } from "../store/cartStore";
import { useLocation } from "wouter";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";

export default function ElementoDetail({ id }) {
  const { data: product, isLoading: loading, error } = useProduct(id);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCartStore();
  const [, navigate] = useLocation();

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart({ ...product, quantity: qty });
      navigate("/carrito");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Error al cargar el producto. Por favor, intente nuevamente.
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full p-6 text-center">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            Producto no encontrado
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/elementos")}
          className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Volver a productos
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square relative overflow-hidden bg-gray-100 p-8">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>

            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="space-y-6">
                <div>
                  <p className="text-4xl font-bold text-green-600">
                    ${product.price}
                  </p>
                  {product.discount && (
                    <p className="text-sm text-red-500 mt-1">
                      {product.discount}% de descuento
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Descripción
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    {product.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Stock disponible
                  </h3>
                  <p className="mt-2 text-gray-600">{product.stock} unidades</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Cantidad
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="p-2 rounded-full hover:bg-gray-100"
                      aria-label="Disminuir cantidad"
                      disabled={qty <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-medium w-12 text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() =>
                        setQty((q) => Math.min(product.stock, q + 1))
                      }
                      className="p-2 rounded-full hover:bg-gray-100"
                      aria-label="Aumentar cantidad"
                      disabled={qty >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                  className={`
                    w-full py-4 px-8 rounded-xl font-medium text-sm 
                    flex items-center justify-center gap-2
                    transition-all duration-300
                    ${
                      product.stock
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/30"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock ? "Agregar al carrito" : "Sin stock"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
