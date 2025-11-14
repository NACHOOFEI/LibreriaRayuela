import React, { useState, useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import axiosServices from "../services/axiosServices";
import { getUserFromToken } from "../utils/jwtUtils";

// ============================
// 📦 Servicios auxiliares
// ============================
export const orderService = {
  createOrder: async (orderData) => {
    const response = await axiosServices.post("/api/orders", orderData);
    return response.data;
  },
};

export const customerService = {
  getByUserId: async (userId) => {
    const response = await axiosServices.get(`/api/customers/${userId}`);
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await axiosServices.post("/api/customers", customerData);
    return response.data;
  },
};

// ============================
// 🛒 Componente principal
// ============================
export default function CartSummary({ onCheckout, shipping, setShipping }) {
  const { items, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    dni: "",
    phone: "",
    address: "",
  });
  const [currentUser, setCurrentUser] = useState(null);

  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const envio = shipping === "delivery" ? 4.99 : 0;
  const total = subtotal + envio;

  // ============================
  // 🔐 Cargar usuario desde el token
  // ============================
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const user = getUserFromToken(token);
        if (user && !user.isExpired) {
          setCurrentUser(user);
        }
      }
    } catch (error) {
      console.error("Error cargando usuario:", error);
    }
  }, []);

  // ============================
  // 🧩 Helpers
  // ============================
  const getSafeUsername = (user) => {
    if (!user) return "Usuario";
    return user.name || user.username || "Usuario";
  };

  const getSafeUserId = (user) => {
    if (!user) return null;
    return user.id || user.sub || user.userId || user.nameidentifier;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({ ...prev, [name]: value }));
  };

  // ============================
  // 🧾 Checkout principal
  // ============================
  const handleCheckout = async () => {
    try {
      setLoading(true);

      if (!currentUser) {
        alert("Debe iniciar sesión para finalizar la compra.");
        setLoading(false);
        return;
      }

      const userId = getSafeUserId(currentUser);
      if (!userId) throw new Error("No se pudo obtener el ID del usuario");

      console.log("Buscando customer para userId:", userId);
      const customer = await customerService.getByUserId(userId);

      console.log("Customer encontrado:", customer);
      await createOrder(customer);
    } catch (error) {
      console.log("Customer no encontrado, mostrando formulario...");
      setCustomerForm({
        name: getSafeUsername(currentUser),
        dni: "",
        phone: "",
        address: "",
      });
      setShowCustomerForm(true);
      setLoading(false);
    }
  };

  // ============================
  // 🧍 Crear nuevo Customer
  // ============================
  const handleCreateCustomer = async () => {
    try {
      setLoading(true);

      if (!currentUser) {
        alert("Error: No se encontró información del usuario.");
        setLoading(false);
        return;
      }

      const { name, dni, phone, address } = customerForm;

      if (!name || !dni || !phone || !address) {
        alert("Por favor complete todos los campos obligatorios");
        setLoading(false);
        return;
      }

      const userId = getSafeUserId(currentUser);
      if (!userId) {
        alert("Error: No se pudo identificar al usuario.");
        setLoading(false);
        return;
      }

      const newCustomerData = {
        name,
        dni,
        phone,
        address,
        userId,
      };

      console.log("📤 Enviando customer al backend:", newCustomerData);

      const createdCustomer = await customerService.createCustomer(newCustomerData);
      console.log("✅ Customer creado:", createdCustomer);

      setShowCustomerForm(false);
      await createOrder(createdCustomer);
    } catch (err) {
      console.error("Error creando customer:", err.response || err);
      alert(
        "Error al crear el perfil: " +
          (err.response?.data?.message || err.message || "Error desconocido")
      );
      setLoading(false);
    }
  };

  // ============================
  // 📦 Crear orden
  // ============================
const createOrder = async (customer) => {
  try {
    const orderData = {
      customerId: customer.id,
      total: total, // ✅ AGREGAR ESTA LÍNEA
      items: items.map(it => ({
        productId: it.id,
        quantity: it.quantity
        // ❌ QUITAR: orderId: 0
      }))
    };

    console.log("📦 Enviando orden:", orderData);

    const order = await axiosServices.post("/api/orders", orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    alert("✅ Pedido creado correctamente. Total: $" + order.data.total.toFixed(2));
    clearCart();
    if (onCheckout) onCheckout();
  } catch (err) {
    console.error("Error creando orden:", err);
    console.error("Detalles del error:", err.response?.data);
    alert("Error al crear el pedido: " + (err.response?.data?.message || err.message || "Error desconocido"));
  } finally {
    setLoading(false);
  }
};

  const handleCancelCustomerForm = () => {
    setShowCustomerForm(false);
    setLoading(false);
  };

  // ============================
  // 🧠 Debug autenticación
  // ============================
  const debugAuth = () => {
    console.log("=== DEBUG AUTH ===");
    console.log("Token:", localStorage.getItem("token"));
    console.log("CurrentUser:", currentUser);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userFromToken = getUserFromToken(token);
        console.log("User from token:", userFromToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  // ============================
  // 🖼 Render
  // ============================
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Resumen de la compra</h2>

      <button
        onClick={debugAuth}
        className="w-full mb-4 bg-yellow-500 text-white py-2 rounded text-sm"
      >
        Debug Autenticación
      </button>

      <div className="mb-2">
        Subtotal:
        <span className="float-right font-bold">${subtotal.toFixed(2)}</span>
      </div>

      <hr className="my-4" />

      <div className="my-3">
        <label className="block text-sm font-medium mb-1">Envío</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="shipping"
              value="pickup"
              checked={shipping === "pickup"}
              onChange={() => setShipping("pickup")}
            />
            Retiro en supermercado (Gratis)
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="shipping"
              value="delivery"
              checked={shipping === "delivery"}
              onChange={() => setShipping("delivery")}
            />
            Envío a domicilio ($4.99)
          </label>
        </div>
      </div>

      <div className="text-2xl font-bold">
        Total <span className="float-right">${total.toFixed(2)}</span>
      </div>

      {showCustomerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Completa tus datos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Necesitamos tus datos para procesar el pedido
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerForm.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">DNI *</label>
                <input
                  type="text"
                  name="dni"
                  value={customerForm.dni}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="00000000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerForm.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="111222333"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="address"
                  value={customerForm.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Calle Falsa 123"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCancelCustomerForm}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={handleCreateCustomer}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded disabled:bg-blue-300"
              >
                {loading ? "Creando..." : "Continuar compra"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={items.length === 0 || loading}
        className={`w-full text-white py-2 mt-6 rounded ${
          items.length === 0 || loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Procesando..." : "Finalizar compra"}
      </button>

      <button
        onClick={clearCart}
        className="w-full mt-2 bg-red-500 text-white py-2 rounded"
      >
        Vaciar carrito
      </button>
    </div>
  );
}
