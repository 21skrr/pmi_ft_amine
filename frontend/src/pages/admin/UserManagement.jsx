// frontend/src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllUsers, deleteUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronDown,
  UserCheck,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import Loading from "../../components/common/Loading";
import Modal from "../../components/common/Modal";

const UserManagement = () => {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await getAllUsers();
        setAllUsers(users);
        setFilteredUsers(users);
        setError(null);
      } catch (err) {
        setError("Failed to load users. Please try again later.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters when search query or filters change
    if (!allUsers) return;

    let result = [...allUsers];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.department && user.department.toLowerCase().includes(query))
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Apply program filter
    if (programFilter !== "all") {
      result = result.filter((user) => user.programType === programFilter);
    }

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, programFilter, allUsers]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      await deleteUser(userToDelete.id);

      // Remove from state
      const updatedUsers = allUsers.filter((u) => u.id !== userToDelete.id);
      setAllUsers(updatedUsers);
      setFilteredUsers(filteredUsers.filter((u) => u.id !== userToDelete.id));

      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setDeleteError("Failed to delete user. Please try again.");
      console.error("Error deleting user:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <Loading message="Loading users..." />;

  // Get unique programs for filter
  const programs = [
    ...new Set(allUsers.filter((u) => u.programType).map((u) => u.programType)),
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        </div>
        <p className="text-gray-600">
          Add, edit, and manage users, roles, and permissions.
        </p>
      </div>

      {error && (
        <Alert type="error" title="Error Loading Users" message={error} />
      )}

      <Card>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-3">
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="employee">Employee</option>
                <option value="supervisor">Supervisor</option>
                <option value="manager">Manager</option>
                <option value="hr">HR</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
              >
                <option value="all">All Programs</option>
                {programs.map((program) => (
                  <option key={program} value={program}>
                    {program === "inkompass"
                      ? "Inkompass"
                      : program === "earlyTalent"
                      ? "Early Talent"
                      : program === "apprenticeship"
                      ? "Apprenticeship"
                      : program === "academicPlacement"
                      ? "Academic Placement"
                      : program === "workExperience"
                      ? "Work Experience"
                      : program}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            <Link to="/admin/users/new">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="h-4 w-4" />}
              >
                Add User
              </Button>
            </Link>
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
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
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
                  Onboarding
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Start Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                    // frontend/src/pages/admin/UserManagement.jsx (continued)
                  >
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "?"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "employee"
                            ? "bg-green-100 text-green-800"
                            : user.role === "supervisor"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "manager"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.department || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.programType ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {user.programType === "inkompass"
                            ? "Inkompass"
                            : user.programType === "earlyTalent"
                            ? "Early Talent"
                            : user.programType === "apprenticeship"
                            ? "Apprenticeship"
                            : user.programType === "academicPlacement"
                            ? "Academic Placement"
                            : user.programType === "workExperience"
                            ? "Work Experience"
                            : user.programType}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === "employee" ? (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{
                                width: `${
                                  user.OnboardingProgress
                                    ? user.OnboardingProgress.progress
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            {user.OnboardingProgress
                              ? user.OnboardingProgress.progress
                              : 0}
                            %
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/admin/users/edit/${user.id}`}>
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit User"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length > 0 && (
          <div className="py-3 px-6 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
            Showing {filteredUsers.length} of {allUsers.length} users
          </div>
        )}
      </Card>

      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
        size="sm"
      >
        <div className="py-3">
          {userToDelete && (
            <p className="text-gray-700">
              Are you sure you want to delete the user{" "}
              <span className="font-medium">
                {userToDelete.name} ({userToDelete.email})
              </span>
              ? This action cannot be undone.
            </p>
          )}

          {deleteError && (
            <Alert
              type="error"
              title="Error"
              message={deleteError}
              className="mt-3"
            />
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete User"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
