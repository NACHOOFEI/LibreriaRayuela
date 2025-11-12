# 🛒 Supermercado - Frontend

Aplicación web de supermercado con React + Vite. Panel admin para gestión de productos y carrito para clientes.

## 🚀 Inicio Rápido

```bash
npm install
npm run dev
```

**Requisito:** Backend ASP.NET Core en `https://localhost:7158`

## 🛠️ Stack

- **React 19** + **Vite** + **Tailwind CSS**
- **Zustand** (estado) + **React Query** (servidor)
- **React Hook Form** + **Zod** (validación)
- **Axios** (API) + **Wouter** (routing)

## 📂 Estructura

```
src/
├── components/    # Componentes UI
├── pages/        # Rutas principales
├── store/        # Estado global
├── services/     # API calls
└── api/         # Config Axios
```

## ✨ Características

**Cliente:**

- Catálogo con búsqueda/filtros
- Carrito de compras
- Autenticación JWT

**Admin:**

- Panel de administración
- CRUD productos + imágenes
- Dashboard estadísticas

## 🔐 Roles

- **Cliente**: Acceso catálogo y carrito
- **Admin**: Panel completo + gestión

## ⚙️ Configuración

```env
VITE_API_BASE_URL=https://localhost:7158
VITE_USE_MOCK=false
```

## 📦 Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Producción
npm run preview  # Preview
npm run lint     # Linting
```

## 🌐 API Endpoints

```
# Productos
GET    /api/products
POST   /api/products     (Admin)
PUT    /api/products/:id (Admin)
DELETE /api/products/:id (Admin)

# Auth
POST   /api/auth/login
POST   /api/auth/register
```

## 🔄 Flujo Auth

1. Login → JWT token
2. Token → localStorage
3. Axios interceptors → Headers automáticos
4. Rutas protegidas por rol

## 📱 Rutas

- `/` → Home
- `/login` → Login
- `/elementos` → Catálogo
- `/elementos/:id` → Detalle
- `/admin` → Panel Admin (Admin only)
- `/cart` → Carrito

## 💾 Estado

**Auth Store:** usuario, token, login/logout  
**Cart Store:** items, total, add/remove/update

---
