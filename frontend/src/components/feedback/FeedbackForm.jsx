// frontend/src/components/feedback/FeedbackForm.jsx
import React, { useState, useEffect } from "react";
import { createFeedback } from "../../api/feedbackApi";
import { getTeamMembers } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";
import { AlertCircle, Send } from "lucide-react";
import Alert from "../common/Alert";

const FeedbackForm = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [departments, setDepartments] = useState([
    "Human Resources",
    "Marketing",
    "Sales",
    "IT",
    "Operations",
    "Finance",
    "Legal",
  ]);

  const [formData, setFormData] = useState({
    receiverType: "user", // 'user' or 'department'
    toUserId: "",
    toDepartment: "",
    type: "general",
    message: "",
    isAnonymous: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingTeam, setLoadingTeam] = useState(false);

  // Load team members and available departments
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoadingTeam(true);
        const members = await getTeamMembers();
        setTeamMembers(members);

        // Extract unique departments
        const uniqueDepartments = [
          ...new Set(members.map((m) => m.department).filter(Boolean)),
        ];
        if (uniqueDepartments.length > 0) {
          setDepartments(uniqueDepartments);
        }
      } catch (err) {
        console.error("Error fetching team members:", err);
      } finally {
        setLoadingTeam(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReceiverTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      receiverType: type,
      toUserId: "",
      toDepartment: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (formData.receiverType === "user" && !formData.toUserId) {
      setError("Please select a recipient user");
      return;
    }

    if (formData.receiverType === "department" && !formData.toDepartment) {
      setError("Please select a department");
      return;
    }

    if (!formData.message.trim()) {
      setError("Feedback message is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Create feedback payload
      const payload = {
        toUserId: formData.receiverType === "user" ? formData.toUserId : null,
        toDepartment:
          formData.receiverType === "department" ? formData.toDepartment : null,
        type: formData.type,
        message: formData.message,
        isAnonymous: formData.isAnonymous,
      };

      const result = await createFeedback(payload);

      setSuccess(true);
      setFormData({
        receiverType: "user",
        toUserId: "",
        toDepartment: "",
        type: "general",
        message: "",
        isAnonymous: false,
      });

      if (onSubmit) {
        onSubmit(result);
      }
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
        <Alert type="error" title="Error Submitting Feedback" message={error} />
      )}

      {success && (
        <Alert
          type="success"
          title="Feedback Submitted"
          message="Your feedback has been submitted successfully."
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Feedback Recipient
        </label>
        <div className="flex space-x-4 mb-3">
          <div>
            <input
              type="radio"
              id="receiverUser"
              name="receiverType"
              value="user"
              checked={formData.receiverType === "user"}
              onChange={() => handleReceiverTypeChange("user")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="receiverUser"
              className="ml-2 text-sm text-gray-700"
            >
              Send to a person
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="receiverDepartment"
              name="receiverType"
              value="department"
              checked={formData.receiverType === "department"}
              onChange={() => handleReceiverTypeChange("department")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="receiverDepartment"
              className="ml-2 text-sm text-gray-700"
            >
              Send to a department
            </label>
          </div>
        </div>

        {formData.receiverType === "user" ? (
          <select
            id="toUserId"
            name="toUserId"
            value={formData.toUserId}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={loadingTeam}
            required
          >
            <option value="">Select recipient</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.role})
              </option>
            ))}
          </select>
        ) : (
          <select
            id="toDepartment"
            name="toDepartment"
            value={formData.toDepartment}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="">Select department</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Feedback Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="onboarding">Onboarding</option>
          <option value="training">Training</option>
          <option value="support">Support</option>
          <option value="general">General</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Feedback Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter your feedback here..."
          required
        />
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="isAnonymous"
            name="isAnonymous"
            type="checkbox"
            checked={formData.isAnonymous}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="isAnonymous" className="font-medium text-gray-700">
            Submit anonymously
          </label>
          <p className="text-gray-500">
            Your identity will not be revealed to the recipient.
          </p>
        </div>
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
          disabled={loading}
          icon={<Send className="h-4 w-4 mr-1" />}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </form>
  );
};

export default FeedbackForm;
