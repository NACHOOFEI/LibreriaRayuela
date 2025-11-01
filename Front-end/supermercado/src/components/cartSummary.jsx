import React from "react";
import { useCartStore } from "../store/cartStore";

export default function CartSummary() {
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const descuentos = 0; // implementar la logica despues
  const total = subtotal - descuentos;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Resumen de la compra</h2>
      <div className="mb-2">
        Subtotal:{" "}
        <span className="float-right font-bold">${subtotal.toFixed(2)}</span>
      </div>
      <div className="mb-2 text-red-500">
        Descuentos:{" "}
        <span className="float-right">-${descuentos.toFixed(2)}</span>
      </div>
      <hr className="my-4" />
      <div className="text-2xl font-bold">
        Total <span className="float-right">${total.toFixed(2)}</span>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 mt-6 rounded">
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
