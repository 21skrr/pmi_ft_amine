// frontend/src/pages/admin/AdminPanel.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  Settings,
  Briefcase,
  BarChart2,
  ClipboardList,
  FileText,
  Clock,
  Shield,
} from "lucide-react";
import Card from "../../components/common/Card";

const AdminPanel = () => {
  const { user } = useAuth();

  // Check if user is HR
  if (user.role !== "hr") {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>You don't have permission to access the admin panel.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const adminModules = [
    {
      name: "User Management",
      description: "Add, edit, and manage users, roles, and permissions.",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      color: "blue",
      path: "/admin/users",
    },
    {
      name: "Roles & Permissions",
      description: "Configure access controls and permissions for user roles.",
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      color: "purple",
      path: "/admin/roles",
    },
    {
      name: "Program Management",
      description: "Create and manage onboarding programs and templates.",
      icon: <Briefcase className="h-8 w-8 text-green-500" />,
      color: "green",
      path: "/admin/programs",
    },
    {
      name: "Onboarding Metrics",
      description: "View and analyze onboarding statistics and progress.",
      icon: <BarChart2 className="h-8 w-8 text-yellow-500" />,
      color: "yellow",
      path: "/admin/metrics",
    },
    {
      name: "Survey Management",
      description: "Create and manage feedback surveys and forms.",
      icon: <ClipboardList className="h-8 w-8 text-red-500" />,
      color: "red",
      path: "/admin/surveys",
    },
    {
      name: "Document Management",
      description: "Upload and organize documents and resources.",
      icon: <FileText className="h-8 w-8 text-indigo-500" />,
      color: "indigo",
      path: "/admin/documents",
    },
    {
      name: "Activity Logs",
      description: "View system activity and audit logs.",
      icon: <Clock className="h-8 w-8 text-pink-500" />,
      color: "pink",
      path: "/admin/activity",
    },
    {
      name: "System Settings",
      description: "Configure system-wide settings and preferences.",
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      color: "gray",
      path: "/admin/settings",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h1>
        <p className="text-gray-600">
          Manage and configure the PMI Onboarding Platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {adminModules.map((module) => (
          <Link
            key={module.name}
            to={module.path}
            className="transition transform hover:-translate-y-1 hover:shadow-lg"
          >
            <Card className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-${module.color}-100`}>
                    {module.icon}
                  </div>
                  <h2 className="ml-4 text-xl font-semibold text-gray-800">
                    {module.name}
                  </h2>
                </div>
                <p className="text-gray-600 flex-grow">{module.description}</p>
                <div className="mt-4 text-sm text-blue-600 font-medium">
                  Manage →
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
