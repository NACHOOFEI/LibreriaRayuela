import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getUserFromToken } from "../utils/jwtUtils";

export default function ProtectedRoute({ children, requiredRole = "Admin" }) {
  const [location, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (location === "/login") {
      setLoading(false);
      return;
    }

    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        setAuthorized(false);
        setTimeout(() => navigate("/login"), 100);
        return;
      }

      // Verificar token y extraer rol directamente
      const tokenInfo = getUserFromToken(token);

      if (!tokenInfo || tokenInfo.isExpired) {
        // Token inválido o expirado, limpiar y redirigir
        localStorage.removeItem("token");
        localStorage.removeItem("authUser");
        setLoading(false);
        setAuthorized(false);
        setTimeout(() => navigate("/login"), 100);
        return;
      }

      // Verificar rol requerido
      const userRole = (tokenInfo.role || "").toLowerCase();
      const reqRole = (requiredRole || "").toLowerCase();

      if (userRole === reqRole) {
        setAuthorized(true);
        setLoading(false);
      } else {
        setAuthorized(false);
        setLoading(false);
        setTimeout(() => navigate("/login"), 100);
      }
    };

    checkAuth();
  }, [location, navigate, requiredRole]);

  if (loading) {
    return <div className="p-4 text-center">Verificando acceso...</div>;
  }

  if (!authorized) {
    return <div className="p-4 text-center">Redirigiendo...</div>;
  }

  return children;
}
