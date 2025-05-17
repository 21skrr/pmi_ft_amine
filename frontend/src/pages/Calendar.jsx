// frontend/src/pages/Calendar.jsx
import React from "react";
import Calendar from "../components/events/Calendar";
import EventList from "../components/events/EventList";

const CalendarPage = () => {
  return (
    <div className="space-y-6">
      <Calendar />
      <EventList isUserView={true} />
    </div>
  );
};

export default CalendarPage;
