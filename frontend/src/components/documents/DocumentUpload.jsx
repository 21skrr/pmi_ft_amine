// frontend/src/components/documents/DocumentUpload.jsx
import React, { useState } from "react";
import { uploadDocument } from "../../api/documentApi";
import Button from "../common/Button";
import { AlertCircle, Upload } from "lucide-react";
import Alert from "../common/Alert";

const DocumentUpload = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "guide",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError(null);

    if (!file) {
      setFormData((prev) => ({ ...prev, file: null }));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size exceeds 10MB limit.");
      return;
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "image/jpeg",
      "image/png",
    ];

    if (!validTypes.includes(file.type)) {
      setFileError(
        "Invalid file type. Please upload a PDF, Word, Excel, PowerPoint, text, or image file."
      );
      return;
    }

    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim()) {
      setError("Document name is required");
      return;
    }

    if (!formData.file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await uploadDocument(formData);

      onSubmit(result);
    } catch (err) {
      const errorMessage =
        err.message || "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert type="error" title="Error Uploading Document" message={error} />
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Document Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Add a brief description of this document..."
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="contract">Contract</option>
          <option value="policy">Policy</option>
          <option value="training">Training</option>
          <option value="guide">Guide</option>
          <option value="form">Form</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="file"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          File *
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PDF, Word, Excel, PowerPoint, Text or Image up to 10MB
            </p>
            {formData.file && (
              <p className="text-sm text-green-600 font-medium mt-2">
                Selected: {formData.file.name} (
                {(formData.file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>
        {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-3">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            type="button"
            disabled={loading}
          >
            Cancel
          </Button>
        )}

        <Button
          variant="primary"
          type="submit"
          disabled={loading || fileError !== null}
          icon={<Upload className="h-4 w-4 mr-1" />}
        >
          {loading ? "Uploading..." : "Upload Document"}
        </Button>
      </div>
    </form>
  );
};

export default DocumentUpload;
