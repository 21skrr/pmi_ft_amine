import React from "react";
import Card from "../common/Card";
import { Calendar, CheckCircle, BookOpen, ClipboardList } from "lucide-react";

// Helper: Render onboarding journey
const OnboardingJourney = ({ onboardingProgress }) => {
  const phases = ["PREPARE", "ORIENT", "LAND", "INTEGRATE", "EXCEL"];
  const phaseNames = {
    PREPARE: "Prepare",
    ORIENT: "Orient",
    LAND: "Land",
    INTEGRATE: "Integrate",
    EXCEL: "Excel",
  };
  const currentPhase = onboardingProgress?.progress?.[0]?.phase || phases[0];
  return (
    <Card
      title="Onboarding Journey"
      titleIcon={<ClipboardList className="h-5 w-5 text-blue-500" />}
    >
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          {phases.map((phase, idx) => (
            <div key={phase} className="flex-1 flex flex-col items-center">
              <div
                className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 ${
                  phase === currentPhase
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>
              <span className="text-xs font-medium">{phaseNames[phase]}</span>
            </div>
          ))}
        </div>
        {/* Progress bar line */}
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{
              width: `${
                ((phases.indexOf(currentPhase) + 1) / phases.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>
      {/* Tasks for current phase */}
      <div className="mt-4">
        <h4 className="font-semibold mb-2">
          Tasks in {phaseNames[currentPhase]}
        </h4>
        <ul className="divide-y divide-gray-200">
          {onboardingProgress?.progress
            ?.find((p) => p.phase === currentPhase)
            ?.tasks?.map((task, idx) => (
              <li key={idx} className="py-2 flex items-center justify-between">
                <span>{task.name}</span>
                <span>
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <span className="text-gray-400">Incomplete</span>
                  )}
                </span>
              </li>
            )) || <li className="py-2 text-gray-400">No tasks found.</li>}
        </ul>
      </div>
    </Card>
  );
};

const EmployeeDashboard = ({ employee }) => {
  // Mock/fallback data for events, surveys, learning
  const events = employee?.events || [
    { title: "Orientation Day", date: "2024-07-10", type: "Orientation" },
    { title: "Coaching Session", date: "2024-07-15", type: "Coaching" },
    { title: "Team Lunch", date: "2024-07-20", type: "Team Activity" },
  ];
  const surveys = employee?.surveys || [
    { type: "3-Month Feedback", due: "2024-10-10" },
    { type: "6-Month Feedback", due: "2025-01-10" },
    { type: "12-Month Feedback", due: "2025-07-10" },
  ];
  const learning = employee?.learning || [
    { title: "Welcome to the Company", type: "Course" },
    { title: "Effective Communication", type: "Suggested Reading" },
    { title: "Time Management", type: "Optional Training" },
  ];
  // Tasks: flatten all tasks from onboardingProgress
  const tasks =
    employee?.onboardingProgress?.progress?.flatMap((phase) =>
      phase.tasks.map((t) => ({ ...t, phase: phase.phase }))
    ) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Onboarding Journey */}
      <div className="md:col-span-2">
        <OnboardingJourney onboardingProgress={employee?.onboardingProgress} />
      </div>

      {/* Upcoming Events */}
      <Card
        title="Upcoming Events"
        titleIcon={<Calendar className="h-5 w-5 text-blue-500" />}
      >
        <ul className="divide-y divide-gray-200">
          {events.map((event, idx) => (
            <li key={idx} className="py-2 flex items-center justify-between">
              <span>{event.title}</span>
              <span className="text-sm text-gray-500">
                {event.date} ({event.type})
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Tasks */}
      <Card
        title="Your Tasks"
        titleIcon={<ClipboardList className="h-5 w-5 text-blue-500" />}
      >
        <ul className="divide-y divide-gray-200">
          {tasks.map((task, idx) => (
            <li key={idx} className="py-2 flex items-center justify-between">
              <span>
                {task.name}{" "}
                <span className="text-xs text-gray-400">({task.phase})</span>
              </span>
              <span>
                {task.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-gray-400">Incomplete</span>
                )}
              </span>
            </li>
          )) || <li className="py-2 text-gray-400">No tasks found.</li>}
        </ul>
      </Card>

      {/* Upcoming Surveys */}
      <Card
        title="Upcoming Surveys"
        titleIcon={<ClipboardList className="h-5 w-5 text-blue-500" />}
      >
        <ul className="divide-y divide-gray-200">
          {surveys.map((survey, idx) => (
            <li key={idx} className="py-2 flex items-center justify-between">
              <span>{survey.type}</span>
              <span className="text-sm text-gray-500">Due: {survey.due}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Learning & Development */}
      <Card
        title="Learning & Development"
        titleIcon={<BookOpen className="h-5 w-5 text-blue-500" />}
      >
        <ul className="divide-y divide-gray-200">
          {learning.map((item, idx) => (
            <li key={idx} className="py-2 flex items-center justify-between">
              <span>{item.title}</span>
              <span className="text-sm text-gray-500">{item.type}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
