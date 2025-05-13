// frontend/src/components/notifications/NotificationsPanel.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import {
  Bell,
  X,
  Check,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import Button from "../common/Button";
import Loading from "../common/Loading";

const NotificationsPanel = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    loading,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNotifications();

  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Filter notifications
  const filteredNotifications = showUnreadOnly
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Today
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      // Yesterday
      return "Yesterday";
    } else if (diffDays < 7) {
      // This week
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      // Older
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
    }

    if (notification.link) {
      window.location.href = notification.link;
    }

    onClose();
  };

  // Get icon based on notification type
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

  // If panel is not open, don't render
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-lg font-medium">Notifications</h2>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close notifications"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-2 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <input
            id="unread-only"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={showUnreadOnly}
            onChange={() => setShowUnreadOnly(!showUnreadOnly)}
          />
          <label htmlFor="unread-only" className="ml-2 text-sm text-gray-700">
            Show unread only
          </label>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4">
            <Loading size="sm" message="Loading notifications..." />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm">
              {showUnreadOnly
                ? "No unread notifications"
                : "No notifications found"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 hover:bg-gray-50 cursor-pointer ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium text-gray-900 ${
                        !notification.isRead ? "font-semibold" : ""
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {notification.message}
                    </p>
                    <div className="mt-1 flex items-center">
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>
                      {notification.link && (
                        <ExternalLink className="h-3 w-3 text-gray-400 ml-1" />
                      )}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="ml-2 flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <Link
          to="/notifications"
          className="block w-full text-center text-sm text-blue-600 hover:text-blue-800"
          onClick={onClose}
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationsPanel;
