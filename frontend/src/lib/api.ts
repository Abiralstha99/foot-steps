import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
// Token must be set using setAuthToken() before making requests
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

api.interceptors.request.use(
    (config) => {
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
