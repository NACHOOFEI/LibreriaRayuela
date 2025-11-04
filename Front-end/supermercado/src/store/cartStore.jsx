import { create } from "zustand";
export const useCartStore = create((set, get) => ({
  items: [],
  cart: [],

  // Agrega item al carrito. acepta (producto, cantidad)
  addToCart: (producto, cantidad = 1) => {
    const current = get().items;
    const itemExists = current.find((p) => p.id === producto.id);

    let updated;
    if (itemExists) {
      updated = current.map((p) =>
        p.id === producto.id ? { ...p, quantity: p.quantity + cantidad } : p
      );
    } else {
      updated = [...current, { ...producto, quantity: cantidad }];
    }

    set({ items: updated, cart: updated });
  },

 
  addItem: (producto, cantidad = 1) => get().addToCart(producto, cantidad),

  // actualizar cantidad por id
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      // si la cantidad llega a 0 o menos, eliminamos el item
      const updated = get().items.filter((p) => p.id !== id);
      set({ items: updated, cart: updated });
      return;
    }
    const updated = get().items.map((p) =>
      p.id === id ? { ...p, quantity } : p
    );
    set({ items: updated, cart: updated });
  },

  // eliminar item por id
  removeItem: (id) => {
    const updated = get().items.filter((p) => p.id !== id);
    set({ items: updated, cart: updated });
  },

 
  removeFromCart: (id) => get().removeItem(id),

  // limpiar carrito
  clearCart: () => set({ items: [], cart: [] }),
}));

export default useCartStore;
