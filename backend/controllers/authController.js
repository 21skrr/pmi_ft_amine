// controllers/authController.js
const jwt = require("jsonwebtoken");
const { User, OnboardingProgress } = require("../models");
const { validationResult } = require("express-validator");

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: OnboardingProgress,
          attributes: ["stage", "progress"],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user info and token
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        startDate: user.startDate,
        programType: user.programType,
        onboardingStage: user.OnboardingProgress
          ? user.OnboardingProgress.stage
          : null,
        onboardingProgress: user.OnboardingProgress
          ? user.OnboardingProgress.progress
          : 0,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/userController.js
const { User, OnboardingProgress } = require("../models");
const { validationResult } = require("express-validator");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["passwordHash"] },
      include: [
        {
          model: OnboardingProgress,
          attributes: ["stage", "progress"],
        },
      ],
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["passwordHash"] },
      include: [
        {
          model: OnboardingProgress,
          attributes: [
            "stage",
            "progress",
            "stageStartDate",
            "estimatedCompletionDate",
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new user (for HR)
exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      password,
      role,
      department,
      startDate,
      programType,
      supervisorId,
    } = req.body;

    // Check if email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash: password, // Will be hashed by the model hook
      role,
      department,
      startDate,
      programType,
      supervisorId,
    });

    // Create onboarding progress record if role is employee
    if (role === "employee") {
      await OnboardingProgress.create({
        userId: user.id,
        stage: "prepare",
        progress: 0,
        stageStartDate: new Date(),
        estimatedCompletionDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ), // 30 days from now
      });
    }

    // Return created user
    const newUser = await User.findByPk(user.id, {
      attributes: { exclude: ["passwordHash"] },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      name,
      email,
      role,
      department,
      startDate,
      programType,
      supervisorId,
    } = req.body;

    // Find user
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already in use by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    // Update user
    await user.update({
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
      department: department || user.department,
      startDate: startDate || user.startDate,
      programType: programType || user.programType,
      supervisorId: supervisorId || user.supervisorId,
    });

    // Return updated user
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["passwordHash"] },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get team members (for supervisors and managers)
exports.getTeamMembers = async (req, res) => {
  try {
    const { id } = req.user; // From auth middleware

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "supervisor" && user.role !== "manager") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get direct subordinates for supervisor
    // Or all employees for manager
    let teamMembers;

    if (user.role === "supervisor") {
      teamMembers = await User.findAll({
        where: { supervisorId: id },
        attributes: { exclude: ["passwordHash"] },
        include: [
          {
            model: OnboardingProgress,
            attributes: ["stage", "progress"],
          },
        ],
      });
    } else {
      // For managers, get all employees in their department
      teamMembers = await User.findAll({
        where: { department: user.department, role: "employee" },
        attributes: { exclude: ["passwordHash"] },
        include: [
          {
            model: OnboardingProgress,
            attributes: ["stage", "progress"],
          },
        ],
      });
    }

    res.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current password is correct
    const isPasswordValid = await user.validatePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    await user.update({ passwordHash: newPassword }); // Will be hashed by the model hook

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/taskController.js
const { Task, User } = require("../models");
const { validationResult } = require("express-validator");

// Get all tasks for a user
exports.getUserTasks = async (req, res) => {
  try {
    const { id } = req.user; // From auth middleware

    const tasks = await Task.findAll({
      where: { userId: id },
      order: [["dueDate", "ASC"]],
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
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

// Create new task
exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      userId,
      title,
      description,
      dueDate,
      priority,
      onboardingStage,
      controlledBy,
    } = req.body;

    // Create task
    const task = await Task.create({
      userId,
      title,
      description,
      dueDate,
      isCompleted: false,
      priority,
      onboardingStage,
      controlledBy,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      title,
      description,
      dueDate,
      isCompleted,
      priority,
      onboardingStage,
    } = req.body;

    // Find task
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is authorized to update this task
    const user = await User.findByPk(req.user.id);

    // Only HR can update task status if controlledBy is HR
    if (
      task.controlledBy === "hr" &&
      user.role !== "hr" &&
      "isCompleted" in req.body
    ) {
      return res
        .status(403)
        .json({
          message: "Only HR can update the completion status of this task",
        });
    }

    // Update task
    const updateData = {
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      dueDate: dueDate || task.dueDate,
      priority: priority || task.priority,
      onboardingStage: onboardingStage || task.onboardingStage,
    };

    // Only update completion status if explicitly included
    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted;

      // If task is being marked as completed, set completedAt
      if (isCompleted && !task.isCompleted) {
        updateData.completedAt = new Date();
      } else if (!isCompleted && task.isCompleted) {
        updateData.completedAt = null;
      }
    }

    await task.update(updateData);

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is authorized to delete this task
    const user = await User.findByPk(req.user.id);

    // Only HR or the creator can delete tasks
    if (user.role !== "hr" && task.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    // Delete task
    await task.destroy();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get employee tasks for supervisor
exports.getEmployeeTasks = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { id, role } = req.user; // From auth middleware

    // Check if user is authorized to view employee tasks
    if (role !== "supervisor" && role !== "manager" && role !== "hr") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // If supervisor, check if the employee is in their team
    if (role === "supervisor") {
      const employee = await User.findByPk(employeeId);

      if (!employee || employee.supervisorId !== id) {
        return res
          .status(403)
          .json({ message: "Not authorized to view this employee's tasks" });
      }
    }

    // Get tasks
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
