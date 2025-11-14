import api from "../api/api";

/** Order Service */
export const orderServices = {
  list: async () => {
    const { data } = await api.get("/api/orders");
    return data;
  },
  get: async (id) => {
    const { data } = await api.get(`/api/orders/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/api/orders", payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/api/orders/${id}`);
    return data;
  },
  getCustomerOrders: async (customerId) => {
    const { data } = await api.get(`/api/orders/customer/${customerId}`);
    return data;
  },
};

export default orderServices;
