const { Task, User } = require("../models");
const { validationResult } = require("express-validator");

// Get user's tasks
const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [["dueDate", "ASC"]],
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create task
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      dueDate,
      priority,
      onboardingStage,
      controlledBy,
    } = req.body;
    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      dueDate,
      priority,
      onboardingStage,
      controlledBy,
      isCompleted: false,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const {
      title,
      description,
      dueDate,
      priority,
      onboardingStage,
      controlledBy,
      isCompleted,
    } = req.body;
    await task.update({
      title: title || task.title,
      description: description || task.description,
      dueDate: dueDate || task.dueDate,
      priority: priority || task.priority,
      onboardingStage: onboardingStage || task.onboardingStage,
      controlledBy: controlledBy || task.controlledBy,
      isCompleted: isCompleted !== undefined ? isCompleted : task.isCompleted,
    });

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.destroy();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get employee tasks (for supervisors/managers/HR)
const getEmployeeTasks = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Check if employee exists
    const employee = await User.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if user has permission to view employee's tasks
    if (
      req.user.role === "supervisor" &&
      employee.supervisorId !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this employee's tasks" });
    }

    const tasks = await Task.findAll({
      where: { userId: employeeId },
      order: [["dueDate", "ASC"]],
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching employee tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getEmployeeTasks,
};
