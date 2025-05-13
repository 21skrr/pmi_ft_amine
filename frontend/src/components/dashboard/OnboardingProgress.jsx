// frontend/src/components/dashboard/OnboardingProgress.jsx
import React, { useState, useEffect } from "react";
import { getOnboardingProgress } from "../../api/onboardingApi";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";
import Loading from "../common/Loading";
import Card from "../common/Card";
import Alert from "../common/Alert";
import Button from "../common/Button";

const OnboardingProgress = ({ userId = null }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // If no userId provided, use current user's ID
  const targetUserId = userId || user.id;
  const isHR = user.role === "hr";
  const isSupervisor = user.role === "supervisor";

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await getOnboardingProgress(targetUserId);
        setProgress(data);
        setError(null);
      } catch (err) {
        setError("Failed to load onboarding progress.");
        console.error("Error fetching onboarding progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [targetUserId]);

  if (loading) return <Loading message="Loading onboarding progress..." />;

  if (error) {
    return (
      <Alert
        type="error"
        title="Error Loading Onboarding Progress"
        message={error}
      />
    );
  }

  if (!progress) {
    return (
      <Alert
        type="warning"
        title="No Onboarding Data"
        message="No onboarding progress data found for this user."
      />
    );
  }

  // Calculate stage completion percentage
  const stagePercentage = {
    prepare: 20,
    orient: 40,
    land: 60,
    integrate: 80,
    excel: 100,
  };

  // Get tasks by stage
  const getTasksForStage = (stage) => {
    return progress.tasks[stage] || [];
  };

  // Count completed tasks for stage
  const getCompletedTasksCount = (stage) => {
    const tasks = getTasksForStage(stage);
    return tasks.filter((task) => task.isCompleted).length;
  };

  // Check if stage is current
  const isCurrentStage = (stage) => progress.stage === stage;

  // Check if stage is completed
  const isStageCompleted = (stage) => {
    const stageOrder = ["prepare", "orient", "land", "integrate", "excel"];
    const currentStageIndex = stageOrder.indexOf(progress.stage);
    const checkStageIndex = stageOrder.indexOf(stage);
    return checkStageIndex < currentStageIndex;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Stage names for display
  const stageNames = {
    prepare: "Prepare",
    orient: "Orient",
    land: "Land",
    integrate: "Integrate",
    excel: "Excel",
  };

  // Stage descriptions
  const stageDescriptions = {
    prepare: "Pre-onboarding preparation and document collection",
    orient: "Orientation day and introduction to company",
    land: "Basic training and team integration",
    integrate: "Role-specific training and responsibilities",
    excel: "Performance optimization and career development",
  };

  return (
    <Card
      title="Onboarding Progress"
      titleIcon={<Clock className="h-5 w-5 text-blue-500" />}
    >
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-900">
            Current Stage: {stageNames[progress.stage]}
          </h3>
          <span className="text-sm text-gray-500">
            {progress.progress}% Complete
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progress.progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Start Date: {formatDate(progress.stageStartDate)}</span>
          <span>
            Est. Completion: {formatDate(progress.estimatedCompletionDate)}
          </span>
        </div>
      </div>

      {/* Onboarding pipeline */}
      <div className="mb-6">
        <div className="relative flex items-center">
          {["prepare", "orient", "land", "integrate", "excel"].map(
            (stage, index, arr) => (
              <React.Fragment key={stage}>
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`rounded-full h-10 w-10 flex items-center justify-center ${
                      isStageCompleted(stage)
                        ? "bg-green-100"
                        : isCurrentStage(stage)
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {isStageCompleted(stage) ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : isCurrentStage(stage) ? (
                      <Clock className="h-6 w-6 text-blue-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <span
                    className={`mt-1 text-xs font-medium ${
                      isStageCompleted(stage)
                        ? "text-green-700"
                        : isCurrentStage(stage)
                        ? "text-blue-700"
                        : "text-gray-500"
                    }`}
                  >
                    {stageNames[stage]}
                  </span>
                </div>
                {index < arr.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      isStageCompleted(stage) &&
                      isStageCompleted(arr[index + 1])
                        ? "bg-green-300"
                        : isStageCompleted(stage) &&
                          isCurrentStage(arr[index + 1])
                        ? "bg-blue-300"
                        : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            )
          )}
        </div>
      </div>

      {/* Current stage details */}
      <div className="mb-6">
        <h3 className="text-base font-medium text-gray-900 mb-2">
          Stage Details: {stageNames[progress.stage]}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {stageDescriptions[progress.stage]}
        </p>

        <div className="flex justify-between text-sm mb-2">
          <span>
            Tasks:{" "}
            <span className="font-medium">
              {getCompletedTasksCount(progress.stage)}/
              {getTasksForStage(progress.stage).length}
            </span>{" "}
            completed
          </span>
          <span>
            Estimated time:{" "}
            {progress.stage === "prepare"
              ? "1 day"
              : progress.stage === "orient"
              ? "1 day"
              : progress.stage === "land"
              ? "5 days"
              : progress.stage === "integrate"
              ? "4 days"
              : "30 days"}
          </span>
        </div>
      </div>

      {/* Tasks for current stage */}
      {getTasksForStage(progress.stage).length > 0 && (
        <div className="border rounded-md overflow-hidden mb-4">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h4 className="text-sm font-medium text-gray-700">
              Current Stage Tasks
            </h4>
          </div>
          <div className="divide-y">
            {getTasksForStage(progress.stage).map((task) => (
              <div
                key={task.id}
                className="px-4 py-3 flex items-start hover:bg-gray-50"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {task.isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      task.isCompleted ? "text-gray-500" : "text-gray-900"
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    Due: {formatDate(task.dueDate)}
                    {task.isCompleted && task.completedAt && (
                      <span className="ml-2 text-green-600">
                        Completed: {formatDate(task.completedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions for HR/Supervisor */}
      {(isHR || isSupervisor) && (
        <div className="flex justify-end space-x-3 pt-3 border-t">
          {isHR && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // In a real implementation, open modal to update onboarding progress
                alert("This would open a form to update onboarding progress");
              }}
            >
              Update Progress
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              // In a real implementation, redirect to checklist page
              window.location.href = "/checklists";
            }}
          >
            View Full Checklist
          </Button>
        </div>
      )}
    </Card>
  );
};

export default OnboardingProgress;
