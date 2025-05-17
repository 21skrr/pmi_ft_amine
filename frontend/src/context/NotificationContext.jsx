import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from "../api/notificationApi";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch notifications when user is logged in
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Count unread notifications
  useEffect(() => {
    const count = notifications.filter((n) => !n.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getUserNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (id) => {
    try {
      await markAsRead(id);

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      await markAllAsRead();

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
