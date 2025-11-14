import { useQuery } from "@tanstack/react-query";
import { orderServices } from "../services/orderServices";
import { useAuthStore } from "../store/authStore";
import Loader from "../components/loader";

export default function OrderHistory() {
  const { user } = useAuthStore();

  // Obtener las órdenes del cliente
  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ["customerOrders", user?.id],
    queryFn: () => orderServices.getCustomerOrders(user?.id),
    enabled: !!user?.id, // Solo hacer la petición si hay user id
  });

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-700 font-semibold">
              No tienes un perfil de cliente asociado
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700 font-semibold">
              Error al cargar órdenes: {error?.message || "Error desconocido"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Historial de Órdenes
          </h1>
          <p className="text-gray-600">
            Total de órdenes:{" "}
            <span className="font-semibold text-gray-900">{orders.length}</span>
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay órdenes todavía
            </h3>
            <p className="text-gray-500">
              Cuando realices tu primera compra, aparecerá aquí
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Header de la orden */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Orden #{order.id}
                      </h3>
                      <p className="text-sm text-blue-100">
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-100">Total</p>
                      <p className="text-2xl font-bold">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items de la orden */}
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    Productos ({order.items.length})
                  </h4>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        {/* Imagen del producto */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.imageUrl || "/placeholder-product.png"}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-md"
                            onError={(e) => {
                              e.target.src = "/placeholder-product.png";
                            }}
                          />
                        </div>

                        {/* Información del producto */}
                        <div className="flex-grow">
                          <h5 className="font-semibold text-gray-900">
                            {item.product.name}
                          </h5>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {item.product.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-gray-600">
                              Cantidad: <span className="font-semibold">{item.quantity}</span>
                            </span>
                            <span className="text-gray-600">
                              Precio unitario: <span className="font-semibold">{formatPrice(item.product.price)}</span>
                            </span>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="flex-shrink-0 text-right">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Información de envío */}
                  {order.customer && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Información de Envío
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Nombre:</span> {order.customer.name}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">DNI:</span> {order.customer.dni}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Teléfono:</span> {order.customer.phone}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Dirección:</span> {order.customer.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
