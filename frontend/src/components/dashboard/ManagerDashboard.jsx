// src/pages/dashboard/ManagerDashboard.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { BarChart3, Users, ClipboardCheck, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ManagerDashboard = () => {
  const { user } = useAuth();

  const onboardingData = [
    { month: "Jan", completed: 8, inProgress: 12 },
    { month: "Feb", completed: 12, inProgress: 10 },
    { month: "Mar", completed: 15, inProgress: 8 },
  ];

  const retentionData = [
    { period: "30 days", rate: 95 },
    { period: "60 days", rate: 88 },
    { period: "90 days", rate: 85 },
    { period: "6 months", rate: 82 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your team's onboarding performance and key
          metrics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Team</p>
              <p className="text-2xl font-bold text-gray-900">48</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <ClipboardCheck className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">In Onboarding</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">89%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Avg Onboarding Time</p>
              <p className="text-2xl font-bold text-gray-900">42 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Onboarding Progress
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={onboardingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retention Rate */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Retention Rate
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Retention %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-800 text-white">
          <h2 className="text-lg font-medium">Recent Activity</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
              <p className="text-sm text-gray-900">
                <strong>Sarah Johnson</strong> completed their onboarding
                successfully
              </p>
              <span className="ml-auto text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
              <p className="text-sm text-gray-900">
                <strong>Mike Chen</strong> started the Early Talent program
              </p>
              <span className="ml-auto text-xs text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mr-3"></div>
              <p className="text-sm text-gray-900">
                <strong>Lisa Rodriguez</strong> has a pending evaluation
              </p>
              <span className="ml-auto text-xs text-gray-500">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
