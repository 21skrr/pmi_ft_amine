// frontend/src/components/coaching/CoachingSessionNotes.jsx
import React, { useState } from "react";
import { updateCoachingSession } from "../../api/coachingApi";
import { AlertCircle, Save } from "lucide-react";
import Button from "../common/Button";
import Alert from "../common/Alert";
import { useAuth } from "../../context/AuthContext";

const CoachingSessionNotes = ({ session, onUpdate, onClose }) => {
  const [notes, setNotes] = useState(session.notes || "");
  const [outcome, setOutcome] = useState(session.outcome || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  // Check if user can edit notes (supervisor or HR)
  const canEdit = user.role === "hr" || session.supervisorId === user.id;

  // Check if session is completed
  const isCompleted = session.status === "completed";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // If session is not already completed, mark it as completed
      const status = isCompleted ? session.status : "completed";

      // Set actual date if not already set
      const actualDate = session.actualDate || new Date().toISOString();

      const updatedSession = await updateCoachingSession(session.id, {
        notes,
        outcome,
        status,
        actualDate,
      });

      onUpdate(updatedSession);
      setSuccess(true);
    } catch (err) {
      const errorMessage =
        err.message || "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert type="error" title="Error Saving Notes" message={error} />
      )}

      {success && (
        <Alert
          type="success"
          title="Notes Saved"
          message="Coaching session notes have been saved successfully."
        />
      )}

      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-1">
          Session Details
        </h3>
        <div className="text-sm text-gray-600">
          <p>
            <strong>Date:</strong>{" "}
            {new Date(session.scheduledDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </p>

          {session.goal && (
            <p className="mt-2">
              <strong>Goal:</strong> {session.goal}
            </p>
          )}

          {session.topicTags && session.topicTags.length > 0 && (
            <div className="mt-2">
              <strong>Topics:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {session.topicTags.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full capitalize"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Session Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter detailed notes from the coaching session..."
            disabled={!canEdit || loading}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="outcome"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Session Outcome
          </label>
          <textarea
            id="outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Summarize the key outcomes, decisions, and next steps..."
            disabled={!canEdit || loading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <Button variant="outline" onClick={onClose} type="button">
            Close
          </Button>

          {canEdit && (
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              icon={<Save className="h-4 w-4 mr-1" />}
            >
              {loading ? "Saving..." : "Save Notes"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CoachingSessionNotes;
