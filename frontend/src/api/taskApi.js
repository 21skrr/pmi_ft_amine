// frontend/src/api/taskApi.js
import api from "./api";

// Get user tasks
export const getUserTasks = async () => {
  try {
    const response = await api.get("/tasks");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get task by ID
export const getTaskById = async (id) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new task
export const createTask = async (taskData) => {
  try {
    const response = await api.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update task
export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete task
export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get tasks for a specific employee (Supervisor/Manager/HR only)
export const getEmployeeTasks = async (employeeId) => {
  try {
    const response = await api.get(`/tasks/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark task as completed
export const completeTask = async (id) => {
  try {
    const response = await api.put(`/tasks/${id}`, { isCompleted: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark task as incomplete
export const uncompleteTask = async (id) => {
  try {
    const response = await api.put(`/tasks/${id}`, { isCompleted: false });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
