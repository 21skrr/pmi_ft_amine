// frontend/src/components/events/EventList.jsx
import React, { useState, useEffect } from "react";
import { getAllEvents, getUserEvents } from "../../api/eventApi";
import EventItem from "./EventItem";
import EventForm from "./EventForm";
import { Calendar, Filter, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Loading from "../common/Loading";
import Button from "../common/Button";

const EventList = ({ isUserView = true }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [filter, setFilter] = useState("upcoming"); // 'upcoming', 'past', 'all'
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        let fetchedEvents;

        if (isUserView) {
          // If it's a user view, fetch user's events
          fetchedEvents = await getUserEvents();
        } else {
          // Otherwise, fetch all events (for admin/hr)
          fetchedEvents = await getAllEvents();
        }

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
  }, [isUserView]);

  const handleEventUpdate = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleEventDelete = (deletedEventId) => {
    setEvents(events.filter((event) => event.id !== deletedEventId));
  };

  const handleEventAdd = (newEvent) => {
    setEvents([...events, newEvent]);
    setShowEventForm(false);
  };

  // Filter events based on date
  const currentDate = new Date();
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate);

    if (filter === "upcoming") return eventDate >= currentDate;
    if (filter === "past") return eventDate < currentDate;
    return true; // 'all'
  });

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });

  // Group events by date
  const groupedEvents = sortedEvents.reduce((groups, event) => {
    const date = new Date(event.startDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(event);
    return groups;
  }, {});

  // Check if user can create events
  const canCreateEvents =
    user.role === "hr" || user.role === "manager" || user.role === "supervisor";

  if (loading) return <Loading message="Loading events..." />;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-500" />
          {isUserView ? "Your Events" : "All Events"}
        </h2>

        <div className="flex space-x-2">
          <div className="relative">
            <select
              className="appearance-none px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="all">All</option>
            </select>
          </div>

          {canCreateEvents && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setShowEventForm(true)}
            >
              Add Event
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 border-l-4 border-red-500">
          {error}
        </div>
      )}

      {showEventForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <EventForm
            onSubmit={handleEventAdd}
            onCancel={() => setShowEventForm(false)}
          />
        </div>
      )}

      {Object.keys(groupedEvents).length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p>No events found</p>
          {filter !== "all" && (
            <p className="mt-1 text-sm">
              Try changing your filter or creating new events
            </p>
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <div key={date} className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">{date}</h3>
              <div className="space-y-3">
                {dateEvents.map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onUpdate={handleEventUpdate}
                    onDelete={handleEventDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {events.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      )}
    </div>
  );
};

export default EventList;
