import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layouts
import Layout from "./components/layout/Layout";

// Authentication
import Login from "./components/auth/Login";

// Public pages
import NotFound from "./pages/NotFound";

// Dashboard pages
import Dashboard from "./pages/Dashboard";

// Employee pages
import Programs from "./pages/Programs";
import OnboardingPrograms from "./pages/OnboardingPrograms";
import Resources from "./pages/Resources";
import Calendar from "./pages/Calendar";
import Checklists from "./pages/Checklists";
import FormsAndSurveys from "./pages/FormsAndSurveys";
import Evaluations from "./pages/Evaluations";
import Feedback from "./pages/Feedback";
import Team from "./pages/Team";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AllNotifications from "./pages/AllNotifications";

// Program pages
import Inkompass from "./pages/programs/Inkompass";
import EarlyTalent from "./pages/programs/EarlyTalent";
import Apprenticeship from "./pages/programs/Apprenticeship";
import AcademicPlacement from "./pages/programs/AcademicPlacement";
import WorkExperience from "./pages/programs/WorkExperience";

// Admin pages
import AdminPanel from "./pages/admin/AdminPanel";
import UserManagement from "./pages/admin/UserManagement";
import AddEmployee from "./pages/admin/AddEmployee";
import RolesPermissions from "./pages/admin/RolesPermissions";
import SystemSettings from "./pages/admin/SystemSettings";
import ManagePrograms from "./pages/admin/ManagePrograms";
import ActivityLogs from "./pages/admin/ActivityLogs";
import OnboardingMetrics from "./pages/admin/OnboardingMetrics";

// Import our new ProgramDetail component
import ProgramDetail from "./pages/ProgramDetail";

// Protected route component
const ProtectedRoute = ({ element, requiredRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
          }
        />

        {/* Program routes */}
        <Route
          path="/programs"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Programs />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/programs/inkompass"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Inkompass />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/programs/early-talent"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <EarlyTalent />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/programs/apprenticeship"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Apprenticeship />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/programs/academic-placement"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <AcademicPlacement />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/programs/work-experience"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <WorkExperience />
                </Layout>
              }
            />
          }
        />

        {/* Add the new route for viewing program details by ID */}
        <Route
          path="/programs/:id"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <ProgramDetail />
                </Layout>
              }
            />
          }
        />

        {/* Other routes */}
        <Route
          path="/checklists"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Checklists />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Calendar />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/forms"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <FormsAndSurveys />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/evaluations"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Evaluations />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Feedback />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Resources />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Settings />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <AllNotifications />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Team />
                </Layout>
              }
              requiredRoles={["supervisor", "manager"]}
            />
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <AdminPanel />
                </Layout>
              }
              requiredRoles={["hr"]}
            />
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <UserManagement />
                </Layout>
              }
              requiredRoles={["hr"]}
            />
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <AddEmployee />
                </Layout>
              }
              requiredRoles={["hr"]}
            />
          }
        />
        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <RolesPermissions />
                </Layout>
              }
              requiredRoles={["hr"]}
            />
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <SystemSettings />
                </Layout>
              }
              requiredRoles={["hr"]}
            />
          }
        />
        <Route
          path="/admin/programs"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <ManagePrograms />
                </Layout>
              }
              requiredRoles={["hr"]}
            />
          }
        />
        <Route
          path="/admin/metrics"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <OnboardingMetrics />
                </Layout>
              }
              requiredRoles={["hr"]}
            />
          }
        />
        <Route
          path="/admin/activity"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <ActivityLogs />
                </Layout>
              }
              requiredRoles={["hr"]}
            />
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
