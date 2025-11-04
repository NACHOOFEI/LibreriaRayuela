import React from "react";
import { useCartStore } from "../store/cartStore";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="w-20 h-20 object-contain"
      />
      <div className="flex-1">
        <h4 className="font-bold">{item.title}</h4>
        <p className="text-sm text-gray-600">${item.price}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <div className="w-10 text-center">{item.quantity}</div>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </div>

      <div className="w-28 text-right font-bold text-green-600">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      <button onClick={() => removeItem(item.id)} className="text-red-500">
        🗑
      </button>
    </div>
  );
}
