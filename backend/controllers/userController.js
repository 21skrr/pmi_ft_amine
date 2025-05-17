const { User, OnboardingProgress } = require("../models");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
<<<<<<< HEAD
      attributes: { exclude: ["passwordHash"] },
=======
      attributes: { exclude: ["password"] },
>>>>>>> e45d5af2f3b656e78bbe5d47b3b66f4e245b16ef
      order: [["createdAt", "DESC"]],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
<<<<<<< HEAD
      attributes: { exclude: ["passwordHash"] },
=======
      attributes: { exclude: ["password"] },
>>>>>>> e45d5af2f3b656e78bbe5d47b3b66f4e245b16ef
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has permission to view this user
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this user" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new user (admin only)
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, department, startDate, programType } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
<<<<<<< HEAD
      passwordHash: hashedPassword,
=======
      password: hashedPassword,
>>>>>>> e45d5af2f3b656e78bbe5d47b3b66f4e245b16ef
      role,
      department,
      startDate,
      programType,
    });

    // Remove password from response
    const userResponse = user.toJSON();
<<<<<<< HEAD
    delete userResponse.passwordHash;
=======
    delete userResponse.password;
>>>>>>> e45d5af2f3b656e78bbe5d47b3b66f4e245b16ef

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has permission to update this user
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    const { name, email, password, role, department, startDate, programType } =
      req.body;

    // Update user
    const updateData = {
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
      department: department || user.department,
      startDate: startDate || user.startDate,
      programType: programType || user.programType,
    };

    // Only update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
<<<<<<< HEAD
      updateData.passwordHash = await bcrypt.hash(password, salt);
=======
      updateData.password = await bcrypt.hash(password, salt);
>>>>>>> e45d5af2f3b656e78bbe5d47b3b66f4e245b16ef
    }

    await user.update(updateData);

    // Remove password from response
    const userResponse = user.toJSON();
<<<<<<< HEAD
    delete userResponse.passwordHash;
=======
    delete userResponse.password;
>>>>>>> e45d5af2f3b656e78bbe5d47b3b66f4e245b16ef

    res.json(userResponse);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get team members (supervisor/manager only)
const getTeamMembers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { supervisorId: req.user.id },
<<<<<<< HEAD
      attributes: { exclude: ["passwordHash"] },
=======
      attributes: { exclude: ["password"] },
>>>>>>> e45d5af2f3b656e78bbe5d47b3b66f4e245b16ef
      order: [["name", "ASC"]],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getTeamMembers,
};
