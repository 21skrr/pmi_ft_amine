// frontend/src/components/dashboard/SupervisorDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTeamMembers } from "../../api/userApi";
import { getUserTasks } from "../../api/taskApi";
import { getSupervisorCoachingSessions } from "../../api/coachingApi";
import { useAuth } from "../../context/AuthContext";
import Card from "../common/Card";
import Loading from "../common/Loading";
import Alert from "../common/Alert";
import {
  Users,
  Clock,
  Calendar,
  ClipboardCheck,
  BookOpen,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Button from "../common/Button";
import OnboardingProgress from "./OnboardingProgress";
import TaskList from "../tasks/TaskList";

const SupervisorDashboard = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [coachingSessions, setCoachingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch in parallel for better performance
        const [teamData, tasksData, coachingData] = await Promise.all([
          getTeamMembers(),
          getUserTasks(),
          getSupervisorCoachingSessions(),
        ]);

        setTeamMembers(teamData);
        setTasks(tasksData);
        setCoachingSessions(coachingData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (error) {
    return <Alert type="error" title="Error" message={error} />;
  }

  // Calculate upcoming tasks
  const upcomingTasks = tasks
    .filter((task) => !task.isCompleted)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Calculate upcoming coaching sessions
  const upcomingCoachingSessions = coachingSessions
    .filter((session) => session.status === "scheduled")
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 3);

  // Calculate team stats
  const teamStats = {
    total: teamMembers.length,
    onboarding: teamMembers.filter(
      (member) =>
        member.OnboardingProgress && member.OnboardingProgress.progress < 100
    ).length,
    needAttention: teamMembers.filter((member) => {
      if (!member.OnboardingProgress) return false;
      const stage = member.OnboardingProgress.stage;
      const progress = member.OnboardingProgress.progress;
      // Consider team members who have been stuck in a stage with low progress
      return (
        (stage === "land" && progress < 30) ||
        (stage === "integrate" && progress < 20) ||
        (stage === "excel" && progress < 10)
      );
    }).length,
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600">
          You have {upcomingTasks.length} pending tasks and{" "}
          {upcomingCoachingSessions.length} upcoming coaching sessions. Here's
          an overview of your team's onboarding progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Team"
          titleIcon={<Users className="h-5 w-5 text-blue-500" />}
          className="bg-blue-50"
        >
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-blue-600">
              {teamStats.total}
            </div>
            <p className="text-sm text-blue-500 mt-1">Team members</p>
            <div className="mt-4 flex space-x-4 text-sm">
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-blue-600">
                  {teamStats.onboarding}
                </div>
                <p className="text-xs text-blue-500">In onboarding</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-amber-600">
                  {teamStats.needAttention}
                </div>
                <p className="text-xs text-amber-500">Need attention</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-green-600">
                  {teamStats.total - teamStats.onboarding}
                </div>
                <p className="text-xs text-green-500">Completed</p>
              </div>
            </div>
            <Link
              to="/team"
              className="mt-4 text-blue-600 text-sm font-medium flex items-center hover:text-blue-800"
            >
              View team members
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </Card>

        <Card
          title="Upcoming Tasks"
          titleIcon={<ClipboardCheck className="h-5 w-5 text-green-500" />}
          className="bg-green-50"
        >
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p className="text-sm">No upcoming tasks</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-2 hover:bg-green-100 rounded"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {task.title}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Due: {formatDate(task.dueDate)}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "medium"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
              {upcomingTasks.length > 3 && (
                <div className="text-center text-sm text-green-600 mt-2">
                  {upcomingTasks.length - 3} more tasks
                </div>
              )}
              <div className="pt-2 text-center">
                <Link
                  to="/tasks"
                  className="text-green-600 text-sm font-medium flex items-center justify-center hover:text-green-800"
                >
                  View all tasks
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </Card>

        <Card
          title="Coaching Sessions"
          titleIcon={<BookOpen className="h-5 w-5 text-purple-500" />}
          className="bg-purple-50"
        >
          {upcomingCoachingSessions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p className="text-sm">No upcoming sessions</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingCoachingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-2 hover:bg-purple-100 rounded"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-800">
                      {session.employee?.name || "Employee"}
                    </p>
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                      {new Date(session.scheduledDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {session.goal || "No goal set"}
                  </p>
                </div>
              ))}
              <div className="pt-2 flex justify-between items-center">
                <Link
                  to="/coaching"
                  className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800"
                >
                  View all sessions
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => navigate("/coaching/new")}
                >
                  Schedule
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Members Needing Attention */}
        <Card
          title="Team Members Needing Attention"
          titleIcon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        >
          {teamMembers.filter(
            (member) =>
              member.OnboardingProgress &&
              member.OnboardingProgress.progress < 50 &&
              member.OnboardingProgress.stage !== "prepare"
          ).length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>All team members are on track!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {teamMembers
                .filter(
                  (member) =>
                    member.OnboardingProgress &&
                    member.OnboardingProgress.progress < 50 &&
                    member.OnboardingProgress.stage !== "prepare"
                )
                .map((member) => (
                  <div
                    key={member.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-amber-600 font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {member.OnboardingProgress?.stage
                            .charAt(0)
                            .toUpperCase() +
                            member.OnboardingProgress?.stage.slice(1)}{" "}
                          stage •{member.OnboardingProgress?.progress}% complete
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/team/member/${member.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </Card>

        {/* Your Tasks */}
        <Card
          title="Your Tasks"
          titleIcon={<ClipboardCheck className="h-5 w-5 text-blue-500" />}
        >
          {tasks.filter((task) => !task.isCompleted).length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>All caught up! No pending tasks.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {tasks
                .filter((task) => !task.isCompleted)
                .slice(0, 5)
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-2 hover:bg-gray-50 rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {task.title}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Due: {formatDate(task.dueDate)}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Link to="/tasks">
              <Button variant="outline" size="sm">
                View All Tasks
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Task List */}
      <TaskList />
    </div>
  );
};

export default SupervisorDashboard;
