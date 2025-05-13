// frontend/src/api/evaluationApi.js
import api from "./api";

// Get user evaluations
export const getUserEvaluations = async () => {
  try {
    const response = await api.get("/evaluations/user");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get supervisor evaluations (Supervisor only)
export const getSupervisorEvaluations = async () => {
  try {
    const response = await api.get("/evaluations/supervisor");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get review evaluations (Manager/HR only)
export const getReviewEvaluations = async () => {
  try {
    const response = await api.get("/evaluations/review");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get evaluation by ID
export const getEvaluationById = async (id) => {
  try {
    const response = await api.get(`/evaluations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new evaluation (HR/Supervisor/Manager only)
export const createEvaluation = async (evaluationData) => {
  try {
    const response = await api.post("/evaluations", evaluationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update evaluation (Supervisor/Manager/HR only)
export const updateEvaluation = async (id, evaluationData) => {
  try {
    const response = await api.put(`/evaluations/${id}`, evaluationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Review evaluation (Manager/HR only)
export const reviewEvaluation = async (id, reviewData) => {
  try {
    const response = await api.put(`/evaluations/${id}/review`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete evaluation (HR only)
export const deleteEvaluation = async (id) => {
  try {
    const response = await api.delete(`/evaluations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
