// frontend/src/api/surveyApi.js
import api from "./api";

// Get all surveys (HR only)
export const getAllSurveys = async () => {
  try {
    const response = await api.get("/surveys");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get surveys assigned to user
export const getUserSurveys = async () => {
  try {
    const response = await api.get("/surveys/user");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get survey by ID
export const getSurveyById = async (id) => {
  try {
    const response = await api.get(`/surveys/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new survey (HR only)
export const createSurvey = async (surveyData) => {
  try {
    const response = await api.post("/surveys", surveyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update survey (HR only)
export const updateSurvey = async (id, surveyData) => {
  try {
    const response = await api.put(`/surveys/${id}`, surveyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete survey (HR only)
export const deleteSurvey = async (id) => {
  try {
    const response = await api.delete(`/surveys/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Add question to survey (HR only)
export const addQuestion = async (surveyId, questionData) => {
  try {
    const response = await api.post(
      `/surveys/${surveyId}/questions`,
      questionData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update question (HR only)
export const updateQuestion = async (id, questionData) => {
  try {
    const response = await api.put(`/surveys/questions/${id}`, questionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete question (HR only)
export const deleteQuestion = async (id) => {
  try {
    const response = await api.delete(`/surveys/questions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Submit survey response
export const submitResponse = async (surveyId, answerData) => {
  try {
    const response = await api.post(`/surveys/${surveyId}/responses`, {
      answers: answerData,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get survey responses (HR only)
export const getSurveyResponses = async (surveyId) => {
  try {
    const response = await api.get(`/surveys/${surveyId}/responses`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
