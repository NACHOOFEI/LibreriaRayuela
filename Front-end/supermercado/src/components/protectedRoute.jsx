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

    const token = localStorage.getItem("token");
    if (!token) {
      setAuthorized(false);
      setLoading(false);
      setTimeout(() => navigate("/login"), 100);
      return;
    }

    const userInfo = getUserFromToken(token);

    if (!userInfo || userInfo.isExpired) {
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
      setAuthorized(false);
      setLoading(false);
      setTimeout(() => navigate("/login"), 100);
      return;
    }

    // Verificamos si alguno de los roles del usuario coincide con el requerido
    const hasRole = userInfo.roles.some(
      (role) => role.toLowerCase() === requiredRole.toLowerCase()
    );

    setAuthorized(hasRole);
    setLoading(false);

    if (!hasRole) {
      setTimeout(() => navigate("/login"), 100);
    }
  }, [location, navigate, requiredRole]);

  if (loading) return <div className="p-4 text-center">Verificando acceso...</div>;
  if (!authorized) return <div className="p-4 text-center">Redirigiendo...</div>;

  return children;
}