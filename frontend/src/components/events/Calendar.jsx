// frontend/src/components/events/Calendar.jsx
import React, { useState, useEffect } from "react";
import { getUserEvents } from "../../api/eventApi";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";
import Modal from "../common/Modal";
import EventForm from "./EventForm";
import Loading from "../common/Loading";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { user } = useAuth();

  // Check if user can create events
  const canCreateEvents =
    user.role === "hr" || user.role === "manager" || user.role === "supervisor";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await getUserEvents();
        setEvents(fetchedEvents);
        setError(null);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Go to previous month
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Go to next month
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "long" });
  };

  // Check if date has events
  const hasEvents = (date) => {
    return events.some((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Handle add event
  const handleAddEvent = () => {
    setShowEventForm(true);
  };

  // Handle event submit
  const handleEventSubmit = (newEvent) => {
    setEvents([...events, newEvent]);
    setShowEventForm(false);
  };

  // Render calendar
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];
    const today = new Date();

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 border border-gray-200 bg-gray-50"
        ></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      const hasEventsForDay = hasEvents(date);

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 ${
            isToday ? "bg-blue-50" : "bg-white"
          } ${
            isSelected ? "ring-2 ring-blue-500" : ""
          } hover:bg-gray-50 cursor-pointer p-1`}
          onClick={() => handleDateClick(date)}
        >
          <div className="flex justify-between">
            <span
              className={`text-sm font-medium ${
                isToday ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {day}
            </span>
            {hasEventsForDay && (
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            )}
          </div>

          <div className="mt-1 overflow-y-auto max-h-16">
            {getEventsForDate(date)
              .slice(0, 2)
              .map((event, index) => (
                <div
                  key={index}
                  className={`text-xs p-1 mb-1 rounded truncate ${
                    event.type === "meeting"
                      ? "bg-blue-100 text-blue-800"
                      : event.type === "training"
                      ? "bg-purple-100 text-purple-800"
                      : event.type === "event"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {event.title}
                </div>
              ))}
            {getEventsForDate(date).length > 2 && (
              <div className="text-xs text-gray-500 pl-1">
                +{getEventsForDate(date).length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  if (loading) return <Loading message="Loading calendar..." />;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
          Calendar
        </h2>

        {canCreateEvents && (
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleAddEvent}
          >
            Add Event
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 border-l-4 border-red-500">
          {error}
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-full focus:outline-none"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mx-4">
              {getMonthName(currentDate)} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-full focus:outline-none"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
          >
            Today
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
          {renderCalendar()}
        </div>
      </div>

      {/* Events for selected date */}
      {selectedDate && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Events for{" "}
            {selectedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>

          {getEventsForDate(selectedDate).length === 0 ? (
            <p className="text-sm text-gray-500">No events for this date</p>
          ) : (
            <div className="space-y-2">
              {getEventsForDate(selectedDate).map((event, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-md border border-gray-200"
                >
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {event.title}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        event.type === "meeting"
                          ? "bg-blue-100 text-blue-800"
                          : event.type === "training"
                          ? "bg-purple-100 text-purple-800"
                          : event.type === "event"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(event.startDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -
                    {new Date(event.endDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {event.location && ` • ${event.location}`}
                  </div>

                  {event.description && (
                    <p className="mt-2 text-sm text-gray-600">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {canCreateEvents && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowEventForm(true);
                }}
              >
                Add Event on{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Event Form Modal */}
      <Modal
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        title="Create New Event"
        size="lg"
      >
        <EventForm
          onSubmit={handleEventSubmit}
          onCancel={() => setShowEventForm(false)}
          initialDate={selectedDate}
        />
      </Modal>
    </div>
  );
};

export default Calendar;
