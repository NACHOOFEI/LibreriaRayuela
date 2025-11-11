import api from "../api/api";

/** Category Service */
export const categoryServices = {
  list: async () => {
    const { data } = await api.get("/api/categories");
    return data;
  },
  get: async (id) => {
    const { data } = await api.get(`/api/categories/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/api/categories", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/api/categories/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/api/categories/${id}`);
    return data;
  },
};

export default categoryServices;
