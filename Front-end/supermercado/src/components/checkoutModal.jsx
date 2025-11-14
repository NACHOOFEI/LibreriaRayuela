import React from "react";
import { useLocation } from "wouter";
import { useCheckoutStore } from "../store/useCheckoutStore";
import { useCartStore } from "../store/cartStore";

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  total,
  shipping = "pickup",
}) {
  const [, setLocation] = useLocation();
  const {clearCart} = useCartStore();
  

  if (!isOpen) return null;

  const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);

  const handleFinalizarCompra = () => {
    // Cerramos modal y redirigimos
    onClose?.();
    setLocation("/transferencia");
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Finalizar compra</h2>
          <button
            className="text-gray-500 hover:text-gray-900"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Resumen</h3>
            <div className="text-sm text-gray-700 mt-2">
              Método:{" "}
              {shipping === "delivery"
                ? "Envío a domicilio"
                : "Retiro en tienda"}
            </div>
            <ul className="space-y-2 max-h-48 overflow-auto pr-2">
              {items.map((it) => (
                <li key={it.id} className="flex justify-between text-sm">
                  <span className="truncate mr-2">
                    {it.name} × {it.quantity}
                  </span>
                  <span>${(it.price * it.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t pt-3 text-sm text-gray-600">
              Productos: {totalItems}
            </div>
            <div className="text-xl font-bold mt-1">
              Total: ${total.toFixed(2)}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <p className="text-gray-700 text-sm leading-relaxed">
              Este pedido se podrá abonar mediante{" "}
              <strong>transferencia bancaria</strong>.
              <br />
              Al presionar <strong>"Finalizar compra"</strong>, se mostrarán los datos
              necesarios para realizar el pago y confirmar tu pedido.
            </p>

            <button
              onClick={handleFinalizarCompra}
              className="w-full py-2 mt-6 rounded text-white bg-green-600 hover:bg-green-700"
            >
              Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
