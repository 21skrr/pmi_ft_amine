// frontend/src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import EmployeeDashboard from "../components/dashboard/EmployeeDashboard";
import SupervisorDashboard from "../components/dashboard/SupervisorDashboard";
import ManagerDashboard from "../components/dashboard/ManagerDashboard";
import HRDashboard from "../components/dashboard/HRDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  // Render different dashboards based on user role
  if (user.role === "employee") {
    return <EmployeeDashboard />;
  } else if (user.role === "supervisor") {
    return <SupervisorDashboard />;
  } else if (user.role === "manager") {
    return <ManagerDashboard />;
  } else if (user.role === "hr") {
    return <HRDashboard />;
  }

  // Fallback to employee dashboard if role is not recognized
  return <EmployeeDashboard />;
};

export default Dashboard;
