// frontend/src/pages/Feedback.jsx
import React, { useState } from "react";
import FeedbackList from "../components/feedback/FeedbackList";
import FeedbackForm from "../components/feedback/FeedbackForm";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Plus } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";

const Feedback = () => {
  const { user } = useAuth();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [activeTab, setActiveTab] = useState("received");

  const handleFeedbackAdd = () => {
    setShowFeedbackForm(false);
    // If user is viewing sent feedback, switch to that tab after submission
    if (activeTab !== "sent") {
      setActiveTab("sent");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Feedback</h1>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Share your thoughts and receive feedback on your onboarding
            experience.
          </p>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-4 w-4 mr-1" />}
            onClick={() => setShowFeedbackForm(true)}
          >
            Give Feedback
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                activeTab === "received"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("received")}
            >
              Received
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                activeTab === "sent"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("sent")}
            >
              Sent
            </button>
            {(user.role === "hr" || user.role === "manager") && (
              <button
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === "department"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("department")}
              >
                Department
              </button>
            )}
          </nav>
        </div>

        <div className="p-4">
          {activeTab === "received" && <FeedbackList type="received" />}
          {activeTab === "sent" && <FeedbackList type="sent" />}
          {activeTab === "department" && <FeedbackList type="department" />}
        </div>
      </div>

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

export default Feedback;
