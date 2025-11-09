import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useLocation } from "wouter";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role } = useAuthStore();
  const [, navigate] = useLocation();
  const [denied, setDenied] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (requiredRole && role !== requiredRole) {
      setDenied(
        "No tienes permisos para acceder a esta sección (se requiere rol: " +
          requiredRole +
          ")"
      );
    } else {
      setDenied("");
    }
  }, [isAuthenticated, role, requiredRole, navigate]);

  if (!isAuthenticated) return null;

  if (denied) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {denied}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
