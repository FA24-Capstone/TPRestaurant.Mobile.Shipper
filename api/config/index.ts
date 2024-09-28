// src/api/index.ts
import axios from "axios";
import { apiConfig } from "./config";

const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: apiConfig.headers,
});

export default apiClient;
