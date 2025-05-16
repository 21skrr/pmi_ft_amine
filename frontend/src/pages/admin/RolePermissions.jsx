import React from "react";
import { Shield } from "lucide-react";
import RolePermissions from "../../components/admin/RolePermissions";
import Layout from "../../components/layout/Layout";

const RolePermissionsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-blue-500" />
            Role & Permissions Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage user roles and their associated permissions across the
            platform.
          </p>
        </div>

        <RolePermissions />
      </div>
    </Layout>
  );
};

export default RolePermissionsPage;
