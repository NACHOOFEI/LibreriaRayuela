import axios from "axios";
import { installMockAdapter } from "./mockAdapter";

const api = axios.create({
  baseURL: "https://localhost:7158", // URL del backend
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de respuesta
let mockInstalled = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const config = error.config || {};

    if (status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Auto fallback a mock: si backend falla (5xx o fallo de red) y es un endpoint /api/
    const isNetworkError = !error.response && !!error.message;
    const isServerError = typeof status === "number" && status >= 500;
    const isApiPath =
      typeof config.url === "string" && config.url.startsWith("/api/");

    if (
      (isNetworkError || isServerError) &&
      isApiPath &&
      !mockInstalled &&
      !config._retriedWithMock
    ) {
      try {
        localStorage.setItem("useMock", "true");
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

// Habilitar Mock API (útil cuando el backend aún no está disponible)
// Toggle por variable de entorno VITE_USE_MOCK o localStorage 'useMock'.
// Por defecto DESACTIVADO para evitar problemas; actívalo solo cuando lo necesites.
const DEFAULT_USE_MOCK = true;
const envFlag =
  typeof import.meta !== "undefined"
    ? import.meta.env?.VITE_USE_MOCK
    : undefined;
const storageFlag =
  typeof localStorage !== "undefined" ? localStorage.getItem("useMock") : null;

let USE_MOCK = DEFAULT_USE_MOCK;
if (typeof envFlag !== "undefined") {
  USE_MOCK = String(envFlag).toLowerCase() === "true";
} else if (storageFlag !== null) {
  USE_MOCK = storageFlag === "true";
}

if (USE_MOCK) {
  installMockAdapter(api);
  mockInstalled = true;
}
