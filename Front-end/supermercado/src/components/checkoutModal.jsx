import React, { useState } from "react";

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  total,
  shipping = "pickup",
  onSuccess,
}) {
  const [form, setForm] = useState({
    name: "",
    card: "",
    expiry: "",
    cvv: "",
    email: "",
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Ingresa el nombre del titular";
    if (!/^\d{13,19}$/.test(form.card.replace(/\s+/g, "")))
      return "Número de tarjeta inválido";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) return "Fecha inválida (MM/AA)";
    if (!/^\d{3,4}$/.test(form.cvv)) return "CVV inválido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email inválido";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");
    setProcessing(true);
    try {
      // Simular procesamiento de pago
      await new Promise((r) => setTimeout(r, 1200));
      onSuccess?.();
      onClose?.();
    } finally {
      setProcessing(false);
    }
  };

  const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Finalizar compra</h2>
          <button
            className="text-gray-500 hover:text-gray-900"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div>
            <h3 className="font-semibold mb-3">Resumen</h3>
            <div className="text-sm text-gray-700 mt-2">
              Método:{" "}
              {shipping === "delivery"
                ? "Envío a domicilio"
                : "Retiro en tienda"}
            </div>
            <ul className="space-y-2 max-h-48 overflow-auto pr-2">
              {items.map((it) => (
                <li key={it.id} className="flex justify-between text-sm">
                  <span className="truncate mr-2">
                    {it.title} × {it.quantity}
                  </span>
                  <span>${(it.price * it.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t pt-3 text-sm text-gray-600">
              Productos: {totalItems}
            </div>
            <div className="text-xl font-bold mt-1">
              Total: ${total.toFixed(2)}
            </div>
          </div>
          <form onSubmit={submit} className="space-y-3">
            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre del titular
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Número de tarjeta
              </label>
              <input
                name="card"
                inputMode="numeric"
                placeholder="4111111111111111"
                value={form.card}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Vencimiento (MM/AA)
                </label>
                <input
                  name="expiry"
                  placeholder="12/29"
                  value={form.expiry}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  name="cvv"
                  inputMode="numeric"
                  placeholder="123"
                  value={form.cvv}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={processing}
              className={`w-full py-2 rounded text-white ${
                processing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {processing ? "Procesando..." : "Pagar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
