// frontend/src/api/api.js
import axios from "axios";

// Create axios instance with base URL
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (
      error.code === "ERR_NETWORK" &&
      error.config.url.includes("5000")
    ) {
      // If connection to port 5000 fails, try port 5001
      const newConfig = { ...error.config };
      newConfig.url = newConfig.url.replace("5000", "5001");
      return api(newConfig);
    }
    return Promise.reject(error);
  }
);

// Test function to call the test endpoint
export const testApi = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('Error testing API:', error);
    throw error;
  }
};

export default api;
