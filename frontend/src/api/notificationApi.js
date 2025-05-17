// frontend/src/api/notificationApi.js
import api from "./api";

// Get user notifications
export const getUserNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark notification as read
export const markAsRead = async (id) => {
  try {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  try {
    const response = await api.put("/notifications/read-all");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create notification (HR/Admin)
export const createNotification = async (notificationData) => {
  try {
    const response = await api.post("/notifications", notificationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete notification
export const deleteNotification = async (id) => {
  try {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
