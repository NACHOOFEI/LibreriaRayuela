import { create } from "zustand";
import { useAuthStore } from "./authStore";

const BASE_KEY = "cartItems";
const userKey = () => {
  try {
    const { user, isAuthenticated } = useAuthStore.getState();
    const id = user?.email || user?.id;
    return `${BASE_KEY}:${isAuthenticated && id ? id : "guest"}`;
  } catch {
    return `${BASE_KEY}:guest`;
  }
};

// Cargar inicial desde localStorage
function loadInitial() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(userKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((p) => p && p.id);
    return [];
  } catch {
    return [];
  }
}

function persist(items) {
  try {
    localStorage.setItem(userKey(), JSON.stringify(items));
  } catch {
    // ignore persistence errors (e.g., private mode)
  }
}

export const useCartStore = create((set, get) => ({
  items: loadInitial(),
  cart: loadInitial(),

  // Agrega item al carrito. acepta (producto, cantidad)
  addToCart: (producto, cantidad = 1) => {
    const current = get().items;
    const itemExists = current.find((p) => p.id === producto.id);
    const maxStock =
      typeof producto.stock === "number" ? producto.stock : Infinity;

    // Si no hay stock disponible, no agregamos.
    if (maxStock <= 0) return;

    let updated;
    if (itemExists) {
      const nuevaCantidad = Math.min(itemExists.quantity + cantidad, maxStock);
      updated = current.map((p) =>
        p.id === producto.id ? { ...p, quantity: nuevaCantidad } : p
      );
    } else {
      const inicial = Math.min(cantidad, maxStock);
      updated = [...current, { ...producto, quantity: inicial }];
    }

    set({ items: updated, cart: updated });
    persist(updated);
  },

  addItem: (producto, cantidad = 1) => get().addToCart(producto, cantidad),

  // actualizar cantidad por id
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      // si la cantidad llega a 0 o menos, eliminamos el item
      const updated = get().items.filter((p) => p.id !== id);
      set({ items: updated, cart: updated });
      persist(updated);
      return;
    }
    const updated = get().items.map((p) => {
      if (p.id !== id) return p;
      const maxStock = typeof p.stock === "number" ? p.stock : Infinity;
      const clamped = Math.min(quantity, maxStock);
      return { ...p, quantity: clamped };
    });
    set({ items: updated, cart: updated });
    persist(updated);
  },

  // eliminar item por id
  removeItem: (id) => {
    const updated = get().items.filter((p) => p.id !== id);
    set({ items: updated, cart: updated });
    persist(updated);
  },

  removeFromCart: (id) => get().removeItem(id),

  // limpiar carrito
  clearCart: () => {
    set({ items: [], cart: [] });
    persist([]);
  },
}));

// Cuando cambia el usuario autenticado, rehidratar carrito del nuevo usuario
try {
  useAuthStore.subscribe((state, prev) => {
    const curr = state?.user?.email || state?.user?.id || null;
    const prevId = prev?.user?.email || prev?.user?.id || null;
    if (curr !== prevId || state.isAuthenticated !== prev?.isAuthenticated) {
      const items = loadInitial();
      useCartStore.setState({ items, cart: items });
    }
  });
} catch {
  // ignore subscribe errors in non-browser environments
}

export default useCartStore;
