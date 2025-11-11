# React + Vite

## Backend Integration Setup

Este proyecto está preparado para consumir una API REST con los siguientes endpoints:

Auth

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- PUT /api/auth/{id}/roles

Categories

- GET /api/categories
- POST /api/categories
- GET /api/categories/{id}
- PUT /api/categories/{id}
- DELETE /api/categories/{id}

Customers

- GET /api/customers
- POST /api/customers
- GET /api/customers/{id}
- PUT /api/customers/{id}
- DELETE /api/customers/{id}

Orders

- GET /api/orders
- POST /api/orders
- GET /api/orders/{id}
- DELETE /api/orders/{id}

Products

- GET /api/products
- POST /api/products
- GET /api/products/{id}
- PUT /api/products/{id}
- DELETE /api/products/{id}
- PATCH /api/products/{id}/restar-stock
- PATCH /api/products/{id}/sumar-stock

Users

- GET /api/users

### Variables de Entorno

Crear un archivo `.env` (o usar `.env.local`) con:

```
VITE_API_BASE_URL=https://localhost:7158
VITE_USE_MOCK=false
```

Si `VITE_USE_MOCK=true`, se activará el mock interno para cualquier endpoint `/api/` cuando el backend no esté disponible.

### Servicios

Los módulos en `src/services/*Services.js` encapsulan las llamadas HTTP:

- `authServices`: login, register, logout
- `productServices`: CRUD productos + operaciones de stock
- `categoryServices`: CRUD categorías
- `customerServices`: CRUD clientes
- `orderServices`: CRUD pedidos
- `userServices`: listado de usuarios

### React Query (Caching)

Los hooks de datos viven en `src/services/queries.js` y usan claves (`queryKey`) predecibles para facilitar invalidaciones:

| Hook              | queryKey          | Invalidaciones típicas                           |
| ----------------- | ----------------- | ------------------------------------------------ |
| `useProducts()`   | `['products']`    | Crear/editar/eliminar producto, cambios de stock |
| `useProduct(id)`  | `['product', id]` | Editar producto, operaciones de stock            |
| `useCategories()` | `['categories']`  | Crear/editar/eliminar categoría                  |
| `useUsers()`      | `['users']`       | Cambios administrativos de usuarios              |

Ejemplo de invalidación tras crear un producto:

```js
queryClient.invalidateQueries({ queryKey: ["products"] });
```

Para actualizar el detalle específico:

```js
queryClient.invalidateQueries({ queryKey: ["product", id] });
```

### Autenticación

El token JWT se guarda en `localStorage` bajo la clave `token`. El interceptor de Axios lo añade automáticamente a cada request.
En caso de 401 se fuerza logout y se redirige a `/login`.

### Mock API

Implementado en `src/api/mockAdapter.js`. Activar con `VITE_USE_MOCK=true`. Útil para desarrollo cuando el backend no está listo.

### Flujo para agregar nuevos endpoints

1. Añadir método en el service correspondiente.
2. Consumir el método desde el componente/página.
3. Manejar errores mostrando mensajes amigables.

### Scripts

`pnpm dev` / `npm run dev` para iniciar el frontend.
`pnpm build` para compilar.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
