import React from "react";
import { useCartStore } from "../store/cartStore";
import CartItem from "../components/cartItem";
import CartSummary from "../components/cartSummary";

export default function Cart() {
  const { items } = useCartStore();

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Mi Carrito</h1>
        {items.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          items.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>

      <div>
        <CartSummary />
      </div>
    </div>
  );
}
