import api from "../api/api";
import { getUserFromToken } from "../utils/jwtUtils";

const TOKEN_KEY = "token";

/**
 * Intenta iniciar sesión con las credenciales proporcionadas
 * @param {Object} credentials - Credenciales del usuario
 * @param {string} credentials.email - Email del usuario
 * @param {string} credentials.password - Contraseña del usuario
 * @returns {Promise<Object>} Datos del usuario y token
 * @throws {Error} Si las credenciales son inválidas o hay un error de red
 */
const login = async (credentials) => {
  try {
    const response = await api.post("/api/auth/login", credentials);
    const { token, user } = response.data;

    // Guardar el token
    localStorage.setItem(TOKEN_KEY, token);

    // Extraer información del usuario directamente del token JWT
    // Esto asegura que leemos correctamente los claims con namespace
    const tokenInfo = getUserFromToken(token);

    if (tokenInfo?.isExpired) {
      throw new Error("El token recibido ya ha expirado");
    }

    // Combinar datos del backend con información extraída del token
    const enrichedUser = {
      ...user,
      id: tokenInfo?.id || user.id,
      role: tokenInfo?.role || user.roles?.[0] || "User",
      email: user.email || credentials.email,
    };

    return { user: enrichedUser };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Credenciales inválidas");
    }
    if (error.response?.status === 404) {
      throw new Error(
        "Endpoint no encontrado. Verifica que el backend esté corriendo en " +
          api.defaults.baseURL
      );
    }
    if (error.code === "ECONNREFUSED") {
      throw new Error(
        "No se puede conectar al backend. Verifica que esté corriendo en " +
          api.defaults.baseURL
      );
    }
    throw new Error(
      "Error al iniciar sesión: " +
        (error.response?.data?.message || error.message)
    );
  }
};

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del nuevo usuario
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.password - Contraseña del usuario
 * @param {string} userData.name - Nombre del usuario
 * @returns {Promise<Object>} Datos del usuario registrado
 * @throws {Error} Si hay un error en el registro
 */
const register = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(
        "Datos de registro inválidos: " + (error.response?.data?.message || "")
      );
    }
    throw new Error(
      "Error al registrar: " + (error.response?.data?.message || error.message)
    );
  }
};

/**
 * Cierra la sesión del usuario actual
 * @returns {Promise<void>}
 */
const logout = async () => {
  try {
    // Solo intentamos hacer logout en el backend si hay un token
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      await api.post("/api/auth/logout");
    }
  } catch (error) {
    console.warn("Error al hacer logout en el servidor:", error);
  } finally {
    // Siempre eliminamos el token local
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Verifica si hay un usuario autenticado
 * @returns {boolean}
 */
const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

/**
 * Obtiene el token actual
 * @returns {string|null}
 */
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export default {
  login,
  register,
  logout,
  isAuthenticated,
  getToken,
};

/**
 * Actualiza los roles de un usuario (requiere permisos de admin)
 * @param {number|string} userId
 * @param {object} payload - Ej: { roles: ["Admin", "User"] } o { role: "Admin" }
 */
export async function updateRoles(userId, rolesIds) {
  try {
    const { data } = await api.put(`/api/auth/${userId}/roles`, rolesIds);
    return data;
  } catch (error) {
    throw new Error(
      "Error al actualizar roles: " +
        (error.response?.data?.message || error.message)
    );
  }
}
