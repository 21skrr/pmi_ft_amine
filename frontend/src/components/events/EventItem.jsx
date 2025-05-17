// frontend/src/components/events/EventItem.jsx
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { deleteEvent } from "../../api/eventApi";
import { useAuth } from "../../context/AuthContext";
import Modal from "../common/Modal";
import Button from "../common/Button";
import EventForm from "./EventForm";

const EventItem = ({ event, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Check if user is creator or has permissions to edit/delete
  const isCreator = event.createdBy === user.id;
  const canEdit = isCreator || user.role === "hr";

  // Check if event is in the past
  const isPast = new Date(event.endDate) < new Date();

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      await deleteEvent(event.id);
      onDelete(event.id);
      setIsDeleting(false);
    } catch (err) {
      setError("Failed to delete event. Please try again.");
      console.error("Error deleting event:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedEvent) => {
    onUpdate(updatedEvent);
    setIsEditing(false);
  };

  // Format times
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format duration
  const getDuration = () => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    const diffMs = end - start;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHrs === 0) {
      return `${diffMins} min`;
    } else if (diffMins === 0) {
      return `${diffHrs} hr`;
    } else {
      return `${diffHrs} hr ${diffMins} min`;
    }
  };

  // Event type styles
  const typeStyles = {
    meeting: "bg-blue-100 text-blue-800",
    training: "bg-purple-100 text-purple-800",
    event: "bg-green-100 text-green-800",
    planning: "bg-orange-100 text-orange-800",
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between">
          <h3 className="text-base font-medium text-gray-900">{event.title}</h3>

          <div className="flex items-center space-x-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                typeStyles[event.type] || "bg-gray-100 text-gray-800"
              }`}
            >
              {event.type}
            </span>

            {isPast && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                Past
              </span>
            )}
          </div>
        </div>

        {event.description && (
          <p className="mt-2 text-sm text-gray-600">{event.description}</p>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            <span>
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </span>
          </div>

          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
            <span>{getDuration()}</span>
          </div>

          {event.location && (
            <div className="flex items-center col-span-2">
              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
              <span>{event.location}</span>
            </div>
          )}

          {event.participants && (
            <div className="flex items-center col-span-2">
              <Users className="h-4 w-4 mr-1 text-gray-400" />
              <span>{event.participants.length} participants</span>
            </div>
          )}
        </div>

        {canEdit && (
          <div className="mt-3 flex justify-end space-x-2 pt-2 border-t border-gray-100">
            <button
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setIsEditing(true)}
              aria-label="Edit event"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              className="text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => setIsDeleting(true)}
              aria-label="Delete event"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}

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
        title="Delete Event"
        size="sm"
      >
        <div className="py-3">
          <p className="text-gray-700">
            Are you sure you want to delete this event? This action cannot be
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

      {/* Edit Event Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Event"
        size="lg"
      >
        <EventForm
          event={event}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
    </>
  );
};

export default EventItem;
