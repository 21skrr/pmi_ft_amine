const { Feedback, User } = require("../models");
const { validationResult } = require("express-validator");

// Get user's received feedback
exports.getReceivedFeedback = async (req, res) => {
  try {
    const { id } = req.user; // From auth middleware

    const feedback = await Feedback.findAll({
      where: {
        toUserId: id,
        isAnonymous: false,
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Also get anonymous feedback
    const anonymousFeedback = await Feedback.findAll({
      where: {
        toUserId: id,
        isAnonymous: true,
      },
      attributes: { exclude: ["fromUserId"] },
      order: [["createdAt", "DESC"]],
    });

    res.json([...feedback, ...anonymousFeedback]);
  } catch (error) {
    console.error("Error fetching received feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's sent feedback
exports.getSentFeedback = async (req, res) => {
  try {
    const { id } = req.user; // From auth middleware

    const feedback = await Feedback.findAll({
      where: { fromUserId: id },
      include: [
        {
          model: User,
          as: "recipient",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(feedback);
  } catch (error) {
    console.error("Error fetching sent feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get department feedback
exports.getDepartmentFeedback = async (req, res) => {
  try {
    const { role } = req.user; // From auth middleware

    // Only HR and managers can view department feedback
    if (role !== "hr" && role !== "manager") {
      return res
        .status(403)
        .json({ message: "Not authorized to view department feedback" });
    }

    // For managers, get their department
    let departmentFilter = {};

    if (role === "manager") {
      const user = await User.findByPk(req.user.id);
      departmentFilter = { toDepartment: user.department };
    }

    const feedback = await Feedback.findAll({
      where: {
        ...departmentFilter,
        toUserId: null, // Department feedback has no specific user
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(feedback);
  } catch (error) {
    console.error("Error fetching department feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new feedback
exports.createFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { toUserId, toDepartment, type, message, isAnonymous } = req.body;

    // Validate that either toUserId or toDepartment is provided, but not both
    if ((toUserId && toDepartment) || (!toUserId && !toDepartment)) {
      return res
        .status(400)
        .json({
          message: "Provide either a user or a department as recipient",
        });
    }

    // If sending to a user, check if user exists
    if (toUserId) {
      const recipientUser = await User.findByPk(toUserId);

      if (!recipientUser) {
        return res.status(404).json({ message: "Recipient user not found" });
      }
    }

    // Create feedback
    const feedback = await Feedback.create({
      fromUserId: req.user.id,
      toUserId,
      toDepartment,
      type,
      message,
      isAnonymous: isAnonymous || false,
    });

    // Get created feedback
    let createdFeedback;

    if (feedback.isAnonymous) {
      createdFeedback = await Feedback.findByPk(feedback.id, {
        attributes: { exclude: ["fromUserId"] },
      });
    } else {
      createdFeedback = await Feedback.findByPk(feedback.id, {
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "name", "email", "role"],
          },
          {
            model: User,
            as: "recipient",
            attributes: ["id", "name", "email", "role"],
          },
        ],
      });
    }

    res.status(201).json(createdFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    // Find feedback
    const feedback = await Feedback.findByPk(id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Check if user is authorized to delete this feedback
    const { id: userId, role } = req.user;

    if (role !== "hr" && feedback.fromUserId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this feedback" });
    }

    // Delete feedback
    await feedback.destroy();

    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};
