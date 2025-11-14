import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useCheckoutStore } from "../store/useCheckoutStore";

export default function TransferenciaInfo() {
  const [, setLocation] = useLocation();
  const order = useCheckoutStore((s) => s.order);
  
  if (!order) {
    // Si el usuario entra directamente sin pasar por el modal
    setLocation("/");
    return null;
  }

  const { items, total, shipping } = order;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Información para la transferencia
      </h2>

      <p className="text-gray-700 mb-4">
        Para finalizar tu compra, realiza la transferencia con los siguientes datos:
      </p>

      <div className="border rounded-lg p-4 bg-gray-50 border-gray-300 mb-6">
        <p><strong>Banco:</strong> Banco Nación</p>
        <p><strong>Alias:</strong> libreria.rayuela.mp</p>
        <p><strong>CBU:</strong> 0110599500059923478822</p>
        <p><strong>Titular:</strong> Librería Rayuela S.A.</p>
      </div>

      <h3 className="text-lg font-semibold mb-2">Resumen de tu compra</h3>
      <div className="border rounded-lg p-4 bg-gray-50 border-gray-300 mb-6">
        <ul className="space-y-1">
          {items.map((it) => (
            <li key={it.id} className="flex justify-between text-sm">
              <span>{it.name} × {it.quantity}</span>
              <span>${(it.price * it.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t pt-2 text-right font-semibold border-t-gray-300">
          Total: ${total.toFixed(2)}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Método: {shipping === "delivery" ? "Envío a domicilio" : "Retiro en tienda"}
        </p>
      </div>

      <p className="text-gray-700 text-sm">
        Luego de realizar la transferencia, enviá el comprobante a{" "}
        <strong>pagos@libreriarayuela.com</strong> o por WhatsApp al{" "}
        <strong>+54 11 5555-5555</strong>.
      </p>

      <button
        onClick={() => setLocation("/")}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Volver al inicio
      </button>
    </div>
  );
}
