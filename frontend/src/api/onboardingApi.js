// frontend/src/api/onboardingApi.js
import api from "./api";

// Get onboarding progress for a user
export const getOnboardingProgress = async (userId) => {
  try {
    const response = await api.get(`/onboarding/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update onboarding progress (HR/Supervisor only)
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
