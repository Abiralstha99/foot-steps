// src/lib/api.ts
import axios from "axios";

const api = axios.create({
    baseURL: "/api",           // Works with Vite proxy
    timeout: 10000,           // Good to have
    headers: {
        "Content-Type": "application/json",  // Standard for APIs
    },
});

export default api;
