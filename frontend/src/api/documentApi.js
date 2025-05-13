// frontend/src/api/documentApi.js
import api from "./api";

// Get all documents
export const getAllDocuments = async () => {
  try {
    const response = await api.get("/documents");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get document by ID
export const getDocumentById = async (id) => {
  try {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Upload document (HR only)
export const uploadDocument = async (documentData) => {
  try {
    // Using FormData for file upload
    const formData = new FormData();
    formData.append("file", documentData.file);
    formData.append("name", documentData.name);
    formData.append("description", documentData.description || "");
    formData.append("category", documentData.category);

    const response = await api.post("/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update document (HR only)
export const updateDocument = async (id, documentData) => {
  try {
    const response = await api.put(`/documents/${id}`, documentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete document (HR only)
export const deleteDocument = async (id) => {
  try {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Set document access (HR only)
export const setDocumentAccess = async (accessData) => {
  try {
    const response = await api.post("/documents/access", accessData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Download document
export const downloadDocument = async (id) => {
  try {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
