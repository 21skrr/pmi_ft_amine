// frontend/src/api/authApi.js
import api from "./api";

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Register user (HR only)
export const register = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update user password
export const updatePassword = async (userId, data) => {
  try {
    const response = await api.put(`/users/${userId}/password`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Check if token is valid
export const validateToken = async () => {
  try {
    const response = await api.get("/auth/validate");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
