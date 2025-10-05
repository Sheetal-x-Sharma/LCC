import axios from "axios";

// Read from environment variables (set in .env)
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8800/api";
const serverURL = import.meta.env.VITE_SERVER_URL || "http://localhost:8800";

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export const API_URL = serverURL; // use for images, file uploads, etc.

export default instance;
