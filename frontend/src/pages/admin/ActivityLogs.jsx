// frontend/src/pages/admin/ActivityLogs.jsx
import React, { useState, useEffect } from "react";
import {
  Clock,
  Filter,
  Search,
  Download,
  Info,
  User,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import Loading from "../../components/common/Loading";

const ActivityLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activityTypes, setActivityTypes] = useState([]);
  const [selectedActivityType, setSelectedActivityType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [users, setUsers] = useState([]);

  // Check if user is HR
  if (user.role !== "hr") {
    return (
      <Alert
        type="error"
        title="Access Denied"
        message="You don't have permission to access this page."
      />
    );
  }

  // Mock data for activity logs
  const mockLogs = [
    {
      id: "1",
      userId: "user1",
      userName: "John Smith",
      userRole: "employee",
      action: "login",
      description: "User logged in",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: "2",
      userId: "user2",
      userName: "Maria HR",
      userRole: "hr",
      action: "user_create",
      description: "Created new user: Amy Johnson",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      ipAddress: "192.168.1.2",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: "3",
      userId: "user3",
      userName: "Tom Manager",
      userRole: "manager",
      action: "task_assign",
      description: "Assigned task to Sarah: Complete onboarding documentation",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      ipAddress: "192.168.1.3",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: "4",
      userId: "user4",
      userName: "Sarah Supervisor",
      userRole: "supervisor",
      action: "evaluation_complete",
      description: "Completed evaluation for: John Smith",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      ipAddress: "192.168.1.4",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
    },
    {
      id: "5",
      userId: "user1",
      userName: "John Smith",
      userRole: "employee",
      action: "survey_submit",
      description: "Submitted onboarding feedback survey",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: "6",
      userId: "user2",
      userName: "Maria HR",
      userRole: "hr",
      action: "document_upload",
      description: "Uploaded document: Employee Handbook.pdf",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      ipAddress: "192.168.1.2",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: "7",
      userId: "user3",
      userName: "Tom Manager",
      userRole: "manager",
      action: "event_create",
      description: "Created event: Team Building Workshop",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      ipAddress: "192.168.1.3",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: "8",
      userId: "user2",
      userName: "Maria HR",
      userRole: "hr",
      action: "settings_update",
      description: "Updated system settings: Notification preferences",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      ipAddress: "192.168.1.2",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: "9",
      userId: "user4",
      userName: "Sarah Supervisor",
      userRole: "supervisor",
      action: "coaching_session",
      description: "Scheduled coaching session with: John Smith",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      ipAddress: "192.168.1.4",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
    },
    {
      id: "10",
      userId: "user1",
      userName: "John Smith",
      userRole: "employee",
      action: "logout",
      description: "User logged out",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch activity logs
    setLoading(true);
    setTimeout(() => {
      setLogs(mockLogs);

      // Extract unique activity types and user list
      const types = [...new Set(mockLogs.map((log) => log.action))];
      const usersList = [...new Set(mockLogs.map((log) => log.userId))].map(
        (userId) => {
          const userLog = mockLogs.find((log) => log.userId === userId);
          return {
            id: userId,
            name: userLog.userName,
            role: userLog.userRole,
          };
        }
      );

      setActivityTypes(types);
      setUsers(usersList);
      setFilteredLogs(mockLogs);
      setLoading(false);
    }, 500);
  }, []);

  // Apply filters when search query or filters change
  useEffect(() => {
    if (!logs.length) return;

    let result = [...logs];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (log) =>
          log.userName.toLowerCase().includes(query) ||
          log.description.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query)
      );
    }

    // Apply activity type filter
    if (selectedActivityType !== "all") {
      result = result.filter((log) => log.action === selectedActivityType);
    }

    // Apply user filter
    if (selectedUser !== "all") {
      result = result.filter((log) => log.userId === selectedUser);
    }

    // Apply date range filters
    if (startDate) {
      const start = new Date(startDate);
      result = result.filter((log) => new Date(log.timestamp) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day
      result = result.filter((log) => new Date(log.timestamp) <= end);
    }

    setFilteredLogs(result);
  }, [
    searchQuery,
    selectedActivityType,
    selectedUser,
    startDate,
    endDate,
    logs,
  ]);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call to refresh logs
    setTimeout(() => {
      setLogs(mockLogs);
      setFilteredLogs(mockLogs);
      setLoading(false);
    }, 500);
  };

  const handleExport = () => {
    // In a real implementation, this would generate a CSV file
    alert("This would export the filtered logs as a CSV file");
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedActivityType("all");
    setStartDate("");
    setEndDate("");
    setSelectedUser("all");
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get action display name
  const getActionName = (action) => {
    const actionMap = {
      login: "Login",
      logout: "Logout",
      user_create: "Create User",
      user_update: "Update User",
      user_delete: "Delete User",
      task_assign: "Assign Task",
      task_complete: "Complete Task",
      evaluation_complete: "Complete Evaluation",
      survey_submit: "Submit Survey",
      document_upload: "Upload Document",
      event_create: "Create Event",
      settings_update: "Update Settings",
      coaching_session: "Coaching Session",
    };

    return actionMap[action] || action;
  };

  if (loading && !logs.length)
    return <Loading message="Loading activity logs..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <Clock className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Activity Logs</h1>
        </div>
        <p className="text-gray-600">
          View system activity and audit logs to monitor user actions and system
          events.
        </p>
      </div>

      {error && (
        <Alert type="error" title="Error Loading Logs" message={error} />
      )}

      <Card>
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={<RefreshCw className="h-4 w-4" />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="h-4 w-4" />}
                onClick={handleExport}
              >
                Export
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/5">
              <label
                htmlFor="activity-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Activity Type
              </label>
              <select
                id="activity-type"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedActivityType}
                onChange={(e) => setSelectedActivityType(e.target.value)}
              >
                <option value="all">All Activities</option>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {getActionName(type)}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/5">
              <label
                htmlFor="user-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                User
              </label>
              <select
                id="user-filter"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="all">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/5">
              <label
                htmlFor="start-date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="w-full md:w-1/5">
              <label
                htmlFor="end-date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="w-full md:w-1/5 flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleReset}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Timestamp
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Activity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No activity logs found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {log.userName}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {log.userRole}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.action === "login" || log.action === "logout"
                            ? "bg-blue-100 text-blue-800"
                            : log.action.includes("create")
                            ? "bg-green-100 text-green-800"
                            : log.action.includes("update") ||
                              log.action.includes("edit")
                            ? "bg-yellow-100 text-yellow-800"
                            : log.action.includes("delete")
                            ? "bg-red-100 text-red-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {getActionName(log.action)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredLogs.length > 0 && (
          <div className="py-3 px-6 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
            Showing {filteredLogs.length} of {logs.length} activity logs
          </div>
        )}
      </Card>
    </div>
  );
};

export default ActivityLogs;
