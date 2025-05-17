import React, { useState, useEffect } from "react";
import {
  Shield,
  UserPlus,
  UserMinus,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
} from "lucide-react";
import Button from "../common/Button";
import Card from "../common/Card";
import Alert from "../common/Alert";
import Loading from "../common/Loading";
import Modal from "../common/Modal";
import { useAuth } from "../../context/AuthContext";

const RolePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { user } = useAuth();

  // Mock permissions - replace with actual API call
  const defaultPermissions = {
    hr: {
      canManageUsers: true,
      canManageSurveys: true,
      canViewAnalytics: true,
      canManageRoles: true,
      canManageDocuments: true,
      canManagePrograms: true,
      canManageEvaluations: true,
      canManageCoaching: true,
    },
    manager: {
      canManageUsers: false,
      canManageSurveys: false,
      canViewAnalytics: true,
      canManageRoles: false,
      canManageDocuments: true,
      canManagePrograms: false,
      canManageEvaluations: true,
      canManageCoaching: true,
    },
    supervisor: {
      canManageUsers: false,
      canManageSurveys: false,
      canViewAnalytics: true,
      canManageRoles: false,
      canManageDocuments: true,
      canManagePrograms: false,
      canManageEvaluations: true,
      canManageCoaching: true,
    },
    employee: {
      canManageUsers: false,
      canManageSurveys: false,
      canViewAnalytics: false,
      canManageRoles: false,
      canManageDocuments: false,
      canManagePrograms: false,
      canManageEvaluations: false,
      canManageCoaching: false,
    },
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        const fetchedRoles = Object.keys(defaultPermissions).map((role) => ({
          name: role,
          permissions: defaultPermissions[role],
        }));
        setRoles(fetchedRoles);
        setError(null);
      } catch (err) {
        setError("Failed to load roles and permissions");
        console.error("Error fetching roles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleSavePermissions = async (updatedPermissions) => {
    try {
      // Replace with actual API call
      setRoles(
        roles.map((role) =>
          role.name === selectedRole.name
            ? { ...role, permissions: updatedPermissions }
            : role
        )
      );
      setShowEditModal(false);
      setSelectedRole(null);
    } catch (err) {
      setError("Failed to update permissions");
      console.error("Error updating permissions:", err);
    }
  };

  const getPermissionLabel = (permission) => {
    const labels = {
      canManageUsers: "Manage Users",
      canManageSurveys: "Manage Surveys",
      canViewAnalytics: "View Analytics",
      canManageRoles: "Manage Roles",
      canManageDocuments: "Manage Documents",
      canManagePrograms: "Manage Programs",
      canManageEvaluations: "Manage Evaluations",
      canManageCoaching: "Manage Coaching",
    };
    return labels[permission] || permission;
  };

  if (loading) return <Loading message="Loading roles and permissions..." />;

  return (
    <div className="space-y-6">
      {error && (
        <Alert type="error" title="Error" message={error} className="mb-4" />
      )}

      <div className="grid gap-6">
        {roles.map((role) => (
          <Card key={role.name} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 capitalize">
                  {role.name} Role
                </h3>
                <p className="text-sm text-gray-500">
                  Manage permissions for {role.name} users
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={<Edit2 className="h-4 w-4" />}
                onClick={() => handleEditRole(role)}
              >
                Edit Permissions
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(role.permissions).map(([permission, value]) => (
                <div
                  key={permission}
                  className="flex items-center space-x-2 text-sm"
                >
                  {value ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-gray-700">
                    {getPermissionLabel(permission)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {showEditModal && selectedRole && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Edit ${selectedRole.name} Permissions`}
        >
          <div className="space-y-4">
            {Object.entries(selectedRole.permissions).map(
              ([permission, value]) => (
                <div
                  key={permission}
                  className="flex items-center justify-between"
                >
                  <label className="text-sm font-medium text-gray-700">
                    {getPermissionLabel(permission)}
                  </label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => {
                      const updatedPermissions = {
                        ...selectedRole.permissions,
                        [permission]: e.target.checked,
                      };
                      handleSavePermissions(updatedPermissions);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              )
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RolePermissions;
