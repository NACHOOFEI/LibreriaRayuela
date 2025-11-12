import { create } from "zustand";

export const useCheckoutStore = create((set) => ({
  order: null,
  setOrder: (order) => set({ order }),
  clearOrder: () => set({ order: null }),
}));
