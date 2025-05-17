import React, { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";

const mockRoles = [
  {
    id: 1,
    name: "HR Admin",
    description: "Full access to all features and settings",
    permissions: {
      manageUsers: true,
      manageRoles: true,
      manageSurveys: true,
      viewReports: true,
      manageSettings: true,
    },
  },
  {
    id: 2,
    name: "Manager",
    description: "Can manage team members and view reports",
    permissions: {
      manageUsers: false,
      manageRoles: false,
      manageSurveys: true,
      viewReports: true,
      manageSettings: false,
    },
  },
  {
    id: 3,
    name: "Employee",
    description: "Basic access to surveys and personal settings",
    permissions: {
      manageUsers: false,
      manageRoles: false,
      manageSurveys: false,
      viewReports: false,
      manageSettings: false,
    },
  },
];

const permissions = [
  {
    id: "manageUsers",
    label: "Manage Users",
    description: "Can create, edit, and delete users",
  },
  {
    id: "manageRoles",
    label: "Manage Roles",
    description: "Can create, edit, and delete roles",
  },
  {
    id: "manageSurveys",
    label: "Manage Surveys",
    description: "Can create, edit, and delete surveys",
  },
  {
    id: "viewReports",
    label: "View Reports",
    description: "Can view survey reports and analytics",
  },
  {
    id: "manageSettings",
    label: "Manage Settings",
    description: "Can modify system settings",
  },
];

const RolePermissions = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: {
      manageUsers: false,
      manageRoles: false,
      manageSurveys: false,
      viewReports: false,
      manageSettings: false,
    },
  });

  const handleEditRole = (role) => {
    setEditingRole({ ...role });
  };

  const handleSaveRole = () => {
    if (editingRole) {
      setRoles(
        roles.map((role) => (role.id === editingRole.id ? editingRole : role))
      );
      setEditingRole(null);
    } else {
      setRoles([
        ...roles,
        {
          ...newRole,
          id: roles.length + 1,
        },
      ]);
      setNewRole({
        name: "",
        description: "",
        permissions: {
          manageUsers: false,
          manageRoles: false,
          manageSurveys: false,
          viewReports: false,
          manageSettings: false,
        },
      });
    }
  };

  const handleDeleteRole = (roleId) => {
    setRoles(roles.filter((role) => role.id !== roleId));
  };

  const handlePermissionChange = (roleId, permissionId, value) => {
    if (editingRole) {
      setEditingRole({
        ...editingRole,
        permissions: {
          ...editingRole.permissions,
          [permissionId]: value,
        },
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: {
          ...newRole.permissions,
          [permissionId]: value,
        },
      });
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Roles & Permissions
        </h1>

        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Roles</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage user roles and their permissions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Role
              </button>
            </div>

            <div className="border-t border-gray-200">
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">
                  Role Name
                </div>
                <div className="text-sm font-medium text-gray-500">
                  Description
                </div>
                <div className="text-sm font-medium text-gray-500">Actions</div>
              </div>

              {roles.map((role) => (
                <div
                  key={role.id}
                  className="border-t border-gray-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {role.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {role.description}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => handleEditRole(role)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(editingRole || !editingRole) && (
          <div className="mt-8">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingRole ? "Edit Role" : "New Role"}
                </h3>
                <div className="mt-6 space-y-6">
                  <div>
                    <label
                      htmlFor="role-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role Name
                    </label>
                    <input
                      type="text"
                      id="role-name"
                      value={editingRole ? editingRole.name : newRole.name}
                      onChange={(e) =>
                        editingRole
                          ? setEditingRole({
                              ...editingRole,
                              name: e.target.value,
                            })
                          : setNewRole({ ...newRole, name: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role-description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="role-description"
                      rows={3}
                      value={
                        editingRole
                          ? editingRole.description
                          : newRole.description
                      }
                      onChange={(e) =>
                        editingRole
                          ? setEditingRole({
                              ...editingRole,
                              description: e.target.value,
                            })
                          : setNewRole({
                              ...newRole,
                              description: e.target.value,
                            })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Permissions
                    </h4>
                    <div className="mt-4 space-y-4">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              id={permission.id}
                              checked={
                                editingRole
                                  ? editingRole.permissions[permission.id]
                                  : newRole.permissions[permission.id]
                              }
                              onChange={(e) =>
                                handlePermissionChange(
                                  editingRole ? editingRole.id : null,
                                  permission.id,
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor={permission.id}
                              className="font-medium text-gray-700"
                            >
                              {permission.label}
                            </label>
                            <p className="text-gray-500">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    {editingRole && (
                      <button
                        type="button"
                        onClick={() => setEditingRole(null)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleSaveRole}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingRole ? "Save Changes" : "Create Role"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolePermissions;
