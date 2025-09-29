import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/"
});

api.interceptors.request.use(
    (config) => {
        const tokenLocal = localStorage.getItem("access_token")
        const tokenSession = sessionStorage.getItem("access_token");
        const token = tokenLocal || tokenSession;
        if (token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api .interceptors.response.use(
    (respone) => respone,
    async (error) => {
        const originalRequest = error.config;

        if (error.respone?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try {
                const refreshTokenLocal = localStorage.getItem("refresh_token");
                const refreshTokenSession = sessionStorage.getItem("refresh_token");
                let respone = null

                if (refreshTokenLocal){
                    respone = await axios.post("http://localhost:8000/api/token/refresh/", {
                    refresh: refreshTokenLocal    
                });
                    localStorage.setItem("access_token", respone.data.access);
                }
                else if (refreshTokenSession){
                    respone = await axios.post("http://localhost:8000/api/token/refresh/", {
                    refresh: refreshTokenSession    
                });
                    sessionStorage.setItem("access_token", respone.data.access);
                }
                if (respone) {
                    api.defaults.headers.common["Authorization"] = `Bearer ${respone.data.access}`;
                    originalRequest.headers["Authorization"] = `Bearer ${respone.data.access}`;
                    return api(originalRequest);
                }
            }
            catch (refreshError) {
                localStorage.clear()
                sessionStorage.clear()
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;