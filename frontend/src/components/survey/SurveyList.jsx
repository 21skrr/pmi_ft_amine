// frontend/src/components/surveys/SurveyList.jsx
import React, { useState, useEffect } from "react";
import { getAllSurveys, getUserSurveys } from "../../api/surveyApi";
import { useAuth } from "../../context/AuthContext";
import {
  ClipboardCheck,
  Filter,
  Clock,
  Plus,
  ExternalLink,
  CheckCircle,
  BarChart2,
  Edit2,
  Trash2,
} from "lucide-react";
import Loading from "../common/Loading";
import Button from "../common/Button";
import Card from "../common/Card";
import Alert from "../common/Alert";
import Modal from "../common/Modal";
import SurveyForm from "./SurveyForm";
import { Link } from "react-router-dom";

const SurveyList = ({ isAdmin = false }) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed', 'draft'
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        let fetchedSurveys;

        if (isAdmin && user.role === "hr") {
          fetchedSurveys = await getAllSurveys();
        } else {
          fetchedSurveys = await getUserSurveys();
        }

        setSurveys(fetchedSurveys);
        setError(null);
      } catch (err) {
        setError("Failed to load surveys. Please try again later.");
        console.error("Error fetching surveys:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [isAdmin, user.role]);

  const handleSurveyAdd = (newSurvey) => {
    setSurveys([...surveys, newSurvey]);
    setShowSurveyForm(false);
  };

  const handleSurveyDelete = (deletedSurveyId) => {
    setSurveys(surveys.filter((survey) => survey.id !== deletedSurveyId));
  };

  // Filter surveys
  const filteredSurveys = surveys.filter((survey) => {
    if (filter === "all") return true;
    if (filter === "active") return survey.status === "active";
    if (filter === "completed") return survey.status === "completed";
    if (filter === "draft") return survey.status === "draft";
    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysLeft = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSurveyTypeLabel = (type) => {
    switch (type) {
      case "3-month":
        return "3-Month Review";
      case "6-month":
        return "6-Month Review";
      case "12-month":
        return "Annual Review";
      case "training":
        return "Training Feedback";
      case "general":
        return "General Feedback";
      default:
        return type;
    }
  };

  if (loading) return <Loading message="Loading surveys..." />;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <ClipboardCheck className="h-5 w-5 mr-2 text-blue-500" />
          {isAdmin ? "Manage Surveys" : "Surveys & Feedback Forms"}
        </h2>

        <div className="flex space-x-2">
          <div className="relative">
            <select
              className="appearance-none px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Surveys</option>
              <option value="active">Active</option>
              <option value="draft">Drafts</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {isAdmin && user.role === "hr" && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setShowSurveyForm(true)}
            >
              Create Survey
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          title="Error Loading Surveys"
          message={error}
          className="m-4"
        />
      )}

      <div className="divide-y divide-gray-200">
        {filteredSurveys.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ClipboardCheck className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p>No surveys found</p>
            {filter !== "all" && (
              <p className="mt-1 text-sm">Try changing your filter</p>
            )}
            {isAdmin && user.role === "hr" && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowSurveyForm(true)}
              >
                Create Your First Survey
              </Button>
            )}
          </div>
        ) : (
          filteredSurveys.map((survey) => (
            <div key={survey.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {survey.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        survey.status === "active"
                          ? "bg-green-100 text-green-800"
                          : survey.status === "draft"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {survey.status.charAt(0).toUpperCase() +
                        survey.status.slice(1)}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
                      {getSurveyTypeLabel(survey.type)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {survey.description || "No description provided"}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    {survey.dueDate && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          Due: {formatDate(survey.dueDate)}
                          {getDaysLeft(survey.dueDate) !== null && (
                            <span
                              className={`ml-1 ${
                                getDaysLeft(survey.dueDate) < 0
                                  ? "text-red-500"
                                  : getDaysLeft(survey.dueDate) <= 3
                                  ? "text-yellow-500"
                                  : "text-gray-500"
                              }`}
                            >
                              {getDaysLeft(survey.dueDate) < 0
                                ? `(Overdue by ${Math.abs(
                                    getDaysLeft(survey.dueDate)
                                  )} days)`
                                : getDaysLeft(survey.dueDate) === 0
                                ? `(Due today)`
                                : `(${getDaysLeft(survey.dueDate)} days left)`}
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {survey.targetRole && (
                      <div className="flex items-center">
                        <span>
                          For:{" "}
                          {survey.targetRole === "all"
                            ? "All Roles"
                            : survey.targetRole.charAt(0).toUpperCase() +
                              survey.targetRole.slice(1) + "s"}
                        </span>
                      </div>
                    )}

                    {survey.targetProgram && (
                      <div className="flex items-center">
                        <span>
                          Program:{" "}
                          {survey.targetProgram === "all"
                            ? "All Programs"
                            : survey.targetProgram === "inkompass"
                            ? "Inkompass"
                            : survey.targetProgram === "earlyTalent"
                            ? "Early Talent"
                            : survey.targetProgram === "apprenticeship"
                            ? "Apprenticeship"
                            : survey.targetProgram === "academicPlacement"
                            ? "Academic Placement"
                            : survey.targetProgram === "workExperience"
                            ? "Work Experience"
                            : survey.targetProgram}
                        </span>
                      </div>
                    )}

                    {isAdmin && survey.creator && (