// frontend/src/components/tasks/TaskForm.jsx
import React, { useState } from "react";
import { createTask, updateTask } from "../../api/taskApi";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";
import { AlertCircle } from "lucide-react";

const TaskForm = ({ task = null, onSubmit, onCancel, employeeId = null }) => {
  const isEditMode = !!task;
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate
      ? new Date(task.dueDate).toISOString().slice(0, 10)
      : "",
    priority: task?.priority || "medium",
    onboardingStage: task?.onboardingStage || "",
    controlledBy:
      task?.controlledBy ||
      (user.role === "hr"
        ? "hr"
        : user.role === "supervisor"
        ? "supervisor"
        : "manager"),
    userId:
      task?.userId || employeeId || (user.role === "employee" ? user.id : ""),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    if (!formData.dueDate) {
      setError("Due date is required");
      return;
    }

    if (!formData.userId) {
      setError("User ID is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let result;

      if (isEditMode) {
        // Update existing task
        result = await updateTask(task.id, formData);
      } else {
        // Create new task
        result = await createTask(formData);
      }

      onSubmit(result);
    } catch (err) {
      const errorMessage =
        err.message || "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Determine if user can edit controlled by field
  const canEditControlledBy = user.role === "hr";

  // Determine if user can assign to other users
  const canAssignUsers =
    user.role === "hr" || user.role === "supervisor" || user.role === "manager";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
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
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date *
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="onboardingStage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Onboarding Stage
          </label>
          <select
            id="onboardingStage"
            name="onboardingStage"
            value={formData.onboardingStage}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Not related to onboarding</option>
            <option value="prepare">Prepare</option>
            <option value="orient">Orient</option>
            <option value="land">Land</option>
            <option value="integrate">Integrate</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        {canEditControlledBy && (
          <div>
            <label
              htmlFor="controlledBy"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Controlled By
            </label>
            <select
              id="controlledBy"
              name="controlledBy"
              value={formData.controlledBy}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="hr">HR</option>
              <option value="supervisor">Supervisor</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        )}

        {canAssignUsers && !employeeId && (
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Assigned To *
            </label>
            {/* In a real implementation, this would be replaced with a user selection dropdown */}
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="User ID"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              In a real implementation, this would be a user selector.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-3">
        <Button
          variant="outline"
          onClick={onCancel}
          type="button"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditMode ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
