// frontend/src/components/notifications/NotificationsList.jsx
import React, { useState, useEffect } from "react";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from "../../api/notificationApi";
import {
  Bell,
  Check,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Filter,
} from "lucide-react";
import Loading from "../common/Loading";
import Button from "../common/Button";
import Alert from "../common/Alert";

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const fetchedNotifications = await getUserNotifications();
        setNotifications(fetchedNotifications);
        setError(null);
      } catch (err) {
        setError("Failed to load notifications. Please try again later.");
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();

      // Update local state
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce(
    (groups, notification) => {
      const date = new Date(notification.createdAt).toLocaleDateString();

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(notification);
      return groups;
    },
    {}
  );

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Format relative date
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      return date.toLocaleDateString([], {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  if (loading) return <Loading message="Loading notifications..." />;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-blue-500" />
          Notifications
        </h2>

        <div className="flex space-x-2">
          <div className="relative">
            <select
              className="appearance-none px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {notifications.some((n) => !n.isRead) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              icon={<Check className="h-4 w-4" />}
            >
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          title="Error Loading Notifications"
          message={error}
          className="m-4"
        />
      )}

      {Object.keys(groupedNotifications).length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Bell className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p>No notifications found</p>
          {filter !== "all" && (
            <p className="mt-1 text-sm">Try changing your filter</p>
          )}
        </div>
      ) : (
        <div>
          {Object.entries(groupedNotifications)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([date, dayNotifications]) => (
              <div
                key={date}
                className="border-b border-gray-100 last:border-b-0"
              >
                <div className="px-4 py-2 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatRelativeDate(date)}
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  {dayNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p
                              className={`text-sm font-medium text-gray-900 ${
                                !notification.isRead ? "font-semibold" : ""
                              }`}
                            >
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-500">
                              {new Date(
                                notification.createdAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>

                          {!notification.isRead && (
                            <div className="mt-2">
                              <button
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Mark as read
                              </button>
                            </div>
                          )}

                          {notification.link && (
                            <div className="mt-2">
                              <a
                                href={notification.link}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                View details
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
