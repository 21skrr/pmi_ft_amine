// frontend/src/components/feedback/FeedbackItem.jsx
import React, { useState } from "react";
import {
  MessageSquare,
  User,
  Briefcase,
  Calendar,
  Trash2,
  AlertTriangle,
  Tag,
} from "lucide-react";
import { deleteFeedback } from "../../api/feedbackApi";
import { useAuth } from "../../context/AuthContext";
import Modal from "../common/Modal";
import Button from "../common/Button";

const FeedbackItem = ({ feedback, viewType, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Check if user can delete this feedback
  const canDelete =
    user.role === "hr" ||
    (viewType === "sent" && feedback.fromUserId === user.id);

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      await deleteFeedback(feedback.id);
      onDelete(feedback.id);
      setIsDeleting(false);
    } catch (err) {
      setError("Failed to delete feedback. Please try again.");
      console.error("Error deleting feedback:", err);
    } finally {
      setLoading(false);
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

  // Feedback type styles
  const typeStyles = {
    onboarding: "bg-blue-100 text-blue-800",
    training: "bg-purple-100 text-purple-800",
    support: "bg-green-100 text-green-800",
    general: "bg-gray-100 text-gray-800",
  };

  return (
    <>
      <div className="p-4 hover:bg-gray-50 transition-colors">
        <div className="flex justify-between">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                {viewType === "received" ? (
                  feedback.isAnonymous ? (
                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                  ) : (
                    <User className="h-4 w-4 text-gray-500" />
                  )
                ) : viewType === "sent" ? (
                  feedback.toDepartment ? (
                    <Briefcase className="h-4 w-4 text-gray-500" />
                  ) : (
                    <User className="h-4 w-4 text-gray-500" />
                  )
                ) : (
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>

            <div className="ml-3 flex-1">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {viewType === "received"
                      ? feedback.isAnonymous
                        ? "Anonymous"
                        : feedback.sender?.name || "Unknown Sender"
                      : viewType === "sent"
                      ? feedback.toDepartment
                        ? `To: ${feedback.toDepartment} Department`
                        : `To: ${
                            feedback.recipient?.name || "Unknown Recipient"
                          }`
                      : `From: ${feedback.sender?.name || "Anonymous"}`}
                  </p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      {formatDate(feedback.createdAt)}
                    </span>
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        typeStyles[feedback.type] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {feedback.type}
                    </span>
                  </div>
                </div>

                {canDelete && (
                  <div>
                    <button
                      className="text-gray-400 hover:text-red-500 focus:outline-none"
                      onClick={() => setIsDeleting(true)}
                      aria-label="Delete feedback"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-2">
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {feedback.message}
                </p>
              </div>

              {error && (
                <div className="mt-2 flex items-start text-red-600 text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete Feedback"
        size="sm"
      >
        <div className="py-3">
          <p className="text-gray-700">
            Are you sure you want to delete this feedback? This action cannot be
            undone.
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

export default FeedbackItem;
