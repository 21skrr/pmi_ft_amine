// frontend/src/pages/Programs.jsx
import React from "react";
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

const Programs = () => {
  const { user } = useAuth();

  // Program data
  const programs = [
    {
      id: "inkompass",
      name: "Inkompass",
      description:
        "A 3-month global internship program designed for top-performing university students.",
      icon: <Calendar className="h-12 w-12 text-blue-500" />,
      color: "blue",
      path: "/programs/inkompass",
    },
    {
      id: "earlyTalent",
      name: "Early Talent",
      description:
        "A program for recent graduates to accelerate their career and develop professional skills.",
      icon: <User className="h-12 w-12 text-purple-500" />,
      color: "purple",
      path: "/programs/early-talent",
    },
    {
      id: "apprenticeship",
      name: "Apprenticeship",
      description:
        "Learn on the job with experienced professionals providing guidance and mentorship.",
      icon: <BookOpen className="h-12 w-12 text-green-500" />,
      color: "green",
      path: "/programs/apprenticeship",
    },
    {
      id: "academicPlacement",
      name: "Academic Placement",
      description:
        "A program for students pursuing academic projects or research in collaboration with PMI.",
      icon: <GraduationCap className="h-12 w-12 text-red-500" />,
      color: "red",
      path: "/programs/academic-placement",
    },
    {
      id: "workExperience",
      name: "Work Experience",
      description:
        "Short-term placements for students to experience the professional environment.",
      icon: <Briefcase className="h-12 w-12 text-yellow-500" />,
      color: "yellow",
      path: "/programs/work-experience",
    },
  ];

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
                {programs.find((p) => p.id === userProgram)?.name ||
                  userProgram}
              </span>{" "}
              program.
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {programs.map((program) => (
          <Link
            key={program.id}
            to={program.path}
            className="transition transform hover:-translate-y-1 hover:shadow-lg"
          >
            <Card
              className={`h-full ${
                program.id === userProgram
                  ? `bg-${program.color}-50 border-${program.color}-200`
                  : ""
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-${program.color}-100`}>
                    {program.icon}
                  </div>
                  <h2 className="ml-4 text-xl font-semibold text-gray-800">
                    {program.name}
                    {program.id === userProgram && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                        Your Program
                      </span>
                    )}
                  </h2>
                </div>
                <p className="text-gray-600 flex-grow">{program.description}</p>
                <div className="mt-4 text-sm text-blue-600 font-medium">
                  Learn more →
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

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
