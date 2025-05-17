// frontend/src/pages/Evaluations.jsx
import React from "react";
import EvaluationList from "../components/evaluations/EvaluationList";
import { useAuth } from "../context/AuthContext";
import { ClipboardCheck } from "lucide-react";

const Evaluations = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <ClipboardCheck className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Evaluations</h1>
        </div>
        <p className="text-gray-600">
          {user.role === "employee"
            ? "View your performance evaluations and feedback from your supervisor."
            : user.role === "supervisor"
            ? "Manage and complete evaluations for your team members."
            : user.role === "manager"
            ? "Review evaluations and provide feedback."
            : "Manage the evaluation process and monitor employee progress."}
        </p>
      </div>

      {/* Show appropriate evaluation list based on user role */}
      {user.role === "employee" ? (
        <EvaluationList type="user" />
      ) : user.role === "supervisor" ? (
        <div className="space-y-6">
          <EvaluationList type="supervisor" />
          <EvaluationList type="user" />
        </div>
      ) : user.role === "manager" ? (
        <div className="space-y-6">
          <EvaluationList type="review" />
          <EvaluationList type="user" />
        </div>
      ) : user.role === "hr" ? (
        <div className="space-y-6">
          <EvaluationList type="review" />
          <EvaluationList type="supervisor" />
        </div>
      ) : (
        <EvaluationList type="user" />
      )}
    </div>
  );
};

export default Evaluations;
