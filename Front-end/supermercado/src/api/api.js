import axios from "axios";
import { installMockAdapter } from "./mockAdapter";

// Base URL configurable por entorno, con fallback razonable para dev
const DEFAULT_BASE_URL = "https://localhost:7158";

const ENV_BASE =
  typeof import.meta !== "undefined" ? import.meta.env?.VITE_API_BASE_URL : "";

const api = axios.create({
  baseURL: ENV_BASE || DEFAULT_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 segundos timeout
});

// Interceptor de SOLICITUD: Añade el token Bearer
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Asegurarse de que el token se añade como 'Bearer <token>'
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de RESPUESTA: Maneja el 401 (Unauthorized)
let mockInstalled = false;
const ENABLE_AUTO_FALLBACK = false; // Desactiva el fallback automático al mock

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const config = error.config || {};

    // Evita la redirección si el error ya fue manejado (ej. por mock retries)
    if (config._retried) return Promise.reject(error);

    if (status === 401) {
      // ⚠️ Solo redirigir si NO estamos en login o admin (para permitir manejo local de errores)
      const currentPath = window.location.pathname;
      const isAdminPage = currentPath.startsWith("/admin");
      const isLoginPage = currentPath === "/login";
      const shouldRedirect = !isLoginPage && !isAdminPage;

      // Solo limpiar autenticación si no estamos en admin (para evitar logout accidental)
      if (!isAdminPage) {
        localStorage.removeItem("token");
        try {
          const { useAuthStore } = await import("../store/authStore");
          useAuthStore.getState()?.logout?.();
        } catch (e) {
          void e;
        }
      }

      // Redirige si es necesario
      if (shouldRedirect) {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    // Lógica de Auto fallback a mock (sin cambios)
    const isNetworkError = !error.response && !!error.message;
    const isServerError = typeof status === "number" && status >= 500;
    const isApiPath =
      typeof config.url === "string" && config.url.startsWith("/api/");

    if (
      ENABLE_AUTO_FALLBACK &&
      (isNetworkError || isServerError) &&
      isApiPath &&
      !mockInstalled &&
      !config._retriedWithMock
    ) {
      try {
        installMockAdapter(api);
        mockInstalled = true;
        const retryConfig = { ...config, _retriedWithMock: true };
        return await api.request(retryConfig);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Habilitar Mock API opcional con VITE_USE_MOCK=true (por defecto: false)
const DEFAULT_USE_MOCK = false;
const envFlag =
  typeof import.meta !== "undefined"
    ? import.meta.env?.VITE_USE_MOCK
    : undefined;

const USE_MOCK = String(envFlag ?? DEFAULT_USE_MOCK).toLowerCase() === "true";

if (USE_MOCK) {
  installMockAdapter(api);
  mockInstalled = true;
}
