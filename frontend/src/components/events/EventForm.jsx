// frontend/src/components/events/EventForm.jsx
import React, { useState } from "react";
import { createEvent, updateEvent } from "../../api/eventApi";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";
import { AlertCircle } from "lucide-react";

const EventForm = ({ event = null, onSubmit, onCancel }) => {
  const isEditMode = !!event;
  const { user } = useAuth();

  // Calculate default time values
  const getDefaultStartDate = () => {
    if (event?.startDate) return new Date(event.startDate);

    // Default to next hour
    const date = new Date();
    date.setHours(date.getHours() + 1);
    date.setMinutes(0, 0, 0);
    return date;
  };

  const getDefaultEndDate = () => {
    if (event?.endDate) return new Date(event.endDate);

    // Default to 1 hour after start time
    const date = getDefaultStartDate();
    date.setHours(date.getHours() + 1);
    return date;
  };

  const formatDateTimeForInput = (date) => {
    return date.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    startDate: formatDateTimeForInput(getDefaultStartDate()),
    endDate: formatDateTimeForInput(getDefaultEndDate()),
    location: event?.location || "",
    type: event?.type || "meeting",
    participants: event?.participants || [],
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
      setError("Event title is required");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Start and end dates are required");
      return;
    }

    // Validate that end date is after start date
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError("End date must be after start date");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let result;

      if (isEditMode) {
        // Update existing event
        result = await updateEvent(event.id, formData);
      } else {
        // Create new event
        result = await createEvent(formData);
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
          Event Title *
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
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date & Time *
          </label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Conference Room A"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Event Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="meeting">Meeting</option>
            <option value="training">Training</option>
            <option value="event">Event</option>
            <option value="planning">Planning</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Participants
        </label>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="text-sm text-gray-500">
            In a real implementation, this would include a participant selector
            to invite users to the event.
          </p>
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
          {loading ? "Saving..." : isEditMode ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
