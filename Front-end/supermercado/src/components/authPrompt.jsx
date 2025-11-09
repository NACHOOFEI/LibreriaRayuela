import React from "react";
import { Link } from "wouter";

export default function AuthPrompt({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
          aria-label="Cerrar"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-2">
          Inicia sesión para continuar
        </h2>
        <p className="text-gray-600 mb-6">
          Para agregar productos al carrito necesitas iniciar sesión o crear una
          cuenta.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/login">
            <a className="flex-1 text-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Iniciar sesión
            </a>
          </Link>
          <Link href="/register">
            <a className="flex-1 text-center px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50">
              Registrarse
            </a>
          </Link>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 border"
          >
            Seguir viendo
          </button>
        </div>
      </div>
    </div>
  );
}
