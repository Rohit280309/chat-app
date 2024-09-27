import axios from "axios";

const API = process.env.EXPO_PUBLIC_API_URL!;

const api = axios.create({
    baseURL: API,
});

export default api;