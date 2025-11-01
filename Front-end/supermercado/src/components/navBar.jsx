import React from "react";
import { Link, useLocation } from "wouter";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const [location] = useLocation();

  const totalItems = Array.isArray(cart)
    ? cart.reduce((acc, item) => acc + (item.quantity || item.cantidad || 0), 0)
    : 0;

  return (
    <nav className="bg-gray-800 text-white shadow-2xl border-b border-green-700/50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-bold hover:text-yellow-300 transition-colors"
        >
          SuperMercado Chino
        </Link>

        {/* LINKS */}
        <div className="flex gap-6 items-center text-sm font-medium">
          <Link
            href="/"
            className={`hover:text-yellow-300 transition-colors ${
              location === "/" ? "underline font-semibold" : ""
            }`}
          >
            Inicio
          </Link>

          <Link
            href="/elementos"
            className={`hover:text-yellow-300 transition-colors ${
              location === "/elementos" ? "underline font-semibold" : ""
            }`}
          >
            Productos
          </Link>

          {/* CARRITO */}
          <Link
            href="/carrito"
            className="relative hover:text-yellow-300 transition-colors flex items-center border rounded "
          >
            🛒Carrito
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2 py-[1px]">
                {totalItems}
              </span>
            )}
          </Link>

          {/* LOGIN / ADMIN */}
          {isAuthenticated ? (
            <>
              <Link
                href="/admin"
                className={`hover:text-yellow-300 transition-colors ${
                  location === "/admin" ? "underline font-semibold" : ""
                }`}
              >
                Admin
              </Link>

              <span className="text-sm">Hola, {user?.name}</span>

              <button
                onClick={logout}
                className="bg-red-500 px-4 py-1 rounded-md hover:bg-red-600 transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-green-500 px-4 py-1 rounded-md hover:bg-green-600 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
