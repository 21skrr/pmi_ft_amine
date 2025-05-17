import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, AlertCircle } from "lucide-react";
import Button from "../common/Button";
import Card from "../common/Card";
import Alert from "../common/Alert";
import Loading from "../common/Loading";

const SurveyResponse = ({ survey, onSubmit }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState(
    survey.questions.reduce(
      (acc, question) => ({
        ...acc,
        [question.id]: question.type === "multiple-choice" ? [] : "",
      }),
      {}
    )
  );

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleMultipleChoiceChange = (questionId, option) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: prev[questionId].includes(option)
        ? prev[questionId].filter((item) => item !== option)
        : [...prev[questionId], option],
    }));
  };

  const handleRatingChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const validateResponses = () => {
    const requiredQuestions = survey.questions.filter((q) => q.required);
    const missingResponses = requiredQuestions.filter((q) => {
      const response = responses[q.id];
      return !response || (Array.isArray(response) && response.length === 0);
    });

    if (missingResponses.length > 0) {
      setError("Please answer all required questions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateResponses()) return;

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        surveyId: survey.id,
        responses,
      });
      navigate("/surveys");
    } catch (err) {
      setError("Failed to submit survey response. Please try again.");
      console.error("Error submitting survey:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Submitting survey..." />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert type="error" title="Error" message={error} className="mb-4" />
      )}

      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {survey.title}
          </h2>
          <p className="text-gray-600">{survey.description}</p>
        </div>
      </Card>

      <div className="space-y-6">
        {survey.questions.map((question, index) => (
          <Card key={question.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-gray-900 font-medium">
                  {index + 1}. {question.text}
                </span>
                {question.required && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </div>

              {question.type === "text" && (
                <textarea
                  value={responses[question.id]}
                  onChange={(e) =>
                    handleResponseChange(question.id, e.target.value)
                  }
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your response..."
                />
              )}

              {question.type === "multiple-choice" && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={responses[question.id].includes(option)}
                        onChange={() =>
                          handleMultipleChoiceChange(question.id, option)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === "rating" && (
                <div className="flex items-center space-x-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingChange(question.id, rating)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        responses[question.id] === rating
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/surveys")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={<Save className="h-4 w-4" />}
        >
          Submit Response
        </Button>
      </div>
    </form>
  );
};

export default SurveyResponse;
