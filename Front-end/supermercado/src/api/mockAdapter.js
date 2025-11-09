import axios from "axios";

/**
 
 * @param {import('axios').AxiosInstance} api
 */
export function installMockAdapter(api) {
  console.info("[MockAPI] Activado: respondiendo con datos simulados");

  // Estado en memoria
  const db = {
    users: [
      {
        id: 1,
        email: "admin@demo.com",
        password: "admin123",
        name: "Admin",
        role: "Admin",
      },
      {
        id: 2,
        email: "user@demo.com",
        password: "user123",
        name: "Usuario",
        role: "User",
      },
    ],
    products: loadProducts() || generateProducts(24),
    tokens: new Map(),
  };

  function generateProducts(count) {
    const categorias = ["alimentos", "hogar", "electrónica", "bebidas"];
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `Producto ${i + 1}`,
      description: `Descripción detallada del producto ${
        i + 1
      } para pruebas de layout y visualización en el catálogo.`,
      category: categorias[i % categorias.length],
      price: Number((Math.random() * 100 + 10).toFixed(2)),
      stock: Math.floor(Math.random() * 50) + 1,
      discount:
        Math.random() < 0.3 ? Math.floor(Math.random() * 40) + 10 : null,
      image: `https://picsum.photos/seed/mock${i + 1}/600/600`,
    }));
  }

  // Persistencia en localStorage para productos
  function loadProducts() {
    try {
      if (typeof localStorage === "undefined") return null;
      const raw = localStorage.getItem("mock:products");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return null;
    } catch {
      return null;
    }
  }
  function saveProducts(products) {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem("mock:products", JSON.stringify(products));
    } catch {
      // ignore
    }
  }

  // Latencia configurable (menor por defecto para rapidez)
  const defaultDelay = 50;
  const envDelay =
    typeof import.meta !== "undefined"
      ? Number(import.meta.env?.VITE_MOCK_DELAY ?? "")
      : NaN;
  const storageDelay =
    typeof localStorage !== "undefined"
      ? Number(localStorage.getItem("mockDelay") ?? "")
      : NaN;
  const MOCK_DELAY = Number.isFinite(envDelay)
    ? envDelay
    : Number.isFinite(storageDelay)
    ? storageDelay
    : defaultDelay;
  const wait = (ms = MOCK_DELAY) =>
    ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve();

  const originalAdapter = (() => {
    try {
      if (typeof axios.getAdapter === "function") {
        const fn = axios.getAdapter("xhr", "http");
        if (typeof fn === "function") return fn;
      }
    } catch {
      // ignorar y continuar con fallback
    }
    return axios.defaults && axios.defaults.adapter;
  })();

  // Interceptor "adapter" que decide si mockear o delegar al adaptador real
  api.defaults.adapter = async (config) => {
    if (shouldMock(config)) {
      try {
        return await routeMock(config, db);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    if (typeof originalAdapter !== "function") {
      return Promise.reject(
        new TypeError("No se encontró un adaptador real de Axios válido")
      );
    }
    return originalAdapter(config);
  };

  function shouldMock(config) {
    // Para simplicidad: todo lo que empiece con /api/ lo mockeamos
    return config.url?.startsWith("/api/");
  }

  async function routeMock(config, db) {
    const method = (config.method || "get").toLowerCase();
    const url = config.url;
    const data = config.data;
    await wait();
    // AUTH
    if (url === "/api/auth/login" && method === "post") {
      const body = parseMaybeJson(data);
      const user = db.users.find(
        (u) => u.email === body.email && u.password === body.password
      );
      if (!user) return reject(config, 401, "Credenciales inválidas");
      const token = "mock-token-" + user.id + "-" + Date.now();
      db.tokens.set(token, user.id);
      return resolve(config, { token, name: user.name, role: user.role });
    }
    if (url === "/api/auth/register" && method === "post") {
      const body = parseMaybeJson(data);
      if (db.users.some((u) => u.email === body.email))
        return reject(config, 400, "Email ya registrado");
      const newUser = {
        id: db.users.length + 1,
        email: body.email,
        password: body.password,
        name: body.name || body.email.split("@")[0],
        role: "User",
      };
      db.users.push(newUser);
      return resolve(config, {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
    }
    if (url === "/api/auth/logout" && method === "post") {
      return resolve(config, { ok: true });
    }

    // PRODUCTS LIST
    if (url === "/api/products" && method === "get") {
      return resolve(config, db.products);
    }
    // USERS LIST para estadísticas del panel admin
    if (url === "/api/users" && method === "get") {
      // Retornamos los usuarios sin el campo password
      const safeUsers = db.users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
      }));
      return resolve(config, safeUsers);
    }
    // PRODUCT DETAIL
    if (/^\/api\/products\/\d+$/.test(url) && method === "get") {
      const id = Number(url.split("/").pop());
      const prod = db.products.find((p) => p.id === id);
      if (!prod) return reject(config, 404, "Producto no encontrado");
      return resolve(config, prod);
    }
    // CREATE PRODUCT
    if (url === "/api/products" && method === "post") {
      const body = parseMaybeJson(data);
      const id = db.products.length + 1;
      const newProd = {
        id,
        title: body.title ?? `Nuevo Producto ${id}`,
        description: body.description ?? "Sin descripción",
        category: body.category ?? "general",
        price: body.price ?? 0,
        stock: body.stock ?? 0,
        discount: null,
        image: body.image ?? `https://picsum.photos/seed/new${id}/600/600`,
      };
      db.products.push(newProd);
      saveProducts(db.products);
      return resolve(config, newProd, 201);
    }
    // UPDATE PRODUCT
    if (/^\/api\/products\/\d+$/.test(url) && method === "put") {
      const id = Number(url.split("/").pop());
      const body = parseMaybeJson(data);
      const idx = db.products.findIndex((p) => p.id === id);
      if (idx === -1) return reject(config, 404, "Producto no encontrado");
      db.products[idx] = { ...db.products[idx], ...body };
      saveProducts(db.products);
      return resolve(config, db.products[idx]);
    }
    // DELETE PRODUCT
    if (/^\/api\/products\/\d+$/.test(url) && method === "delete") {
      const id = Number(url.split("/").pop());
      const idx = db.products.findIndex((p) => p.id === id);
      if (idx === -1) return reject(config, 404, "Producto no encontrado");
      db.products.splice(idx, 1);
      saveProducts(db.products);
      return resolve(config, { ok: true });
    }

    return reject(config, 501, "Endpoint mock no implementado: " + url);
  }

  function parseMaybeJson(raw) {
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  function resolve(config, data, status = 200) {
    return Promise.resolve({
      data,
      status,
      statusText: "OK",
      headers: {},
      config,
    });
  }
  function reject(config, status, message) {
    return Promise.reject({
      response: {
        data: { message },
        status,
        statusText: "Error",
        headers: {},
        config,
      },
      message,
      config,
    });
  }
}
