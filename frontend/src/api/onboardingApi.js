// frontend/src/api/onboardingApi.js
import api from "./api";

// Employee: Get my onboarding progress
export const getMyOnboardingProgress = async () => {
  try {
    const response = await api.get("/onboarding/journey");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// HR: Get onboarding progress for a specific employee
export const getUserOnboardingProgress = async (userId) => {
  try {
    const response = await api.get(`/onboarding/journey/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// HR/Admin: Get all onboarding progresses
export const getAllOnboardingProgresses = async () => {
  try {
    const response = await api.get("/onboarding/progresses");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Employee: Update my onboarding progress
export const updateMyOnboardingProgress = async (progressData) => {
  try {
    const response = await api.put("/onboarding/journey", progressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// HR: Update onboarding progress for employee
export const updateUserOnboardingProgress = async (userId, progressData) => {
  try {
    const response = await api.put(
      `/onboarding/journey/${userId}`,
      progressData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Keeping these for backward compatibility
// Get onboarding progress for a user (legacy)
export const getOnboardingProgress = async (userId) => {
  try {
    const response = await api.get(`/onboarding/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update onboarding progress (legacy)
export const updateOnboardingProgress = async (userId, progressData) => {
  try {
    const response = await api.put(`/onboarding/${userId}`, progressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get onboarding metrics (HR only)
export const getOnboardingMetrics = async () => {
  try {
    const response = await api.get("/onboarding/metrics");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
