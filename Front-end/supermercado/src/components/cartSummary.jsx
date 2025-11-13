import React from "react";
import { useCartStore } from "../store/cartStore";

export default function CartSummary({ onCheckout, shipping, setShipping }) {
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const envio = shipping === "delivery" ? 4.99 : 0;
  const total = subtotal + envio;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Resumen de la compra</h2>
      <div className="mb-2">
        Subtotal:{" "}
        <span className="float-right font-bold">${subtotal.toFixed(2)}</span>
      </div>
      <hr className="my-4" />
      <div className="my-3">
        <label className="block text-sm font-medium mb-1">Envío</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="shipping"
              value="pickup"
              checked={shipping === "pickup"}
              onChange={() => setShipping("pickup")}
            />
            Retiro en Librería (Gratis)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="shipping"
              value="delivery"
              checked={shipping === "delivery"}
              onChange={() => setShipping("delivery")}
            />
            Envío a domicilio ($4.99)
          </label>
        </div>
      </div>

      <div className="text-2xl font-bold">
        Total <span className="float-right">${total.toFixed(2)}</span>
      </div>

      <button
        onClick={onCheckout}
        disabled={items.length === 0}
        className={`w-full text-white py-2 mt-6 rounded ${
          items.length === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Finalizar compra
      </button>
      <button
        onClick={clearCart}
        className="w-full mt-2 bg-red-500 text-white py-2 rounded"
      >
        Vaciar carrito
      </button>
    </div>
  );
}
