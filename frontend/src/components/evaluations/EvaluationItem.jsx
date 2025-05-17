// frontend/src/components/evaluations/EvaluationItem.jsx
import React, { useState } from "react";
import {
  ClipboardCheck,
  User,
  Calendar,
  Clock,
  Check,
  Edit2,
  Trash2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { deleteEvaluation } from "../../api/evaluationApi";
import { useAuth } from "../../context/AuthContext";
import Modal from "../common/Modal";
import Button from "../common/Button";
import EvaluationForm from "./EvaluationForm";

const EvaluationItem = ({ evaluation, viewType, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Check if user can modify this evaluation
  const canDelete = user.role === "hr";
  const canEdit =
    user.role === "hr" ||
    (viewType === "supervisor" && evaluation.supervisorId === user.id) ||
    (viewType === "review" && user.role === "manager");

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      await deleteEvaluation(evaluation.id);
      onDelete(evaluation.id);
      setIsDeleting(false);
    } catch (err) {
      setError("Failed to delete evaluation. Please try again.");
      console.error("Error deleting evaluation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedEvaluation) => {
    onUpdate(updatedEvaluation);
    setIsEditing(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Status styles
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  // Evaluation type display names
  const typeNames = {
    "3-month": "3-Month Review",
    "6-month": "6-Month Review",
    "12-month": "Annual Review",
    performance: "Performance Review",
    training: "Training Evaluation",
    probation: "Probation Evaluation",
  };

  // Check if evaluation is overdue
  const isOverdue =
    evaluation.status !== "completed" &&
    new Date(evaluation.dueDate) < new Date();

  return (
    <>
      <div className="p-4 hover:bg-gray-50 transition-colors">
        <div className="flex justify-between">
          <div className="flex items-start">
            <div
              className={`p-2 rounded-full ${
                evaluation.status === "pending"
                  ? "bg-yellow-50"
                  : evaluation.status === "in_progress"
                  ? "bg-blue-50"
                  : "bg-green-50"
              }`}
            >
              <ClipboardCheck
                className={`h-5 w-5 ${
                  evaluation.status === "pending"
                    ? "text-yellow-500"
                    : evaluation.status === "in_progress"
                    ? "text-blue-500"
                    : "text-green-500"
                }`}
              />
            </div>

            <div className="ml-3 flex-1">
              <div className="flex flex-wrap justify-between mb-1">
                <h3 className="text-base font-medium text-gray-900">
                  {typeNames[evaluation.type] || evaluation.type}
                </h3>

                <div className="flex items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      statusStyles[evaluation.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {evaluation.status === "pending"
                      ? "Pending"
                      : evaluation.status === "in_progress"
                      ? "In Progress"
                      : "Completed"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                {viewType === "user" && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-400" />
                    <span>
                      Evaluator: {evaluation.supervisor?.name || "Supervisor"}
                    </span>
                  </div>
                )}

                {(viewType === "supervisor" || viewType === "review") && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-400" />
                    <span>
                      Employee: {evaluation.employee?.name || "Employee"}
                    </span>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <span>Due: {formatDate(evaluation.dueDate)}</span>
                </div>

                {evaluation.status === "completed" &&
                  evaluation.completedAt && (
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-1 text-green-500" />
                      <span>
                        Completed: {formatDate(evaluation.completedAt)}
                      </span>
                    </div>
                  )}

                {isOverdue && evaluation.status !== "completed" && (
                  <div className="flex items-center text-red-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Overdue</span>
                  </div>
                )}
              </div>

              {evaluation.comments && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-2">
                    {evaluation.comments}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="ml-4 flex-shrink-0 flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={!canEdit}
            >
              {viewType === "supervisor" && evaluation.status === "pending"
                ? "Start Evaluation"
                : viewType === "supervisor" &&
                  evaluation.status === "in_progress"
                ? "Continue Evaluation"
                : viewType === "review" &&
                  evaluation.status === "completed" &&
                  !evaluation.reviewedAt
                ? "Review Evaluation"
                : "View Details"}
            </Button>

            {canDelete && (
              <button
                className="text-red-500 hover:text-red-700 focus:outline-none text-xs"
                onClick={() => setIsDeleting(true)}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-2 flex items-start text-red-600 text-xs">
            <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete Evaluation"
        size="sm"
      >
        <div className="py-3">
          <p className="text-gray-700">
            Are you sure you want to delete this evaluation? This action cannot
            be undone.
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

      {/* Edit Evaluation Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title={
          viewType === "supervisor" && evaluation.status === "pending"
            ? "Start Evaluation"
            : viewType === "supervisor" && evaluation.status === "in_progress"
            ? "Continue Evaluation"
            : viewType === "review" &&
              evaluation.status === "completed" &&
              !evaluation.reviewedAt
            ? "Review Evaluation"
            : "Evaluation Details"
        }
        size="lg"
      >
        <EvaluationForm
          evaluation={evaluation}
          viewType={viewType}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
    </>
  );
};

export default EvaluationItem;
