import axios from "axios";

const api = axios.create({
  baseURL: "https://fakestoreapi.com",//despues cambiarla, este es un mock claramente
  headers: { "Content-Type": "application/json" },
});

export default api;
