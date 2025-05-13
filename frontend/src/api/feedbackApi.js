// frontend/src/api/feedbackApi.js
import api from "./api";

// Get received feedback
export const getReceivedFeedback = async () => {
  try {
    const response = await api.get("/feedback/received");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get sent feedback
export const getSentFeedback = async () => {
  try {
    const response = await api.get("/feedback/sent");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get department feedback (HR/Manager only)
export const getDepartmentFeedback = async (department) => {
  try {
    const response = await api.get(`/feedback/department/${department}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new feedback
export const createFeedback = async (feedbackData) => {
  try {
    const response = await api.post("/feedback", feedbackData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete feedback
export const deleteFeedback = async (id) => {
  try {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
