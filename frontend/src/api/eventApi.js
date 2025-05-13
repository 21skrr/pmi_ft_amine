// frontend/src/api/eventApi.js
import api from "./api";

// Get all events
export const getAllEvents = async () => {
  try {
    const response = await api.get("/events");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get event by ID
export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new event
export const createEvent = async (eventData) => {
  try {
    const response = await api.post("/events", eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update event
export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete event
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user events
export const getUserEvents = async () => {
  try {
    const response = await api.get("/events/user");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update event attendance
export const updateAttendance = async (eventId, userId, attended) => {
  try {
    const response = await api.put(
      `/events/${eventId}/participants/${userId}`,
      { attended }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
