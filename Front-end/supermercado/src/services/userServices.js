import api from "../api/api";

/** User Service */
export const userServices = {
  list: async () => {
    const { data } = await api.get("/api/users");
    return data;
  },
};

export default userServices;
