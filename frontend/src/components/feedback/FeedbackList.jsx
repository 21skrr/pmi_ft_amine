// frontend/src/components/feedback/FeedbackList.jsx
import React, { useState, useEffect } from "react";
import {
  getReceivedFeedback,
  getSentFeedback,
  getDepartmentFeedback,
} from "../../api/feedbackApi";
import FeedbackItem from "./FeedbackItem";
import { useAuth } from "../../context/AuthContext";
import { MessageSquare, Filter, Plus } from "lucide-react";
import Loading from "../common/Loading";
import Button from "../common/Button";
import Modal from "../common/Modal";
import FeedbackForm from "./FeedbackForm";

const FeedbackList = ({ type = "received" }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'onboarding', 'training', 'support', 'general'
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const { user } = useAuth();

  // Check if user can view department feedback
  const canViewDepartmentFeedback =
    user.role === "hr" || user.role === "manager";

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        let fetchedFeedback;

        if (type === "received") {
          fetchedFeedback = await getReceivedFeedback();
        } else if (type === "sent") {
          fetchedFeedback = await getSentFeedback();
        } else if (type === "department" && canViewDepartmentFeedback) {
          fetchedFeedback = await getDepartmentFeedback(user.department);
        }

        setFeedback(fetchedFeedback || []);
        setError(null);
      } catch (err) {
        setError("Failed to load feedback. Please try again later.");
        console.error("Error fetching feedback:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [type, user.department, canViewDepartmentFeedback]);

  const handleFeedbackAdd = (newFeedback) => {
    if (type === "sent") {
      setFeedback([newFeedback, ...feedback]);
    }
    setShowFeedbackForm(false);
  };

  const handleFeedbackDelete = (deletedFeedbackId) => {
    setFeedback(feedback.filter((item) => item.id !== deletedFeedbackId));
  };

  // Filter feedback by type
  const filteredFeedback = feedback.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  // Sort feedback by date (newest first)
  const sortedFeedback = [...filteredFeedback].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (loading) return <Loading message="Loading feedback..." />;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          {type === "received"
            ? "Received Feedback"
            : type === "sent"
            ? "Sent Feedback"
            : "Department Feedback"}
        </h2>

        <div className="flex space-x-2">
          <div className="relative">
            <select
              className="appearance-none px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="onboarding">Onboarding</option>
              <option value="training">Training</option>
              <option value="support">Support</option>
              <option value="general">General</option>
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowFeedbackForm(true)}
          >
            Give Feedback
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 border-l-4 border-red-500">
          {error}
        </div>
      )}

      {sortedFeedback.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p>No feedback found</p>
          {filter !== "all" && (
            <p className="mt-1 text-sm">
              Try changing your filter or submit new feedback
            </p>
          )}
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowFeedbackForm(true)}
          >
            Submit Feedback
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {sortedFeedback.map((feedbackItem) => (
            <FeedbackItem
              key={feedbackItem.id}
              feedback={feedbackItem}
              viewType={type}
              onDelete={handleFeedbackDelete}
            />
          ))}
        </div>
      )}

      {/* Feedback Form Modal */}
      <Modal
        isOpen={showFeedbackForm}
        onClose={() => setShowFeedbackForm(false)}
        title="Submit Feedback"
        size="lg"
      >
        <FeedbackForm
          onSubmit={handleFeedbackAdd}
          onCancel={() => setShowFeedbackForm(false)}
        />
      </Modal>
    </div>
  );
};

export default FeedbackList;
