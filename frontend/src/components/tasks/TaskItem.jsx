// frontend/src/components/tasks/TaskItem.jsx
import React, { useState } from "react";
import {
  CheckSquare,
  Square,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { completeTask, uncompleteTask, deleteTask } from "../../api/taskApi";
import { useAuth } from "../../context/AuthContext";
import Modal from "../common/Modal";
import Button from "../common/Button";
import TaskForm from "./TaskForm";

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Calculate if the task is overdue
  const isOverdue = !task.isCompleted && new Date(task.dueDate) < new Date();

  // Check if current user can control this task
  const canControl =
    user.role === "hr" ||
    user.role === task.controlledBy ||
    user.id === task.userId;

  const handleToggleComplete = async () => {
    try {
      setLoading(true);
      setError(null);

      let updatedTask;
      if (task.isCompleted) {
        updatedTask = await uncompleteTask(task.id);
      } else {
        updatedTask = await completeTask(task.id);
      }

      onUpdate(updatedTask);
    } catch (err) {
      setError("Failed to update task status. Please try again.");
      console.error("Error updating task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      await deleteTask(task.id);
      onDelete(task.id);
      setIsDeleting(false);
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedTask) => {
    onUpdate(updatedTask);
    setIsEditing(false);
  };

  // Format due date
  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Priority colors
  const priorityColors = {
    high: "text-red-600",
    medium: "text-orange-500",
    low: "text-blue-500",
  };

  return (
    <>
      <div
        className={`p-4 hover:bg-gray-50 transition-colors ${
          task.isCompleted ? "bg-gray-50" : ""
        }`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <button
              className={`focus:outline-none ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleToggleComplete}
              disabled={loading || !canControl}
              aria-label={
                task.isCompleted ? "Mark as incomplete" : "Mark as complete"
              }
            >
              {task.isCompleted ? (
                <CheckSquare className="h-5 w-5 text-green-500" />
              ) : (
                <Square className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          <div className="ml-3 flex-1">
            <div className="flex justify-between">
              <p
                className={`text-sm font-medium ${
                  task.isCompleted
                    ? "text-gray-500 line-through"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </p>
              <div className="flex space-x-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    priorityColors[task.priority]
                  } bg-opacity-10`}
                >
                  {task.priority}
                </span>

                {task.onboardingStage && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {task.onboardingStage}
                  </span>
                )}
              </div>
            </div>

            {task.description && (
              <p
                className={`mt-1 text-sm ${
                  task.isCompleted ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {task.description}
              </p>
            )}

            <div className="mt-2 flex justify-between items-center">
              <div className="flex items-center">
                <Clock
                  className={`h-4 w-4 mr-1 ${
                    isOverdue ? "text-red-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs ${
                    isOverdue ? "text-red-500 font-medium" : "text-gray-500"
                  }`}
                >
                  {isOverdue ? "Overdue: " : "Due: "}
                  {formatDueDate(task.dueDate)}
                </span>
              </div>

              {canControl && (
                <div className="flex space-x-2">
                  <button
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setIsEditing(true)}
                    aria-label="Edit task"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-500 focus:outline-none"
                    onClick={() => setIsDeleting(true)}
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-2 flex items-start text-red-600 text-xs">
                <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="py-3">
          <p className="text-gray-700">
            Are you sure you want to delete this task? This action cannot be
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

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Task"
        size="md"
      >
        <TaskForm
          task={task}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
    </>
  );
};

export default TaskItem;
