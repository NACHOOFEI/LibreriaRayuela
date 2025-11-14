import api from "../api/api";

/** User Service */
export const userServices = {
  list: async () => {
    const { data } = await api.get("/api/users");
    return data;
  },
};

export const getUsers = async () => {
  try {
    const response = await api.get("/api/users");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default userServices;
