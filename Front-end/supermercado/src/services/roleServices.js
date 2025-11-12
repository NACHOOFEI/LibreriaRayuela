import api from "../api/api";

/** Role Service */
export const roleServices = {
  list: async () => {
    const { data } = await api.get("/api/roles");
    return data;
  },
};

export default roleServices;
