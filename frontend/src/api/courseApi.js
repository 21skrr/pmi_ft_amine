// frontend/src/api/courseApi.js
import api from "./api";

// Get all courses
export const getAllCourses = async () => {
  try {
    const response = await api.get("/courses");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get course by ID
export const getCourseById = async (id) => {
  try {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new course (HR only)
export const createCourse = async (courseData) => {
  try {
    const response = await api.post("/courses", courseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update course (HR only)
export const updateCourse = async (id, courseData) => {
  try {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete course (HR only)
export const deleteCourse = async (id) => {
  try {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user courses
export const getUserCourses = async () => {
  try {
    const response = await api.get("/courses/user");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Assign course to user (HR/Supervisor only)
export const assignCourse = async (courseId, userId) => {
  try {
    const response = await api.post("/courses/assign", { courseId, userId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update course progress
export const updateCourseProgress = async (id, progressData) => {
  try {
    const response = await api.put(`/courses/progress/${id}`, progressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Remove user from course (HR only)
export const removeUserCourse = async (id) => {
  try {
    const response = await api.delete(`/courses/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
