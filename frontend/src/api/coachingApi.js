// frontend/src/api/coachingApi.js
import api from "./api";

// Get employee coaching sessions
export const getEmployeeCoachingSessions = async () => {
  try {
    const response = await api.get("/coaching/employee");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get supervisor coaching sessions (Supervisor only)
export const getSupervisorCoachingSessions = async () => {
  try {
    const response = await api.get("/coaching/supervisor");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get coaching session by ID
export const getCoachingSessionById = async (id) => {
  try {
    const response = await api.get(`/coaching/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new coaching session (Supervisor/HR only)
export const createCoachingSession = async (sessionData) => {
  try {
    const response = await api.post("/coaching", sessionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update coaching session (Supervisor/HR only)
export const updateCoachingSession = async (id, sessionData) => {
  try {
    const response = await api.put(`/coaching/${id}`, sessionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete coaching session (Supervisor/HR only)
export const deleteCoachingSession = async (id) => {
  try {
    const response = await api.delete(`/coaching/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
