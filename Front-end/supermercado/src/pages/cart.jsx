import React, { useState } from "react";
import { useCartStore } from "../store/cartStore";
import CartItem from "../components/cartItem";
import CartSummary from "../components/cartSummary";
import CheckoutModal from "../components/checkoutModal";

export default function Cart() {
  const { items, clearCart } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [shipping, setShipping] = useState("pickup");
  const [success, setSuccess] = useState(null);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Mi Carrito</h1>
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
            <button
              onClick={() => setSuccess(null)}
              className="float-right text-sm underline"
            >
              Cerrar
            </button>
          </div>
        )}
        {items.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          items.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>

      <div>
        <CartSummary
          onCheckout={() => setShowCheckout(true)}
          shipping={shipping}
          setShipping={setShipping}
        />
      </div>
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={items}
        total={
          items.reduce((s, it) => s + it.price * it.quantity, 0) +
          (shipping === "delivery" ? 4.99 : 0)
        }
        shipping={shipping}
        onSuccess={() => {
          const orderId = Math.random().toString(36).slice(2, 10).toUpperCase();
          clearCart();
          setSuccess(
            `Pago realizado correctamente. Orden ${orderId}. Método: ${
              shipping === "delivery" ? "Envío a domicilio" : "Retiro en tienda"
            }.`
          );
        }}
      />
    </div>
  );
}
