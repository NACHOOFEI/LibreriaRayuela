import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} Librería Rayuela. Todos los derechos reservados.
        </p>

        <div className="flex gap-4">
          <a
            href="https://facebook.com/libreriarayuela"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com/libreriarayuela"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            Instagram
          </a>
          <a
            href="mailto:contacto@libreriarayuela.com"
            className="hover:text-white transition-colors duration-200"
          >
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
