// frontend/src/components/layout/Layout.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useAuth } from "../../context/AuthContext";
import { NotificationProvider } from "../../context/NotificationContext";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;

    // Remove leading slash and split by segments
    const segments = path.substring(1).split("/");

    if (segments[0] === "dashboard" || segments[0] === "") {
      return "Dashboard";
    }

    if (segments[0] === "programs") {
      if (segments.length === 1) {
        return "Programs";
      }

      // Handle specific program pages
      const program = segments[1];
      if (program === "inkompass") {
        return "Inkompass Program";
      } else if (program === "early-talent") {
        return "Early Talent Program";
      } else if (program === "apprenticeship") {
        return "Apprenticeship Program";
      } else if (program === "academic-placement") {
        return "Academic Placement";
      } else if (program === "work-experience") {
        return "Work Experience";
      }
    }

    if (segments[0] === "checklists") {
      return "Onboarding Checklists";
    }

    if (segments[0] === "calendar") {
      return "Calendar";
    }

    if (segments[0] === "forms") {
      return "Forms & Surveys";
    }

    if (segments[0] === "evaluations") {
      return "Evaluations";
    }

    if (segments[0] === "feedback") {
      return "Feedback";
    }

    if (segments[0] === "resources") {
      return "Resources";
    }

    if (segments[0] === "team") {
      return "Team Management";
    }

    if (segments[0] === "profile") {
      return "My Profile";
    }

    if (segments[0] === "settings") {
      return "Settings";
    }

    if (segments[0] === "notifications") {
      return "All Notifications";
    }

    if (segments[0] === "admin") {
      if (segments.length === 1) {
        return "Admin Panel";
      }

      // Handle admin sub-pages
      const adminPage = segments[1];
      if (adminPage === "users") {
        return segments[2] === "new" ? "Add New Employee" : "User Management";
        // frontend/src/components/layout/Layout.jsx (continued)
      } else if (adminPage === "roles") {
        return "Roles & Permissions";
      } else if (adminPage === "settings") {
        return "System Settings";
      } else if (adminPage === "programs") {
        return "Manage Programs";
      } else if (adminPage === "metrics") {
        return "Onboarding Metrics";
      } else if (adminPage === "activity") {
        return "Activity Logs";
      }
    }

    // Capitalize the first letter of each segment and join with spaces
    return segments
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={getPageTitle()} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
