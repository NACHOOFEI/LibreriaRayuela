import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useLocation } from "wouter";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
}
