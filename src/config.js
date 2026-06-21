// Centralized configuration for deployment
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";
export const API_BASE = `${API_BASE_URL}/api`;
export const UPLOADS_BASE = `${API_BASE_URL}/uploads`;
