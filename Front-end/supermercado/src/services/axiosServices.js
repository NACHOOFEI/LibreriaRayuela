import api from "../api/api";





class axiosServices {

    static get(url,config = {}){
        return api.get(url, config);
    }

    static getId(url, id, config = {}){
        return api.get(`${url}/${id}`, config);
    }

    static post(url, data, config = {}){
        return api.post(url, data, config);
    }

    static put(url, id, data, config = {}){
        return api.put(`${url}/${id}`, data, config);
    }
    static delete(url, id, config = {}){
        return api.delete(`${url}/${id}`, config);
    }
}


export default axiosServices;