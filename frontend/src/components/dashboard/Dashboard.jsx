import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Users, FileText, CheckCircle, Clock } from "lucide-react";

const stats = [
  {
    name: "Total Surveys",
    value: "12",
    icon: FileText,
    change: "+4.75%",
    changeType: "positive",
  },
  {
    name: "Active Users",
    value: "24",
    icon: Users,
    change: "+2.02%",
    changeType: "positive",
  },
  {
    name: "Completed Tasks",
    value: "156",
    icon: CheckCircle,
    change: "+10.18%",
    changeType: "positive",
  },
  {
    name: "Pending Tasks",
    value: "8",
    icon: Clock,
    change: "-1.39%",
    changeType: "negative",
  },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.name}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <item.icon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.name}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {item.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span
                      className={`font-medium ${
                        item.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.change}
                    </span>
                    <span className="text-gray-500"> from last month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Welcome back, {user?.name}!
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Here's an overview of your onboarding portal. You can manage
                  surveys, roles, and permissions from this dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
