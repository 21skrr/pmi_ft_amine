// frontend/src/components/documents/DocumentItem.jsx
import React, { useState } from "react";
import {
  FileText,
  Download,
  Trash2,
  AlertCircle,
  ExternalLink,
  Users,
  Clock,
} from "lucide-react";
import { deleteDocument, downloadDocument } from "../../api/documentApi";
import Modal from "../common/Modal";
import Button from "../common/Button";

const DocumentItem = ({ document, canUpload, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      await deleteDocument(document.id);
      onDelete(document.id);
      setIsDeleting(false);
    } catch (err) {
      setError("Failed to delete document. Please try again.");
      console.error("Error deleting document:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloadLoading(true);
      setError(null);

      const blob = await downloadDocument(document.id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to download document. Please try again.");
      console.error("Error downloading document:", err);
    } finally {
      setDownloadLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // File size formatter
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // File type icon
  const getFileTypeIcon = () => {
    const type = document.fileType;

    if (type.includes("pdf")) return "pdf";
    if (type.includes("word") || type.includes("document")) return "word";
    if (type.includes("excel") || type.includes("spreadsheet")) return "excel";
    if (type.includes("presentation") || type.includes("powerpoint"))
      return "ppt";
    if (type.includes("image")) return "image";
    if (type.includes("text")) return "text";
    return "file";
  };

  const fileTypeColors = {
    pdf: "bg-red-100 text-red-700",
    word: "bg-blue-100 text-blue-700",
    excel: "bg-green-100 text-green-700",
    ppt: "bg-orange-100 text-orange-700",
    image: "bg-purple-100 text-purple-700",
    text: "bg-gray-100 text-gray-700",
    file: "bg-gray-100 text-gray-700",
  };

  const fileType = getFileTypeIcon();
  const fileTypeColor = fileTypeColors[fileType];

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-start">
            <div
              className={`w-10 h-10 flex-shrink-0 rounded-md ${fileTypeColor} flex items-center justify-center`}
            >
              <FileText className="h-5 w-5" />
            </div>

            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                {document.name}
              </h3>

              {document.description && (
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {document.description}
                </p>
              )}

              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span
                  className={`px-1.5 py-0.5 rounded-sm ${fileTypeColor} text-xs font-medium uppercase`}
                >
                  {fileType}
                </span>
                <span className="ml-2">
                  {formatFileSize(document.fileSize)}
                </span>
              </div>

              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Uploaded: {formatDate(document.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex justify-end space-x-2 pt-2 border-t border-gray-100">
            <button
              className="text-gray-500 hover:text-blue-600 focus:outline-none p-1 rounded-md hover:bg-blue-50"
              onClick={handleDownload}
              disabled={downloadLoading}
              aria-label="Download document"
            >
              <Download className="h-4 w-4" />
            </button>

            {canUpload && (
              <button
                className="text-gray-500 hover:text-red-600 focus:outline-none p-1 rounded-md hover:bg-red-50"
                onClick={() => setIsDeleting(true)}
                aria-label="Delete document"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {error && (
            <div className="mt-2 flex items-start text-red-600 text-xs bg-red-50 p-1 rounded">
              <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete Document"
        size="sm"
      >
        <div className="py-3">
          <p className="text-gray-700">
            Are you sure you want to delete "{document.name}"? This action
            cannot be undone.
          </p>
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsDeleting(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DocumentItem;
