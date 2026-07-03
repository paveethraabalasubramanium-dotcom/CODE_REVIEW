import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const analyzeCode = (code, language) =>
  api.post("/analyze", { code, language });

export default api;