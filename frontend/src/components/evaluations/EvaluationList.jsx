// frontend/src/components/evaluations/EvaluationList.jsx
import React, { useState, useEffect } from "react";
import {
  getUserEvaluations,
  getSupervisorEvaluations,
  getReviewEvaluations,
} from "../../api/evaluationApi";
import EvaluationItem from "./EvaluationItem";
import { useAuth } from "../../context/AuthContext";
import { ClipboardCheck, Filter, Plus } from "lucide-react";
import Loading from "../common/Loading";
import Button from "../common/Button";
import Modal from "../common/Modal";
import EvaluationForm from "./EvaluationForm";
import Alert from "../common/Alert";

const EvaluationList = ({ type = "user" }) => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'in_progress', 'completed'
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const { user } = useAuth();

  // Determine if user can create evaluations
  const canCreateEvaluation =
    user.role === "hr" || user.role === "supervisor" || user.role === "manager";

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
        let fetchedEvaluations;

        if (type === "user") {
          fetchedEvaluations = await getUserEvaluations();
        } else if (
          type === "supervisor" &&
          (user.role === "supervisor" || user.role === "hr")
        ) {
          fetchedEvaluations = await getSupervisorEvaluations();
        } else if (
          type === "review" &&
          (user.role === "manager" || user.role === "hr")
        ) {
          fetchedEvaluations = await getReviewEvaluations();
        }

        setEvaluations(fetchedEvaluations || []);
        setError(null);
      } catch (err) {
        setError("Failed to load evaluations. Please try again later.");
        console.error("Error fetching evaluations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [type, user.role]);

  const handleEvaluationAdd = (newEvaluation) => {
    setEvaluations([...evaluations, newEvaluation]);
    setShowEvaluationForm(false);
  };

  const handleEvaluationUpdate = (updatedEvaluation) => {
    setEvaluations(
      evaluations.map((e) =>
        e.id === updatedEvaluation.id ? updatedEvaluation : e
      )
    );
  };

  const handleEvaluationDelete = (deletedEvaluationId) => {
    setEvaluations(evaluations.filter((e) => e.id !== deletedEvaluationId));
  };

  // Filter evaluations by status
  const filteredEvaluations = evaluations.filter((e) => {
    if (filter === "all") return true;
    return eval.status === filter;
  });

  // Sort evaluations by due date (closest first)
  const sortedEvaluations = [...filteredEvaluations].sort((a, b) => {
    // Pending evaluations first
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;

    // Then by due date
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  if (loading) return <Loading message="Loading evaluations..." />;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <ClipboardCheck className="h-5 w-5 mr-2 text-blue-500" />
          {type === "user"
            ? "Your Evaluations"
            : type === "supervisor"
            ? "Evaluations to Complete"
            : "Evaluations to Review"}
        </h2>

        <div className="flex space-x-2">
          <div className="relative">
            <select
              className="appearance-none px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {canCreateEvaluation && type === "supervisor" && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setShowEvaluationForm(true)}
            >
              Create Evaluation
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          title="Error Loading Evaluations"
          message={error}
          className="m-4"
        />
      )}

      {sortedEvaluations.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <ClipboardCheck className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p>No evaluations found</p>
          {filter !== "all" && (
            <p className="mt-1 text-sm">Try changing your filter</p>
          )}
          {canCreateEvaluation && type === "supervisor" && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowEvaluationForm(true)}
            >
              Create Your First Evaluation
            </Button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {sortedEvaluations.map((evaluation) => (
            <EvaluationItem
              key={evaluation.id}
              evaluation={evaluation}
              viewType={type}
              onUpdate={handleEvaluationUpdate}
              onDelete={handleEvaluationDelete}
            />
          ))}
        </div>
      )}

      {/* Evaluation Form Modal */}
      <Modal
        isOpen={showEvaluationForm}
        onClose={() => setShowEvaluationForm(false)}
        title="Create Evaluation"
        size="lg"
      >
        <EvaluationForm
          onSubmit={handleEvaluationAdd}
          onCancel={() => setShowEvaluationForm(false)}
        />
      </Modal>
    </div>
  );
};

export default EvaluationList;
