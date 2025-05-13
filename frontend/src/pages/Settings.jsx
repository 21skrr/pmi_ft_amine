// frontend/src/pages/Settings.jsx
import React, { useState } from "react";
import { updatePassword } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { Settings as SettingsIcon, Lock, Bell, Shield } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("password");

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    eventReminders: true,
    feedbackRequests: true,
    evaluationReminders: true,
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError(null);
      setPasswordSuccess(null);

      await updatePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(
        err.message || "Failed to update password. Please try again."
      );
      console.error("Error updating password:", err);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save these settings to the backend
    alert("Notification settings saved!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <SettingsIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </div>
        <p className="text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="sm:hidden">
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="password">Password</option>
            <option value="notifications">Notifications</option>
            <option value="privacy">Privacy & Security</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === "password"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("password")}
              >
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </div>
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === "notifications"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </div>
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === "privacy"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("privacy")}
              >
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy & Security
                </div>
              </button>
            </nav>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "password" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Change Password
              </h2>
              {passwordError && (
                <Alert
                  type="error"
                  title="Error"
                  message={passwordError}
                  className="mb-4"
                />
              )}
              {passwordSuccess && (
                <Alert
                  type="success"
                  title="Success"
                  message={passwordSuccess}
                  className="mb-4"
                />
              )}
              // frontend/src/pages/Settings.jsx (continued)
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    minLength={6}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters long.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Notification Settings
              </h2>

              <form onSubmit={handleNotificationSubmit} className="space-y-4">
                <fieldset>
                  <legend className="text-sm font-medium text-gray-700 mb-2">
                    Notification Methods
                  </legend>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailNotifications"
                          name="emailNotifications"
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="emailNotifications"
                          className="font-medium text-gray-700"
                        >
                          Email Notifications
                        </label>
                        <p className="text-gray-500">
                          Receive notifications via email.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="pushNotifications"
                          name="pushNotifications"
                          type="checkbox"
                          checked={notificationSettings.pushNotifications}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="pushNotifications"
                          className="font-medium text-gray-700"
                        >
                          Push Notifications
                        </label>
                        <p className="text-gray-500">
                          Receive in-app notifications.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-sm font-medium text-gray-700 mb-2">
                    Notification Types
                  </legend>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="taskReminders"
                          name="taskReminders"
                          type="checkbox"
                          checked={notificationSettings.taskReminders}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="taskReminders"
                          className="font-medium text-gray-700"
                        >
                          Task Reminders
                        </label>
                        <p className="text-gray-500">
                          Receive reminders for upcoming and overdue tasks.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="eventReminders"
                          name="eventReminders"
                          type="checkbox"
                          checked={notificationSettings.eventReminders}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="eventReminders"
                          className="font-medium text-gray-700"
                        >
                          Event Reminders
                        </label>
                        <p className="text-gray-500">
                          Receive reminders for upcoming events and meetings.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="feedbackRequests"
                          name="feedbackRequests"
                          type="checkbox"
                          checked={notificationSettings.feedbackRequests}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="feedbackRequests"
                          className="font-medium text-gray-700"
                        >
                          Feedback Requests
                        </label>
                        <p className="text-gray-500">
                          Receive notifications for feedback requests.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="evaluationReminders"
                          name="evaluationReminders"
                          type="checkbox"
                          checked={notificationSettings.evaluationReminders}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="evaluationReminders"
                          className="font-medium text-gray-700"
                        >
                          Evaluation Reminders
                        </label>
                        <p className="text-gray-500">
                          Receive reminders for upcoming evaluations.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>

                <div className="flex justify-end">
                  <Button variant="primary" type="submit">
                    Save Preferences
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "privacy" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Privacy & Security Settings
              </h2>

              <p className="mb-4 text-gray-600">
                Manage your privacy and security settings to keep your account
                safe.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Your security is important to us. Please keep your
                      password secure and don't share it with anyone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Add an extra layer of security to your account by enabling
                    two-factor authentication.
                  </p>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Login History
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    View your recent login activity to ensure your account
                    hasn't been compromised.
                  </p>
                  <Button variant="outline" size="sm">
                    View Login History
                  </Button>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Data Privacy
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Control how your data is used and downloaded.
                  </p>
                  <Button variant="outline" size="sm">
                    Manage Data
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
