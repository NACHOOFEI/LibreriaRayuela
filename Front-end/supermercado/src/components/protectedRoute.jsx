import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";

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
      const userData = localStorage.getItem("authUser");

      if (!token || !userData) {
        setLoading(false);
        setAuthorized(false);
        setTimeout(() => navigate("/login"), 100);
        return;
      }

      try {
        const user = JSON.parse(userData);
        const userRole = (user.role || "").toLowerCase();
        const reqRole = (requiredRole || "").toLowerCase();

        if (userRole === reqRole) {
          setAuthorized(true);
          setLoading(false);
        } else {
          setAuthorized(false);
          setLoading(false);
          setTimeout(() => navigate("/login"), 100);
        }
      } catch {
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
