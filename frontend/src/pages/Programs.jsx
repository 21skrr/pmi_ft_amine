// frontend/src/pages/Programs.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Calendar,
  User,
  BookOpen,
  GraduationCap,
  Briefcase,
  Building,
} from "lucide-react";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";

const Programs = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/programs");

        if (!response.ok) {
          throw new Error("Failed to fetch programs");
        }

        const data = await response.json();
        setPrograms(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError("Failed to load programs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Map program types to icons and colors
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "internship":
        return <Calendar className="h-12 w-12 text-blue-500" />;
      case "graduate development":
        return <User className="h-12 w-12 text-purple-500" />;
      case "specialist qualification":
        return <BookOpen className="h-12 w-12 text-green-500" />;
      case "student placement":
        return <GraduationCap className="h-12 w-12 text-red-500" />;
      case "short-term placement":
        return <Briefcase className="h-12 w-12 text-yellow-500" />;
      default:
        return <Building className="h-12 w-12 text-gray-500" />;
    }
  };

  const getColor = (type) => {
    switch (type?.toLowerCase()) {
      case "internship":
        return "blue";
      case "graduate development":
        return "purple";
      case "specialist qualification":
        return "green";
      case "student placement":
        return "red";
      case "short-term placement":
        return "yellow";
      default:
        return "gray";
    }
  };

  if (loading) {
    return <Loading message="Loading programs..." />;
  }

  if (error) {
    return <Alert type="error" title="Error" message={error} />;
  }

  // Highlight user's program if they are an employee
  const userProgram = user.role === "employee" ? user.programType : null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <Building className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">PMI Programs</h1>
        </div>
        <p className="text-gray-600">
          Explore our various onboarding programs designed to support talent
          development and integration.
          {userProgram && (
            <span className="ml-1">
              You are currently enrolled in the{" "}
              <span className="font-medium text-blue-600">
                {programs.find((p) => p.programType === userProgram)?.title ||
                  userProgram}
              </span>{" "}
              program.
            </span>
          )}
        </p>
      </div>

      {programs.length === 0 ? (
        <div className="text-center py-12">
          <Building className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No programs available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {programs.map((program) => {
            const color = getColor(program.programType);
            return (
              <Link
                key={program.id}
                to={`/programs/${program.id}`}
                className="transition transform hover:-translate-y-1 hover:shadow-lg"
              >
                <Card
                  className={`h-full ${
                    program.programType === userProgram
                      ? `bg-${color}-50 border-${color}-200`
                      : ""
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-lg bg-${color}-100`}>
                        {getIcon(program.programType)}
                      </div>
                      <h2 className="ml-4 text-xl font-semibold text-gray-800">
                        {program.title}
                        {program.programType === userProgram && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                            Your Program
                          </span>
                        )}
                      </h2>
                    </div>
                    <p className="text-gray-600 flex-grow">
                      {program.description}
                    </p>
                    <div className="mt-4 text-sm text-blue-600 font-medium">
                      Learn more →
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {user.role === "hr" && (
        <div className="flex justify-end">
          <Link
            to="/admin/programs"
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
          >
            <span>Manage Programs</span>
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Programs;
