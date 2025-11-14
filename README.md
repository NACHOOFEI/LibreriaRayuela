# 📚 Librería Online

## 🚀 Descripción del Proyecto

**Librería Online** es un sistema completo para gestionar la venta de
libros por internet, ofreciendo una experiencia fluida al usuario y una
administración sólida para los administradores.

Incluye:

-   Registro e inicio de sesión mediante **JWT**
-   Navegación de libros por categorías
-   Carrito de compras persistente (Zustand)
-   Generación de órdenes
-   Validación de stock en tiempo real
-   Envío de mensajes automáticos por **WhatsApp API**
-   Manejo de roles (Admin / User)
-   Publicación de libros con imágenes en AWS S3

------------------------------------------------------------------------

## 🏗️ Tecnologías Utilizadas

### 🔧 Backend (.NET 8 - ASP.NET Core Web API)

-   .NET 8 -- ASP.NET Core Web API\
-   Entity Framework Core\
-   SQL Server\
-   JWT Authentication\
-   AutoMapper\
-   AWS S3 SDK\
-   Swagger

### 💻 Frontend (React + Vite)

-   React + Vite\
-   Zustand\
-   Axios\
-   TailwindCSS\
-   React Router

------------------------------------------------------------------------

## 🔐 Autenticación y Autorización

El backend usa **JWT Authentication** con roles.\
El frontend usa un componente `ProtectedRoute` para permitir solo a
ciertos roles acceder a determinadas vistas.

------------------------------------------------------------------------

## 🧠 Funcionalidades Principales

### ✔ Usuarios

-   Registro
-   Login
-   Ver perfil
-   Actualización
-   Asignación de roles (solo Admin)

### ✔ Libros y Catálogo

-   CRUD de libros (solo Admin)
-   Gestión de categorías
-   Stock en tiempo real
-   Imágenes alojadas en AWS S3

### ✔ Carrito de Compras

-   Persistencia con Zustand
-   Cálculo automático de totales

### ✔ Pedidos

-   Generación de órdenes
-   Historial por usuario
-   Validación de stock
-   Integración con Mercado Pago

### ✔ WhatsApp API

-   Notificaciones automáticas de compra usando Meta WhatsApp Cloud API

------------------------------------------------------------------------

## 🛠 Variables de Entorno (Backend)

**appsettings.json**

``` json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=LibreriaDB;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Secrets": {
    "JWT": {
      "Key": "TU_KEY_SECRETA_ACA"
    },
    "AWS": {
      "AccessKey": "TU_ACCESS_KEY_AWS",
      "SecretKey": "TU_SECRET_KEY_AWS",
      "BucketName": "NOMBRE_DEL_BUCKET_S3",
      "Region": "REGION_AWS"
    },
    "WSP": {
      "Token": "TU_TOKEN_DE_WHATSAPP",
      "PhoneNumberId": "TU_PHONE_ID"
    }
  }
}
```

------------------------------------------------------------------------

## 📂 Estructura del Proyecto

## 📂 Estructura del Proyecto — Backend

```
/Config
    AplicacionDbContext.cs
    Mapping.cs

/Controllers
    AuthController.cs
    CategoryController.cs
    CustomerController.cs
    OrderController.cs
    ProductController.cs
    UserController.cs

/Enums

/Migrations

/Models
    /Category
        Category.cs
    /Customer
        Customer.cs
    /Order
        Order.cs
        /Dto
            OrderDto.cs
    /OrderItem
        OrderItem.cs
        /Dto
            OrderItemDto.cs
    /Product
        Product.cs
        /Dto
            ProductDto.cs
    /Rol
        Rol.cs
    /User
        User.cs
        /Dto
            UserDto.cs

/Repositories
    CategoryRepository.cs
    CustomerRepository.cs
    OrderItemRepository.cs
    OrderRepository.cs
    ProductRepository.cs
    RolRepository.cs
    UserRepository.cs
    Repository.cs

/Services
    AuthServices.cs
    CategoryServices.cs
    CustomerServices.cs
    EncoderServices.cs
    OrderItemServices.cs
    OrderServices.cs
    ProductServices.cs
    RolServices.cs
    S3Services.cs
    UserServices.cs
    WhatsAppServices.cs

/Utils
    appsettings.json
    Program.cs
    SuperChino.http
```

---
------------------------------------------------------------------------

### 📁 Frontend (React + Vite)

    /src
        /components
        /pages
        /routes
        /store
            cartStore.js
        /services
            axiosServices.js
            bookService.js
            orderService.js
        /utils
            jwtUtils.js
        App.jsx

------------------------------------------------------------------------

## 🔎 Endpoints Principales

### Autenticación

  Método   Endpoint             Descripción      Rol
  -------- -------------------- ---------------- -------------
  POST     /api/auth/register   Registro         Público
  POST     /api/auth/login      Login            Público
  GET      /api/auth/me         Usuario actual   Autenticado

### Usuarios

  Método   Endpoint                Descripción          Rol
  -------- ----------------------- -------------------- -------------
  GET      /api/users              Listar usuarios      Admin
  GET      /api/users/{id}         Obtener usuario      Autenticado
  PUT      /api/users/{id}         Actualizar usuario   Autenticado
  PUT      /api/users/{id}/roles   Asignar roles        Admin

### Libros

  Método   Endpoint          Descripción        Rol
  -------- ----------------- ------------------ ---------
  GET      /api/books        Listar libros      Público
  GET      /api/books/{id}   Obtener libro      Público
  POST     /api/books        Crear libro        Admin
  PUT      /api/books/{id}   Actualizar libro   Admin
  DELETE   /api/books/{id}   Eliminar libro     Admin

### Categorías

  Método   Endpoint          Rol
  -------- ----------------- ---------
  GET      /api/categories   Público
  POST     /api/categories   Admin

### Órdenes

  Método   Endpoint                    Rol
  -------- --------------------------- -------------
  POST     /api/orders                 Crear orden
  GET      /api/orders/user/{userId}   Historial
  GET      /api/orders/{id}            Detalle

### WhatsApp

  Método   Endpoint             Rol
  -------- -------------------- ----------------
  POST     /api/whatsapp/send   Enviar mensaje

------------------------------------------------------------------------

## ▶️ Cómo Ejecutar el Proyecto

### 🖥️ Backend

``` sh
cd Backend
dotnet restore
dotnet ef database update
dotnet run
```

Backend por defecto: **https://localhost:7020**

------------------------------------------------------------------------

### 🌐 Frontend

``` sh
cd Frontend
npm install
npm run dev
```

Frontend por defecto: **http://localhost:5173**

------------------------------------------------------------------------

## 🧪 Flujo Básico de Uso

1.  Registrar usuario\
2.  Iniciar sesión\
3.  Listar libros\
4.  Agregar al carrito\
5.  Crear orden (envía WhatsApp automáticamente)

------------------------------------------------------------------------

## 📌 Autor

Proyecto desarrollado por **Ignacio Orfei**.
