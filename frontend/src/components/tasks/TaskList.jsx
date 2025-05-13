// frontend/src/components/tasks/TaskList.jsx
import React, { useState, useEffect } from "react";
import { getUserTasks } from "../../api/taskApi";
import TaskItem from "./TaskItem";
import { useAuth } from "../../context/AuthContext";
import { Clock, CheckSquare, Filter, Plus } from "lucide-react";
import Loading from "../common/Loading";
import Button from "../common/Button";
import TaskForm from "./TaskForm";

const TaskList = ({ employeeId, showAddButton = true }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'completed', 'pending'
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        let fetchedTasks;

        if (employeeId) {
          // If employeeId is provided, fetch tasks for that employee
          // This path is for supervisors/managers/HR viewing employee tasks
          const { getEmployeeTasks } = require("../../api/taskApi");
          fetchedTasks = await getEmployeeTasks(employeeId);
        } else {
          // Otherwise, fetch current user's tasks
          fetchedTasks = await getUserTasks();
        }

        setTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        setError("Failed to load tasks. Please try again later.");
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [employeeId]);

  const handleTaskUpdate = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleTaskDelete = (deletedTaskId) => {
    setTasks(tasks.filter((task) => task.id !== deletedTaskId));
  };

  const handleTaskAdd = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.isCompleted;
    if (filter === "pending") return !task.isCompleted;
    return true;
  });

  // Sort tasks by due date (closest first) and priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by completion status
    if (a.isCompleted && !b.isCompleted) return 1;
    if (!a.isCompleted && b.isCompleted) return -1;

    // Then sort by due date
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;

    // Then sort by priority
    const priorityValue = { high: 3, medium: 2, low: 1 };
    return priorityValue[b.priority] - priorityValue[a.priority];
  });

  if (loading) return <Loading message="Loading tasks..." />;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <CheckSquare className="h-5 w-5 mr-2 text-blue-500" />
          Tasks
        </h2>

        <div className="flex space-x-2">
          <div className="relative">
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={() =>
                setFilter(
                  filter === "all"
                    ? "pending"
                    : filter === "pending"
                    ? "completed"
                    : "all"
                )
              }
            >
              <Filter className="h-4 w-4 mr-1" />
              {filter === "all"
                ? "All"
                : filter === "pending"
                ? "Pending"
                : "Completed"}
            </button>
          </div>

          {showAddButton &&
            (user.role === "hr" ||
              user.role === "supervisor" ||
              user.role === "manager") && (
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setShowTaskForm(true)}
              >
                Add Task
              </Button>
            )}
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 border-l-4 border-red-500">
          {error}
        </div>
      )}

      {showTaskForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <TaskForm
            onSubmit={handleTaskAdd}
            onCancel={() => setShowTaskForm(false)}
            employeeId={employeeId}
          />
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {sortedTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CheckSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p>No tasks found</p>
            {filter !== "all" && (
              <p className="mt-1 text-sm">
                Try changing your filter or add new tasks
              </p>
            )}
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={handleTaskUpdate}
              onDelete={handleTaskDelete}
            />
          ))
        )}
      </div>

      {tasks.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500 flex justify-between items-center">
          <div>
            <span className="font-medium">
              {tasks.filter((t) => t.isCompleted).length}
            </span>{" "}
            of <span className="font-medium">{tasks.length}</span> tasks
            completed
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            {tasks.filter((t) => !t.isCompleted).length > 0 ? (
              <span>
                Next due:{" "}
                {new Date(
                  Math.min(
                    ...tasks
                      .filter((t) => !t.isCompleted)
                      .map((t) => new Date(t.dueDate).getTime())
                  )
                ).toLocaleDateString()}
              </span>
            ) : (
              <span>All tasks completed</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
