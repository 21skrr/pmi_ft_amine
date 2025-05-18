// frontend/src/api/userApi.js
import api from "./api";

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get(`/auth/me`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all users (HR/Manager only)
export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new user (HR only)
export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete user (HR only)
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get team members (Supervisor/Manager only)
export const getTeamMembers = async () => {
  try {
    const response = await api.get("/users/team/members");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
