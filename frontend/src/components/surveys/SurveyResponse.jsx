import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Mock survey data
const mockSurvey = {
  id: 1,
  title: "New Employee Onboarding Survey",
  description: "Please provide your feedback on the onboarding process.",
  questions: [
    {
      id: 1,
      type: "text",
      question: "What aspects of the onboarding process were most helpful?",
      required: true,
    },
    {
      id: 2,
      type: "multiple_choice",
      question: "How would you rate the overall onboarding experience?",
      required: true,
      options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
    },
    {
      id: 3,
      type: "rating",
      question:
        "How well were your questions answered during the onboarding process?",
      required: true,
      maxRating: 5,
    },
  ],
};

const SurveyResponse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    // Clear error when user provides a response
    if (errors[questionId]) {
      setErrors((prev) => ({
        ...prev,
        [questionId]: null,
      }));
    }
  };

  const validateResponses = () => {
    const newErrors = {};
    mockSurvey.questions.forEach((question) => {
      if (question.required && !responses[question.id]) {
        newErrors[question.id] = "This question is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateResponses()) {
      // TODO: Implement survey submission
      console.log("Survey responses:", responses);
      navigate("/surveys");
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "text":
        return (
          <textarea
            value={responses[question.id] || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows={3}
          />
        );

      case "multiple_choice":
        return (
          <div className="mt-2 space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`${question.id}-${index}`}
                  name={`question-${question.id}`}
                  value={option}
                  checked={responses[question.id] === option}
                  onChange={(e) =>
                    handleResponseChange(question.id, e.target.value)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor={`${question.id}-${index}`}
                  className="ml-3 block text-sm text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "rating":
        return (
          <div className="mt-2 flex items-center space-x-2">
            {[...Array(question.maxRating)].map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleResponseChange(question.id, index + 1)}
                className={`p-2 rounded-full ${
                  responses[question.id] === index + 1
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
        <button
          onClick={() => navigate("/surveys")}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Surveys
        </button>

        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {mockSurvey.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{mockSurvey.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {mockSurvey.questions.map((question) => (
            <div
              key={question.id}
              className="bg-white shadow sm:rounded-lg p-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {question.question}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {renderQuestion(question)}
                {errors[question.id] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[question.id]}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Survey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyResponse;
