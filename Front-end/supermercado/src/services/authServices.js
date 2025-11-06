import api from "../api/api";

const login = async (email , password) => {
    const response = await api.post("auth/login", [email,password]);
    localStorage.setItem('token', response.data.token);
    return response.data;

}


const register = async (userData) => {
    const response = await api.post("auth/register", userData);
    return response.data;
}

const logout = async () => {

    const response = await api.post("auth/logout");
    localStorage.removeItem('token');
    return response.data;

}


export default {
    login,
    register,
    logout
};