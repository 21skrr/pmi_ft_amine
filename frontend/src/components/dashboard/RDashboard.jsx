// frontend/src/components/dashboard/HRDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../api/userApi";
import { getUserTasks } from "../../api/taskApi";
import { getAllEvents } from "../../api/eventApi";
import { useAuth } from "../../context/AuthContext";
import Card from "../common/Card";
import Loading from "../common/Loading";
import Alert from "../common/Alert";
import {
  Users,
  Clock,
  Calendar,
  ClipboardCheck,
  Briefcase,
  BarChart2,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import Button from "../common/Button";
import TaskList from "../tasks/TaskList";

const HRDashboard = () => {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // Filter for program stats

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch in parallel for better performance
        const [usersData, tasksData, eventsData] = await Promise.all([
          getAllUsers(),
          getUserTasks(),
          getAllEvents(),
        ]);

        setAllUsers(usersData);
        setTasks(tasksData);
        setEvents(eventsData);
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

  // Calculate upcoming events
  const upcomingEvents = events
    .filter((event) => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  // Calculate employee stats
  const employeeStats = {
    total: allUsers.length,
    byRole: {
      employee: allUsers.filter((user) => user.role === "employee").length,
      supervisor: allUsers.filter((user) => user.role === "supervisor").length,
      manager: allUsers.filter((user) => user.role === "manager").length,
      hr: allUsers.filter((user) => user.role === "hr").length,
    },
    byProgram: {
      inkompass: allUsers.filter((user) => user.programType === "inkompass")
        .length,
      earlyTalent: allUsers.filter((user) => user.programType === "earlyTalent")
        .length,
      apprenticeship: allUsers.filter(
        (user) => user.programType === "apprenticeship"
      ).length,
      academicPlacement: allUsers.filter(
        (user) => user.programType === "academicPlacement"
      ).length,
      workExperience: allUsers.filter(
        (user) => user.programType === "workExperience"
      ).length,
    },
  };

  // Calculate onboarding stats
  const onboardingStats = {
    inProgress: allUsers.filter(
      (user) =>
        user.OnboardingProgress &&
        user.OnboardingProgress.progress > 0 &&
        user.OnboardingProgress.progress < 100
    ).length,
    completed: allUsers.filter(
      (user) =>
        user.OnboardingProgress && user.OnboardingProgress.progress === 100
    ).length,
    notStarted: allUsers.filter(
      (user) =>
        !user.OnboardingProgress || user.OnboardingProgress.progress === 0
    ).length,
    byStage: {
      prepare: allUsers.filter(
        (user) =>
          user.OnboardingProgress && user.OnboardingProgress.stage === "prepare"
      ).length,
      orient: allUsers.filter(
        (user) =>
          user.OnboardingProgress && user.OnboardingProgress.stage === "orient"
      ).length,
      land: allUsers.filter(
        (user) =>
          user.OnboardingProgress && user.OnboardingProgress.stage === "land"
      ).length,
      integrate: allUsers.filter(
        (user) =>
          user.OnboardingProgress &&
          user.OnboardingProgress.stage === "integrate"
      ).length,
      excel: allUsers.filter(
        (user) =>
          user.OnboardingProgress && user.OnboardingProgress.stage === "excel"
      ).length,
    },
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get recently joined employees (last 30 days)
  const recentEmployees = allUsers
    .filter(
      (user) =>
        user.role === "employee" &&
        new Date(user.startDate) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to HR Dashboard, {user.name}
        </h1>
        <p className="text-gray-600">
          You have {upcomingTasks.length} pending tasks and{" "}
          {upcomingEvents.length} upcoming events. Currently,{" "}
          {onboardingStats.inProgress} employees are in the onboarding process.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Employee Overview"
          titleIcon={<Users className="h-5 w-5 text-blue-500" />}
          className="bg-blue-50"
        >
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-blue-600">
              {employeeStats.total}
            </div>
            <p className="text-sm text-blue-500 mt-1">Total employees</p>
            <div className="mt-4 grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-blue-600">
                  {employeeStats.byRole.employee}
                </div>
                <p className="text-xs text-blue-500">Employees</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-blue-600">
                  {employeeStats.byRole.supervisor}
                </div>
                <p className="text-xs text-blue-500">Supervisors</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-blue-600">
                  {employeeStats.byRole.manager}
                </div>
                <p className="text-xs text-blue-500">Managers</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-blue-600">
                  {employeeStats.byRole.hr}
                </div>
                <p className="text-xs text-blue-500">HR Staff</p>
              </div>
            </div>
            <Link
              to="/admin/users"
              className="mt-4 text-blue-600 text-sm font-medium flex items-center hover:text-blue-800"
            >
              Manage users
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </Card>

        <Card
          title="Onboarding Status"
          titleIcon={<CheckCircle className="h-5 w-5 text-green-500" />}
          className="bg-green-50"
        >
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-green-600">
              {onboardingStats.inProgress}
            </div>
            <p className="text-sm text-green-500 mt-1">In progress</p>
            <div className="mt-4 grid grid-cols-3 gap-2 w-full">
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-green-600">
                  {onboardingStats.completed}
                </div>
                <p className="text-xs text-green-500">Completed</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-amber-600">
                  {onboardingStats.inProgress}
                </div>
                <p className="text-xs text-amber-500">In progress</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-gray-600">
                  {onboardingStats.notStarted}
                </div>
                <p className="text-xs text-gray-500">Not started</p>
              </div>
            </div>
            <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{
                  width: `${
                    Math.round(
                      (onboardingStats.completed /
                        (onboardingStats.completed +
                          onboardingStats.inProgress +
                          onboardingStats.notStarted)) *
                        100
                    ) || 0
                  }%`,
                }}
              ></div>
            </div>
            <Link
              to="/admin/metrics"
              className="mt-4 text-green-600 text-sm font-medium flex items-center hover:text-green-800"
            >
              View detailed metrics
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </Card>

        <Card
          title="Program Enrollment"
          titleIcon={<Briefcase className="h-5 w-5 text-purple-500" />}
          className="bg-purple-50"
        >
          <div className="flex justify-between mb-4">
            <button
              className={`text-xs px-2 py-1 rounded-md ${
                activeFilter === "all"
                  ? "bg-purple-200 text-purple-800"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All Programs
            </button>
            <button
              className={`text-xs px-2 py-1 rounded-md ${
                activeFilter === "inkompass"
                  ? "bg-purple-200 text-purple-800"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveFilter("inkompass")}
            >
              Inkompass
            </button>
            <button
              className={`text-xs px-2 py-1 rounded-md ${
                activeFilter === "earlyTalent"
                  ? "bg-purple-200 text-purple-800"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveFilter("earlyTalent")}
            >
              Early Talent
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Inkompass</span>
              <span className="text-sm font-medium">
                {employeeStats.byProgram.inkompass}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{
                  width: `${
                    Math.round(
                      (employeeStats.byProgram.inkompass /
                        employeeStats.byRole.employee) *
                        100
                    ) || 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Early Talent</span>
              <span className="text-sm font-medium">
                {employeeStats.byProgram.earlyTalent}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${
                    Math.round(
                      (employeeStats.byProgram.earlyTalent /
                        employeeStats.byRole.employee) *
                        100
                    ) || 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Apprenticeship</span>
              <span className="text-sm font-medium">
                {employeeStats.byProgram.apprenticeship}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${
                    Math.round(
                      (employeeStats.byProgram.apprenticeship /
                        employeeStats.byRole.employee) *
                        100
                    ) || 0
                  }%`,
                }}
              ></div>
            </div>
            <Link
              to="/admin/programs"
              className="mt-4 text-purple-600 text-sm font-medium flex items-center hover:text-purple-800"
            >
              Manage programs
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Joined Employees */}
        <Card
          title="Recently Joined Employees"
          titleIcon={<User className="h-5 w-5 text-blue-500" />}
        >
          {recentEmployees.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>No employees have joined in the last 30 days</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="py-3 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {employee.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 mr-2">
                          {employee.programType === "inkompass"
                            ? "Inkompass"
                            : employee.programType === "earlyTalent"
                            ? "Early Talent"
                            : employee.programType === "apprenticeship"
                            ? "Apprenticeship"
                            : employee.programType === "academicPlacement"
                            ? "Academic Placement"
                            : employee.programType === "workExperience"
                            ? "Work Experience"
                            : "Unknown Program"}
                        </span>
                        <Clock className="h-3 w-3 mr-1" />
                        Joined: {formatDate(employee.startDate)}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/admin/users/edit/${employee.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Link to="/admin/users/new">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="h-4 w-4 mr-1" />}
              >
                Add Employee
              </Button>
            </Link>
          </div>
        </Card>

        {/* Upcoming Tasks and Events */}
        <Card
          title="Upcoming Tasks & Events"
          titleIcon={<Calendar className="h-5 w-5 text-red-500" />}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tasks</h3>
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-3 text-gray-500">
                  <CheckCircle className="h-6 w-6 mx-auto text-gray-300 mb-1" />
                  <p className="text-sm">No pending tasks</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
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
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Events</h3>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-3 text-gray-500">
                  <Calendar className="h-6 w-6 mx-auto text-gray-300 mb-1" />
                  <p className="text-sm">No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-800">
                          {event.title}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            event.type === "meeting"
                              ? "bg-blue-100 text-blue-800"
                              : event.type === "training"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {event.type}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(event.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <Link to="/tasks">
              <Button variant="outline" size="sm">
                View Tasks
              </Button>
            </Link>
            <Link to="/calendar">
              <Button variant="outline" size="sm">
                View Calendar
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card
        title="Quick Actions"
        titleIcon={<Plus className="h-5 w-5 text-gray-500" />}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/users/new">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <User className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-800">
                Add Employee
              </span>
            </div>
          </Link>
          <Link to="/forms/new">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <ClipboardCheck className="h-6 w-6 mx-auto text-green-500 mb-2" />
              <span className="text-sm font-medium text-gray-800">
                Create Survey
              </span>
            </div>
          </Link>
          <Link to="/calendar">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <Calendar className="h-6 w-6 mx-auto text-red-500 mb-2" />
              <span className="text-sm font-medium text-gray-800">
                Schedule Event
              </span>
            </div>
          </Link>
          <Link to="/admin/metrics">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <BarChart2 className="h-6 w-6 mx-auto text-purple-500 mb-2" />
              <span className="text-sm font-medium text-gray-800">
                View Metrics
              </span>
            </div>
          </Link>
        </div>
      </Card>

      {/* HR Tasks */}
      <TaskList />
    </div>
  );
};

export default HRDashboard;
