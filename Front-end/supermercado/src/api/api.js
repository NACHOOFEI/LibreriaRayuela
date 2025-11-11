import axios from "axios";
import { installMockAdapter } from "./mockAdapter";

// Base URL configurable por entorno, con fallback razonable para dev
const DEFAULT_BASE_URL =
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "https://localhost:7158";
const ENV_BASE =
  typeof import.meta !== "undefined" ? import.meta.env?.VITE_API_BASE_URL : "";

const api = axios.create({
  baseURL: ENV_BASE || DEFAULT_BASE_URL,
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
const ENABLE_AUTO_FALLBACK = false; // Desactiva el fallback automático al mock

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const config = error.config || {};

    if (status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("token");
      try {
        // Actualiza estado global si existe el store
        const { useAuthStore } = await import("../store/authStore");
        useAuthStore.getState()?.logout?.();
      } catch (e) {
        // no-op si el store no está disponible en este contexto
        void e;
      }
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Auto fallback a mock: si backend falla (5xx o fallo de red) y es un endpoint /api/
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
