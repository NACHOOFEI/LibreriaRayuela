/**
 * Utilities para trabajar con JWT tokens que tienen claims con namespaces
 */

// Namespace completo que usa ClaimTypes.Role en .NET
const ROLE_CLAIM_NAMESPACE =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const NAME_CLAIM_NAMESPACE =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

/**
 * Decodifica un JWT token y extrae los claims correctamente
 * @param {string} token - JWT token
 * @returns {Object|null} Claims decodificados o null si hay error
 */
export function decodeJwtToken(token) {
  if (!token) return null;

  try {
    // Decodificar la parte del payload (segunda parte del JWT)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    console.error("Error decodificando JWT token:", error);
    return null;
  }
}

/**
 * Extrae el rol del usuario desde el token JWT con soporte para namespaces
 * @param {string} token - JWT token
 * @returns {string|null} Rol del usuario o null si no se encuentra
 */
export function getRoleFromToken(token) {
  const payload = decodeJwtToken(token);
  if (!payload) return null;

  // Intentar diferentes variantes de claims de rol
  const roleCandidates = [
    payload[ROLE_CLAIM_NAMESPACE], // Namespace completo de .NET ClaimTypes.Role
    payload["role"], // Claim simple
    payload["roles"], // Plural
    payload["Role"], // Capitalizado
  ];

  // Retornar el primer rol válido encontrado
  for (const role of roleCandidates) {
    if (role && typeof role === "string") {
      return role;
    }
  }

  return null;
}

/**
 * Extrae el ID del usuario desde el token JWT
 * @param {string} token - JWT token
 * @returns {string|null} ID del usuario o null si no se encuentra
 */
export function getUserIdFromToken(token) {
  const payload = decodeJwtToken(token);
  if (!payload) return null;

  // Intentar diferentes variantes de claims de ID
  const idCandidates = [
    payload[NAME_CLAIM_NAMESPACE], // Namespace completo de .NET
    payload["Id"], // Como está en tu backend
    payload["id"], // Minúscula
    payload["sub"], // Standard JWT claim
  ];

  for (const id of idCandidates) {
    if (id) {
      return String(id);
    }
  }

  return null;
}

/**
 * Verifica si un token JWT ha expirado
 * @param {string} token - JWT token
 * @returns {boolean} true si ha expirado, false si sigue válido
 */
export function isTokenExpired(token) {
  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Obtiene información completa del usuario desde el token JWT
 * @param {string} token - JWT token
 * @returns {Object|null} Información del usuario o null si hay error
 */
export function getUserFromToken(token) {
  if (!token) return null;

  const payload = decodeJwtToken(token);
  if (!payload) return null;

  return {
    id: getUserIdFromToken(token),
    role: getRoleFromToken(token),
    isExpired: isTokenExpired(token),
    exp: payload.exp,
    rawPayload: payload,
  };
}
