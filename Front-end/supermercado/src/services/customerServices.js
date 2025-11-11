import api from "../api/api";

/** Customer Service */
export const customerServices = {
  list: async () => {
    const { data } = await api.get("/api/customers");
    return data;
  },
  get: async (id) => {
    const { data } = await api.get(`/api/customers/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/api/customers", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/api/customers/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/api/customers/${id}`);
    return data;
  },
};

export default customerServices;
