// frontend/src/components/coaching/CoachingSessionList.jsx
import React, { useState, useEffect } from "react";
import {
  getEmployeeCoachingSessions,
  getSupervisorCoachingSessions,
} from "../../api/coachingApi";
import { useAuth } from "../../context/AuthContext";
import CoachingSessionItem from "./CoachingSessionItem";
import CoachingSessionForm from "./CoachingSessionForm";
import { BookOpen, Calendar, Plus, Filter } from "lucide-react";
import Loading from "../common/Loading";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Alert from "../common/Alert";

const CoachingSessionList = ({ employeeId = null }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [filter, setFilter] = useState("all"); // 'all', 'upcoming', 'completed', 'cancelled'
  const { user } = useAuth();

  const isSupervisor = user.role === "supervisor" || user.role === "hr";
  const viewType = isSupervisor && !employeeId ? "supervisor" : "employee";

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        let fetchedSessions;

        if (viewType === "supervisor") {
          fetchedSessions = await getSupervisorCoachingSessions();
        } else {
          // Either viewing as employee or viewing a specific employee's sessions
          const targetId = employeeId || user.id;
          fetchedSessions = await getEmployeeCoachingSessions(targetId);
        }

        setSessions(fetchedSessions);
        setError(null);
      } catch (err) {
        setError("Failed to load coaching sessions. Please try again later.");
        console.error("Error fetching coaching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [viewType, employeeId, user.id]);

  const handleSessionAdd = (newSession) => {
    setSessions([...sessions, newSession]);
    setShowSessionForm(false);
  };

  const handleSessionUpdate = (updatedSession) => {
    setSessions(
      sessions.map((session) =>
        session.id === updatedSession.id ? updatedSession : session
      )
    );
  };

  const handleSessionDelete = (deletedSessionId) => {
    setSessions(sessions.filter((session) => session.id !== deletedSessionId));
  };

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return session.status === "scheduled";
    if (filter === "completed") return session.status === "completed";
    if (filter === "cancelled")
      return ["cancelled", "rescheduled"].includes(session.status);
    return true;
  });

  // Sort sessions by scheduled date (most recent first)
  const sortedSessions = [...filteredSessions].sort(
    (a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate)
  );

  // Group sessions by month
  const groupedSessions = sortedSessions.reduce((groups, session) => {
    const date = new Date(session.scheduledDate);
    const monthYear = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }

    groups[monthYear].push(session);
    return groups;
  }, {});

  if (loading) return <Loading message="Loading coaching sessions..." />;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
          {viewType === "supervisor"
            ? "Coaching Sessions (Supervisor View)"
            : "Your Coaching Sessions"}
        </h2>

        <div className="flex space-x-2">
          <div className="relative">
            <select
              className="appearance-none px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Sessions</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled/Rescheduled</option>
            </select>
          </div>

          {isSupervisor && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setShowSessionForm(true)}
            >
              Schedule Session
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          title="Error Loading Sessions"
          message={error}
          className="m-4"
        />
      )}

      {sortedSessions.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p>No coaching sessions found</p>
          {filter !== "all" && (
            <p className="mt-1 text-sm">Try changing your filter</p>
          )}
          {isSupervisor && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowSessionForm(true)}
            >
              Schedule Your First Session
            </Button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {Object.entries(groupedSessions).map(([monthYear, sessions]) => (
            <div key={monthYear} className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                {monthYear}
              </h3>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <CoachingSessionItem
                    key={session.id}
                    session={session}
                    viewType={viewType}
                    onUpdate={handleSessionUpdate}
                    onDelete={handleSessionDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session Form Modal */}
      <Modal
        isOpen={showSessionForm}
        onClose={() => setShowSessionForm(false)}
        title="Schedule Coaching Session"
        size="md"
      >
        <CoachingSessionForm
          onSubmit={handleSessionAdd}
          onCancel={() => setShowSessionForm(false)}
          employeeId={employeeId}
        />
      </Modal>
    </div>
  );
};

export default CoachingSessionList;
