import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import SurveyList from "./components/surveys/SurveyList";
import SurveyForm from "./components/surveys/SurveyForm";
import SurveyResponse from "./components/surveys/SurveyResponse";
import RolePermissions from "./components/roles/RolePermissions";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="surveys" element={<SurveyList />} />
        <Route path="surveys/new" element={<SurveyForm />} />
        <Route path="surveys/:id" element={<SurveyResponse />} />
        <Route path="roles" element={<RolePermissions />} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
