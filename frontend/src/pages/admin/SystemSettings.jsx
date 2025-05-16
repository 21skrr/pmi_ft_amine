// frontend/src/pages/admin/SystemSettings.jsx
import React, { useState } from "react";
import {
  Settings,
  Server,
  Database,
  Globe,
  Shield,
  Bell,
  Mail,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import Modal from "../../components/common/Modal";

const SystemSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

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

  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "PMI Onboarding Portal",
    companyName: "Philip Morris International",
    adminEmail: "admin@pmi.com",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    defaultLanguage: "en-US",
  });

  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.pmi.com",
    smtpPort: "587",
    smtpUsername: "notifications@pmi.com",
    smtpPassword: "••••••••••••",
    fromEmail: "onboarding@pmi.com",
    fromName: "PMI Onboarding",
    enableEmailNotifications: true,
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    enableSystemNotifications: true,
    enableEmailNotifications: true,
    welcomeEmailTemplate: "default",
    taskReminderTemplate: "default",
    evaluationReminderTemplate: "default",
    reminderFrequency: "daily",
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: true,
    passwordExpireDays: 90,
    sessionTimeout: 30,
    enableTwoFactor: false,
    allowedLoginAttempts: 5,
    lockoutDuration: 30,
  });

  // Handle form changes
  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEmailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings({
      ...emailSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNotificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Save settings
  const handleSave = (e) => {
    e.preventDefault();

    setLoading(true);
    setSaveSuccess(false);
    setSaveError(null);

    // In a real implementation, these would be API calls
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    setConfirmAction("reset");
    setConfirmModalOpen(true);
  };

  const confirmReset = () => {
    // In a real implementation, this would reset to default values from the server
    if (activeTab === "general") {
      setGeneralSettings({
        siteName: "PMI Onboarding Portal",
        companyName: "Philip Morris International",
        adminEmail: "admin@pmi.com",
        timezone: "UTC",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h",
        defaultLanguage: "en-US",
      });
    } else if (activeTab === "email") {
      setEmailSettings({
        smtpServer: "smtp.pmi.com",
        smtpPort: "587",
        smtpUsername: "notifications@pmi.com",
        smtpPassword: "",
        fromEmail: "onboarding@pmi.com",
        fromName: "PMI Onboarding",
        enableEmailNotifications: true,
      });
    } else if (activeTab === "notifications") {
      setNotificationSettings({
        enableSystemNotifications: true,
        enableEmailNotifications: true,
        welcomeEmailTemplate: "default",
        taskReminderTemplate: "default",
        evaluationReminderTemplate: "default",
        reminderFrequency: "daily",
      });
    } else if (activeTab === "security") {
      setSecuritySettings({
        passwordMinLength: 8,
        passwordRequireUppercase: true,
        passwordRequireLowercase: true,
        passwordRequireNumbers: true,
        passwordRequireSpecial: true,
        passwordExpireDays: 90,
        sessionTimeout: 30,
        enableTwoFactor: false,
        allowedLoginAttempts: 5,
        lockoutDuration: 30,
      });
    }

    setConfirmModalOpen(false);
    setSaveSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <Settings className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        </div>
        <p className="text-gray-600">
          Configure system-wide settings and preferences for the PMI Onboarding
          Portal.
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
            <option value="general">General</option>
            <option value="email">Email</option>
            <option value="notifications">Notifications</option>
            <option value="security">Security</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === "general"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("general")}
              >
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  General
                </div>
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === "email"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("email")}
              >
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
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
                  activeTab === "security"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("security")}
              >
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </div>
              </button>
            </nav>
          </div>
        </div>

        <div className="p-6">
          {saveSuccess && (
            <Alert
              type="success"
              title="Settings Saved"
              message="Your settings have been saved successfully."
              className="mb-4"
            />
          )}

          {saveError && (
            <Alert
              type="error"
              title="Error Saving Settings"
              message={saveError}
              className="mb-4"
            />
          )}

          {activeTab === "general" && (
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="siteName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Site Name
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={generalSettings.companyName}
                    onChange={handleGeneralChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="adminEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Admin Email
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    value={generalSettings.adminEmail}
                    onChange={handleGeneralChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="timezone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={generalSettings.timezone}
                      onChange={handleGeneralChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">
                        Eastern Time (ET)
                      </option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">
                        Pacific Time (PT)
                      </option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="defaultLanguage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Default Language
                    </label>
                    <select
                      id="defaultLanguage"
                      name="defaultLanguage"
                      value={generalSettings.defaultLanguage}
                      onChange={handleGeneralChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="fr-FR">French</option>
                      <option value="es-ES">Spanish</option>
                      <option value="de-DE">German</option>
                      <option value="it-IT">Italian</option>
                      <option value="ja-JP">Japanese</option>
                      <option value="zh-CN">Chinese (Simplified)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="dateFormat"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date Format
                    </label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      value={generalSettings.dateFormat}
                      onChange={handleGeneralChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="MMM D, YYYY">MMM D, YYYY</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="timeFormat"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Time Format
                    </label>
                    <select
                      id="timeFormat"
                      name="timeFormat"
                      value={generalSettings.timeFormat}
                      onChange={handleGeneralChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="12h">12-hour (AM/PM)</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-5">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleResetDefaults}
                  >
                    Reset to Defaults
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {activeTab === "email" && (
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Server className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Configure the email server settings for sending
                        notifications and automated emails.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="smtpServer"
                    className="block text-sm font-medium text-gray-700"
                  >
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    id="smtpServer"
                    name="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={handleEmailChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="smtpPort"
                      className="block text-sm font-medium text-gray-700"
                    >
                      SMTP Port
                    </label>
                    <input
                      type="text"
                      id="smtpPort"
                      name="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={handleEmailChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enableEmailNotifications"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Notifications
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="enableEmailNotifications"
                          name="enableEmailNotifications"
                          checked={emailSettings.enableEmailNotifications}
                          onChange={handleEmailChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Enable email notifications
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="smtpUsername"
                      className="block text-sm font-medium text-gray-700"
                    >
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      id="smtpUsername"
                      name="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={handleEmailChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="smtpPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      id="smtpPassword"
                      name="smtpPassword"
                      value={emailSettings.smtpPassword}
                      onChange={handleEmailChange}
                      placeholder="••••••••••••"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fromEmail"
                      className="block text-sm font-medium text-gray-700"
                    >
                      From Email
                    </label>
                    <input
                      type="email"
                      id="fromEmail"
                      name="fromEmail"
                      value={emailSettings.fromEmail}
                      onChange={handleEmailChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fromName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      From Name
                    </label>
                    <input
                      type="text"
                      id="fromName"
                      name="fromName"
                      value={emailSettings.fromName}
                      onChange={handleEmailChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      // This would be an API call to test the email settings
                      alert(
                        "Email test functionality would be implemented here"
                      );
                    }}
                  >
                    Test Email Configuration
                  </Button>
                </div>

                <div className="flex justify-between pt-5">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleResetDefaults}
                  >
                    Reset to Defaults
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Bell className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Configure notification settings and email templates for
                        system events.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      System Notifications
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="enableSystemNotifications"
                          name="enableSystemNotifications"
                          checked={
                            notificationSettings.enableSystemNotifications
                          }
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Enable in-app notifications
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Notifications
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="enableEmailNotifications"
                          name="enableEmailNotifications"
                          checked={
                            notificationSettings.enableEmailNotifications
                          }
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Enable email notifications
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reminderFrequency"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reminder Frequency
                  </label>
                  <select
                    id="reminderFrequency"
                    name="reminderFrequency"
                    value={notificationSettings.reminderFrequency}
                    onChange={handleNotificationChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="welcomeEmailTemplate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Welcome Email Template
                  </label>
                  <select
                    id="welcomeEmailTemplate"
                    name="welcomeEmailTemplate"
                    value={notificationSettings.welcomeEmailTemplate}
                    onChange={handleNotificationChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="default">Default Template</option>
                    <option value="inkompass">Inkompass Program</option>
                    <option value="earlyTalent">Early Talent Program</option>
                    <option value="apprenticeship">
                      Apprenticeship Program
                    </option>
                    <option value="academicPlacement">
                      Academic Placement
                    </option>
                    <option value="workExperience">Work Experience</option>
                    <option value="custom">Custom Template</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="taskReminderTemplate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Task Reminder Template
                  </label>
                  <select
                    id="taskReminderTemplate"
                    name="taskReminderTemplate"
                    value={notificationSettings.taskReminderTemplate}
                    onChange={handleNotificationChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="default">Default Template</option>
                    <option value="hr">HR Tasks</option>
                    <option value="training">Training Tasks</option>
                    <option value="supervisor">Supervisor Tasks</option>
                    <option value="custom">Custom Template</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="evaluationReminderTemplate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Evaluation Reminder Template
                  </label>
                  <select
                    id="evaluationReminderTemplate"
                    name="evaluationReminderTemplate"
                    value={notificationSettings.evaluationReminderTemplate}
                    onChange={handleNotificationChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="default">Default Template</option>
                    <option value="3month">3-Month Evaluation</option>
                    <option value="6month">6-Month Evaluation</option>
                    <option value="annual">Annual Evaluation</option>
                    <option value="custom">Custom Template</option>
                  </select>
                </div>

                <div className="flex justify-between pt-5">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleResetDefaults}
                  >
                    Reset to Defaults
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Configure security settings including password
                        requirements, session management, and authentication
                        options.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Password Requirements
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="passwordMinLength"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Minimum Password Length
                        </label>
                        <input
                          type="number"
                          id="passwordMinLength"
                          name="passwordMinLength"
                          value={securitySettings.passwordMinLength}
                          onChange={handleSecurityChange}
                          min="6"
                          max="20"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="passwordExpireDays"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password Expiry (days)
                        </label>
                        <input
                          type="number"
                          id="passwordExpireDays"
                          name="passwordExpireDays"
                          value={securitySettings.passwordExpireDays}
                          onChange={handleSecurityChange}
                          min="0"
                          max="365"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Set to 0 to never expire
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            id="passwordRequireUppercase"
                            name="passwordRequireUppercase"
                            checked={securitySettings.passwordRequireUppercase}
                            onChange={handleSecurityChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Uppercase
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            id="passwordRequireLowercase"
                            name="passwordRequireLowercase"
                            checked={securitySettings.passwordRequireLowercase}
                            onChange={handleSecurityChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Lowercase
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            id="passwordRequireNumbers"
                            name="passwordRequireNumbers"
                            checked={securitySettings.passwordRequireNumbers}
                            onChange={handleSecurityChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Numbers
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            id="passwordRequireSpecial"
                            name="passwordRequireSpecial"
                            checked={securitySettings.passwordRequireSpecial}
                            onChange={handleSecurityChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Special Chars
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-base font-medium text-gray-900">
                    Session Settings
                  </h3>
                  <div className="mt-2">
                    <label
                      htmlFor="sessionTimeout"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      id="sessionTimeout"
                      name="sessionTimeout"
                      value={securitySettings.sessionTimeout}
                      onChange={handleSecurityChange}
                      min="5"
                      max="1440"
                      className="mt-1 block w-full sm:w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Time before automatic logout due to inactivity
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-base font-medium text-gray-900">
                    Authentication
                  </h3>
                  <div className="mt-2 space-y-4">
                    <div>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="enableTwoFactor"
                          name="enableTwoFactor"
                          checked={securitySettings.enableTwoFactor}
                          onChange={handleSecurityChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Enable Two-Factor Authentication
                        </span>
                      </label>
                      <p className="mt-1 text-xs text-gray-500 ml-6">
                        Require users to verify their identity using a secondary
                        device
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="allowedLoginAttempts"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Failed Login Attempts
                        </label>
                        <input
                          type="number"
                          id="allowedLoginAttempts"
                          name="allowedLoginAttempts"
                          value={securitySettings.allowedLoginAttempts}
                          onChange={handleSecurityChange}
                          min="1"
                          max="10"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Maximum failed attempts before account lockout
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="lockoutDuration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Lockout Duration (minutes)
                        </label>
                        <input
                          type="number"
                          id="lockoutDuration"
                          name="lockoutDuration"
                          value={securitySettings.lockoutDuration}
                          onChange={handleSecurityChange}
                          min="1"
                          max="1440"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Time before a locked account can be accessed again
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-5">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleResetDefaults}
                  >
                    Reset to Defaults
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Action"
        size="sm"
      >
        <div className="py-3">
          <p className="text-gray-700">
            Are you sure you want to reset these settings to their default
            values? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmReset}>
            Reset to Defaults
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SystemSettings;
