import { create } from "zustand";

// Claves en localStorage para persistencia
const USER_KEY = "authUser";
const TOKEN_KEY = "token"; // ya utilizada por authServices

// Carga inicial desde localStorage (session hydration al recargar)
function loadInitialAuth() {
  if (typeof window === "undefined") {
    return { user: null, role: null, isAuthenticated: false };
  }
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    let parsed = null;
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
    }
    return {
      user: parsed,
      role: parsed?.role || null,
      isAuthenticated: !!token && !!parsed, // requiere ambos para considerar sesión completa
    };
  } catch {
    return { user: null, role: null, isAuthenticated: false };
  }
}

export const useAuthStore = create((set) => ({
  ...loadInitialAuth(),
  // login: persiste usuario y marca autenticado
  login: (userData) => {
    try {
      // Persistimos perfil básico para rehidratación futura
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch {
      // ignoramos errores de almacenamiento (modo privado, etc.)
    }
    set({
      user: userData,
      role: userData.role || null,
      isAuthenticated: true,
    });
  },
  // logout: elimina datos persistidos
  logout: () => {
    try {
      localStorage.removeItem(USER_KEY);
      // El token se elimina en authServices.logout; aun así limpiamos por redundancia
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
    set({ user: null, role: null, isAuthenticated: false });
  },
  // Permite rehidratar manualmente (por si el token se refresca externamente)
  hydrate: () => set(loadInitialAuth()),
}));

export default useAuthStore;
