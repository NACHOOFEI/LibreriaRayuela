import { create } from "zustand";
import { getUserFromToken } from "../utils/jwtUtils";

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

    // Si tenemos token, verificar que sea válido y extraer datos
    let tokenInfo = null;
    if (token) {
      tokenInfo = getUserFromToken(token);

      // Si el token está expirado, limpiar todo
      if (tokenInfo?.isExpired) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return { user: null, role: null, isAuthenticated: false };
      }
    }

    // Usar datos del token como fuente de verdad para el rol
    const effectiveRole = tokenInfo?.role || parsed?.role || null;
    const effectiveUser = parsed ? { ...parsed, role: effectiveRole } : null;

    const result = {
      user: effectiveUser,
      role: effectiveRole,
      isAuthenticated: !!token && !!effectiveUser && !tokenInfo?.isExpired,
    };

    return result;
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

    const newState = {
      user: userData,
      role: userData.role || null,
      isAuthenticated: true,
    };

    set(newState);
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

  // Método para verificar y actualizar el estado basado en el token actual
  validateSession: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ user: null, role: null, isAuthenticated: false });
      return false;
    }

    const tokenInfo = getUserFromToken(token);
    if (!tokenInfo || tokenInfo.isExpired) {
      // Token inválido o expirado, limpiar sesión
      try {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      } catch {
        // Ignorar errores de localStorage
      }

      set({ user: null, role: null, isAuthenticated: false });
      return false;
    }

    // Token válido, actualizar estado si es necesario
    set((state) => ({
      ...state,
      role: tokenInfo.role || state.role,
      isAuthenticated: true,
    }));

    return true;
  },
}));

export default useAuthStore;
