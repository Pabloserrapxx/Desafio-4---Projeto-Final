import axios from "axios";

const api = axios.create({
    baseURL: "http://backend:3333", // Nome do serviço no Docker Compose
});

export default api;
