import api from "../api/api";

/** Product Service */
export const productServices = {
  list: async () => {
    const res = await api.get("/api/products");
    const payload = res?.data;
    let items = payload;
    if (payload && typeof payload === "object") {
      if (Array.isArray(payload)) items = payload;
      else if (Array.isArray(payload.data)) items = payload.data;
      else if (Array.isArray(payload.products)) items = payload.products;
      else if (Array.isArray(payload.items)) items = payload.items;
      else items = [];
    }
    return Array.isArray(items) ? items : [];
  },
  get: async (id) => {
    const { data } = await api.get(`/api/products/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/api/products", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/api/products/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/api/products/${id}`);
    return data;
  },
  restarStock: async (id, cantidad = 1) => {
    const { data } = await api.patch(`/api/products/${id}/restar-stock`, {
      cantidad,
    });
    return data;
  },
  sumarStock: async (id, cantidad = 1) => {
    const { data } = await api.patch(`/api/products/${id}/sumar-stock`, {
      cantidad,
    });
    return data;
  },
};

export default productServices;
