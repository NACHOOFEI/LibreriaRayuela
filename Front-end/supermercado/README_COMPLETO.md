# React + Vite - Proyecto Supermercado

## Cumplimiento de Requisitos del Examen

### ✅ Requisitos Técnicos Obligatorios (Frontend)

1. **useState**: Utilizado en múltiples componentes para filtros, toggles, formularios controlados

   - `elementos.jsx`: filtros de búsqueda, categoría, ordenamiento, paginación
   - `login.jsx`, `register.jsx`: estados de loading y errores
   - `adminPanel.jsx`: estados de UI, filtros de tabla

2. **useEffect**: Efectos secundarios implementados

   - `App.jsx`: rehidratación del store de autenticación
   - `adminPanel.jsx`: manejo de errores de productos

3. **wouter**: Ruteo implementado con todas las rutas obligatorias

   - `/` → Home
   - `/login` → Login
   - `/elementos` → Listado de productos
   - `/elementos/:id` → Detalle de producto
   - `/admin` → Panel de administración

4. **axios**: Todas las llamadas HTTP se realizan con axios

   - Configurado en `src/api/api.js` con interceptores
   - Servicios en `src/services/*Services.js`
   - Token JWT automático en headers

5. **Lazy loading**: Implementado con React.lazy + Suspense

   - `AdminPanel` cargado perezosamente
   - `ElementoDetail` cargado perezosamente
   - `CreateProduct` cargado perezosamente

6. **zustand**: Estado global para autenticación y carrito

   - `src/store/authStore.js`: usuario, rol, sesión
   - `src/store/cartStore.jsx`: carrito de compras

7. **zod**: Validación de esquemas en formularios

   - Login: email + password
   - Registro: nombre, email, password, confirmación
   - Crear producto: nombre, descripción, precio, stock, imagen

8. **react-hook-form**: Integrado con zod en todos los formularios
   - `@hookform/resolvers/zod` configurado
   - Validación antes del envío

### ✅ Requisitos Funcionales Completados

**A. Autenticación y autorización**

- ✅ Formulario login con zod + react-hook-form
- ✅ Token guardado y enviado en axios headers
- ✅ Usuario y rol guardados en zustand
- ✅ Rutas protegidas según roles

**B. Listado de elementos (/elementos)**

- ✅ Listado paginado de productos
- ✅ Búsqueda por nombre/descripción usando useState
- ✅ Filtros por categoría usando useState
- ✅ Ordenamiento por precio

**C. Detalle de elemento (/elementos/:id)**

- ✅ Componente cargado con React.lazy
- ✅ Detalle completo del producto
- ✅ Integración con carrito de compras

**D. Formulario admin (/admin/productos/nuevo)**

- ✅ Validado con zod + react-hook-form
- ✅ Solo accesible para rol Admin
- ✅ Crear/editar productos

**E. Administración/Estadísticas (/admin)**

- ✅ Panel cargado perezosamente
- ✅ Total de elementos, usuarios
- ✅ Estadísticas por categoría con gráficos
- ✅ Solo accesible para Admin

**F. Persistencia y API**

- ✅ Endpoints REST definidos
- ✅ Consumo con axios
- ✅ Autenticación con JWT

## React Query Integration

Este proyecto utiliza `@tanstack/react-query` para el manejo avanzado de estado del servidor y cacheo.

### Hooks Disponibles

```javascript
// Products
useProducts(); // Lista todos los productos
useProduct(id); // Obtiene un producto específico

// Users
useUsers(); // Lista usuarios (solo admin)

// Categories
useCategories(); // Lista categorías

// Customers
useCustomers(); // Lista clientes
useCustomer(id); // Cliente específico

// Orders
useOrders(); // Lista pedidos
useOrder(id); // Pedido específico
```

### Patrón de Mutaciones

```javascript
// Ejemplo en createProduct.jsx
const mutation = useMutation({
  mutationFn: ({ url, formData }) => axiosServices.post(url, formData, headers),
  onSuccess: () => {
    // Invalidar cache para re-fetchear datos
    queryClient.invalidateQueries({ queryKey: ["products"] });
    navigate("/admin");
  },
});
```

### Cache Keys Strategy

- `["products"]` → Lista de productos
- `["product", id]` → Producto específico
- `["users"]` → Lista de usuarios
- `["categories"]` → Lista de categorías
- `["customers"]` → Lista de clientes
- `["orders"]` → Lista de pedidos

## Scripts de Desarrollo

```bash
npm install          # Instalar dependencias
npm run dev         # Iniciar servidor de desarrollo
npm run build       # Compilar para producción
npm run preview     # Vista previa del build
```

## Variables de Entorno

Crear archivo `.env`:

```
VITE_API_BASE_URL=https://localhost:7158
VITE_USE_MOCK=false
VITE_MOCK_DELAY=50
```

## Arquitectura del Proyecto

```
src/
├── api/                # Configuración axios y mock
├── components/         # Componentes reutilizables
├── pages/             # Páginas principales (rutas)
├── services/          # Servicios HTTP y React Query hooks
├── store/             # Estado global (Zustand)
└── utils/             # Utilidades
```

## Endpoints API Backend

### Autenticación

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `PUT /api/auth/{id}/roles`

### Productos (Elementos)

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `PATCH /api/products/{id}/restar-stock`
- `PATCH /api/products/{id}/sumar-stock`

### Categorías

- `GET /api/categories`
- `POST /api/categories`
- `GET /api/categories/{id}`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

### Usuarios

- `GET /api/users`

### Clientes

- `GET /api/customers`
- `POST /api/customers`
- `GET /api/customers/{id}`
- `PUT /api/customers/{id}`
- `DELETE /api/customers/{id}`

### Pedidos

- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/{id}`
- `DELETE /api/orders/{id}`

## Características Principales

- **Autenticación JWT** con roles Admin/User
- **Estado global** con Zustand
- **Validación robusta** con Zod + React Hook Form
- **Lazy loading** de rutas pesadas
- **Cache inteligente** con React Query
- **Mock API** para desarrollo sin backend
- **Diseño responsivo** con Tailwind CSS
- **Estados de loading** y manejo de errores
- **Paginación** y filtros en listados
