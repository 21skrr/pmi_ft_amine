// frontend/src/components/layout/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Calendar,
  FileText,
  ClipboardCheck,
  MessageSquare,
  Users,
  FileBox,
  Settings,
  UserCog,
  BarChart,
  List,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ open, setOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Check if a path is active
  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/") {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  // Reusable navigation item component
  const NavItem = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        isActive(to)
          ? "bg-blue-100 text-blue-800"
          : "text-gray-700 hover:bg-gray-100"
      }`}
      onClick={() => setOpen(false)}
    >
      <Icon
        className={`mr-2 h-5 w-5 ${
          isActive(to) ? "text-blue-600" : "text-gray-500"
        }`}
      />
      {children}
    </Link>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:h-screen md:z-0`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link
            to="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <img src="/logo.png" alt="PMI Logo" className="h-8 w-auto" />
            <span className="ml-2 text-lg font-bold text-gray-900">
              PMI Onboarding
            </span>
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="h-10 w-10 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-4 h-full overflow-y-auto">
          <nav className="space-y-1">
            <NavItem to="/dashboard" icon={LayoutDashboard}>
              Dashboard
            </NavItem>

            <NavItem to="/programs" icon={Briefcase}>
              Programs
            </NavItem>

            <NavItem to="/checklists" icon={CheckSquare}>
              Checklists
            </NavItem>

            <NavItem to="/calendar" icon={Calendar}>
              Calendar
            </NavItem>

            <NavItem to="/forms" icon={FileText}>
              Forms & Surveys
            </NavItem>

            <NavItem to="/evaluations" icon={ClipboardCheck}>
              Evaluations
            </NavItem>

            <NavItem to="/feedback" icon={MessageSquare}>
              Feedback
            </NavItem>

            {(user.role === "supervisor" || user.role === "manager") && (
              <NavItem to="/team" icon={Users}>
                Team
              </NavItem>
            )}

            <NavItem to="/resources" icon={FileBox}>
              Resources
            </NavItem>
          </nav>

          {/* HR Admin Section */}
          {user.role === "hr" && (
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administration
              </h3>

              <nav className="mt-2 space-y-1">
                <NavItem to="/admin" icon={LayoutDashboard}>
                  Admin Panel
                </NavItem>

                <NavItem to="/admin/users" icon={UserCog}>
                  User Management
                </NavItem>

                <NavItem to="/admin/roles" icon={Users}>
                  Roles & Permissions
                </NavItem>

                <NavItem to="/admin/programs" icon={Briefcase}>
                  Manage Programs
                </NavItem>

                <NavItem to="/admin/metrics" icon={BarChart}>
                  Onboarding Metrics
                </NavItem>

                <NavItem to="/admin/activity" icon={List}>
                  Activity Logs
                </NavItem>

                <NavItem to="/admin/settings" icon={Settings}>
                  System Settings
                </NavItem>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
