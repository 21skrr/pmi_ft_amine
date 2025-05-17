// frontend/src/pages/Team.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTeamMembers } from "../api/userApi";
import {
  Users,
  UserCheck,
  Clock,
  BarChart2,
  CheckSquare,
  Plus,
} from "lucide-react";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";
import { useAuth } from "../context/AuthContext";

const Team = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const data = await getTeamMembers();
        setTeamMembers(data);
        setError(null);
      } catch (err) {
        // frontend/src/pages/Team.jsx (continued)
        setError("Failed to load team members. Please try again later.");
        console.error("Error fetching team members:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Get onboarding statistics
  const getOnboardingStats = () => {
    const stats = {
      total: teamMembers.length,
      inProgress: 0,
      completed: 0,
      byStage: {
        prepare: 0,
        orient: 0,
        land: 0,
        integrate: 0,
        excel: 0,
      },
    };

    teamMembers.forEach((member) => {
      if (member.OnboardingProgress) {
        if (member.OnboardingProgress.progress === 100) {
          stats.completed++;
        } else {
          stats.inProgress++;
        }

        if (member.OnboardingProgress.stage) {
          stats.byStage[member.OnboardingProgress.stage]++;
        }
      }
    });

    return stats;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Sort team members by start date (newest first)
  const sortedTeamMembers = [...teamMembers].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(b.startDate) - new Date(a.startDate);
  });

  // Only calculate stats if team members are loaded
  const stats = !loading && !error ? getOnboardingStats() : null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
        </div>
        <p className="text-gray-600">
          {user.role === "supervisor"
            ? "Monitor and manage your team members' onboarding progress."
            : "Oversee department teams and their onboarding progress."}
        </p>
      </div>

      {loading ? (
        <Loading message="Loading team members..." />
      ) : error ? (
        <Alert type="error" title="Error" message={error} />
      ) : (
        <>
          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className="bg-blue-50 border-blue-100"
              titleIcon={<Users className="h-5 w-5 text-blue-600" />}
              title="Team Members"
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {stats.total}
                </p>
                <p className="text-sm text-blue-500 mt-1">Total employees</p>
              </div>
            </Card>

            <Card
              className="bg-green-50 border-green-100"
              titleIcon={<UserCheck className="h-5 w-5 text-green-600" />}
              title="Completed Onboarding"
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {stats.completed}
                </p>
                <p className="text-sm text-green-500 mt-1">
                  {Math.round((stats.completed / stats.total) * 100) || 0}% of
                  team
                </p>
              </div>
            </Card>

            <Card
              className="bg-yellow-50 border-yellow-100"
              titleIcon={<Clock className="h-5 w-5 text-yellow-600" />}
              title="In Progress"
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.inProgress}
                </p>
                <p className="text-sm text-yellow-500 mt-1">
                  {Math.round((stats.inProgress / stats.total) * 100) || 0}% of
                  team
                </p>
              </div>
            </Card>

            <Card
              className="bg-purple-50 border-purple-100"
              titleIcon={<BarChart2 className="h-5 w-5 text-purple-600" />}
              title="Onboarding Stage"
            >
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <p className="font-medium text-purple-700">
                    {stats.byStage.prepare}
                  </p>
                  <p className="text-purple-500">Prepare</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-purple-700">
                    {stats.byStage.orient}
                  </p>
                  <p className="text-purple-500">Orient</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-purple-700">
                    {stats.byStage.land}
                  </p>
                  <p className="text-purple-500">Land</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-purple-700">
                    {stats.byStage.integrate}
                  </p>
                  <p className="text-purple-500">Integrate</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-purple-700">
                    {stats.byStage.excel}
                  </p>
                  <p className="text-purple-500">Excel</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Team Members List */}
          <Card
            title="Team Members"
            titleIcon={<Users className="h-5 w-5 text-blue-500" />}
          >
            {sortedTeamMembers.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Users className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                <p>No team members found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Program
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Start Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Onboarding Progress
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Stage
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedTeamMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {member.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.programType ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {member.programType === "inkompass"
                                ? "Inkompass"
                                : member.programType === "earlyTalent"
                                ? "Early Talent"
                                : member.programType === "apprenticeship"
                                ? "Apprenticeship"
                                : member.programType === "academicPlacement"
                                ? "Academic Placement"
                                : member.programType === "workExperience"
                                ? "Work Experience"
                                : member.programType}
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(member.startDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{
                                  width: `${member.onboardingProgress || 0}%`,
                                }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-500">
                              {member.onboardingProgress || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.OnboardingProgress ? (
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                member.OnboardingProgress.stage === "prepare"
                                  ? "bg-gray-100 text-gray-800"
                                  : member.OnboardingProgress.stage === "orient"
                                  ? "bg-blue-100 text-blue-800"
                                  : member.OnboardingProgress.stage === "land"
                                  ? "bg-green-100 text-green-800"
                                  : member.OnboardingProgress.stage ===
                                    "integrate"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {member.OnboardingProgress.stage
                                .charAt(0)
                                .toUpperCase() +
                                member.OnboardingProgress.stage.slice(1)}
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                              Not Started
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/checklists?employee=${member.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <CheckSquare className="h-5 w-5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {user.role === "hr" && (
            <div className="flex justify-end">
              <Link
                to="/admin/users/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Team;
