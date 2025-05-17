// frontend/src/components/coaching/CoachingSessionForm.jsx
import React, { useState, useEffect } from "react";
import {
  createCoachingSession,
  updateCoachingSession,
} from "../../api/coachingApi";
import { getTeamMembers } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";
import { AlertCircle } from "lucide-react";

const CoachingSessionForm = ({
  session = null,
  onSubmit,
  onCancel,
  employeeId = null,
}) => {
  const isEditMode = !!session;
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: session?.employeeId || employeeId || "",
    scheduledDate: session?.scheduledDate
      ? new Date(session.scheduledDate).toISOString().slice(0, 16)
      : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    goal: session?.goal || "",
    topicTags: session?.topicTags || [],
    status: session?.status || "scheduled",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(false);

  // Load team members if needed
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (employeeId || (user.role !== "supervisor" && user.role !== "hr")) {
        return;
      }

      try {
        setLoadingTeam(true);
        const members = await getTeamMembers();
        setTeamMembers(members.filter((m) => m.role === "employee"));
      } catch (err) {
        console.error("Error fetching team members:", err);
      } finally {
        setLoadingTeam(false);
      }
    };

    fetchTeamMembers();
  }, [employeeId, user.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (e) => {
    const value = e.target.value;

    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        topicTags: [...prev.topicTags, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        topicTags: prev.topicTags.filter((topic) => topic !== value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.employeeId) {
      setError("Employee is required");
      return;
    }

    if (!formData.scheduledDate) {
      setError("Scheduled date is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let result;

      if (isEditMode) {
        // Update existing session
        result = await updateCoachingSession(session.id, formData);
      } else {
        // Create new session
        result = await createCoachingSession(formData);
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

  // Topic options
  const topicOptions = [
    "onboarding",
    "progress",
    "challenges",
    "goals",
    "feedback",
    "performance",
    "training",
    "career",
    "behavior",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {!employeeId && teamMembers.length > 0 && (
        <div>
          <label
            htmlFor="employeeId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Employee *
          </label>
          <select
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
            disabled={loadingTeam}
          >
            <option value="">Select an employee</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label
          htmlFor="scheduledDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Scheduled Date & Time *
        </label>
        <input
          type="datetime-local"
          id="scheduledDate"
          name="scheduledDate"
          value={formData.scheduledDate}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="goal"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Session Goal
        </label>
        <textarea
          id="goal"
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          rows={3}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Describe the main goal of this coaching session..."
        />
      </div>

      {isEditMode && (
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Topics
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {topicOptions.map((topic) => (
            <div key={topic} className="flex items-center">
              <input
                type="checkbox"
                id={`topic-${topic}`}
                value={topic}
                checked={formData.topicTags.includes(topic)}
                onChange={handleTopicChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`topic-${topic}`}
                className="ml-2 text-sm text-gray-700 capitalize"
              >
                {topic}
              </label>
            </div>
          ))}
        </div>
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
          {loading
            ? "Saving..."
            : isEditMode
            ? "Update Session"
            : "Schedule Session"}
        </Button>
      </div>
    </form>
  );
};

export default CoachingSessionForm;
