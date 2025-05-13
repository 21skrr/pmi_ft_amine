const { CoachingSession, User } = require("../models");
const { validationResult } = require("express-validator");

// Get coaching sessions for an employee
exports.getEmployeeCoachingSessions = async (req, res) => {
  try {
    const { id } = req.user; // From auth middleware

    const sessions = await CoachingSession.findAll({
      where: { employeeId: id },
      include: [
        {
          model: User,
          as: "supervisor",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["scheduledDate", "DESC"]],
    });

    res.json(sessions);
  } catch (error) {
    console.error("Error fetching coaching sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get coaching sessions as supervisor
exports.getSupervisorCoachingSessions = async (req, res) => {
  try {
    const { id } = req.user; // From auth middleware

    const sessions = await CoachingSession.findAll({
      where: { supervisorId: id },
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "name", "email", "department", "programType"],
        },
      ],
      order: [["scheduledDate", "DESC"]],
    });

    res.json(sessions);
  } catch (error) {
    console.error("Error fetching supervisor coaching sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get coaching session by ID
exports.getCoachingSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await CoachingSession.findByPk(id, {
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "name", "email", "department", "programType"],
        },
        {
          model: User,
          as: "supervisor",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!session) {
      return res.status(404).json({ message: "Coaching session not found" });
    }

    // Check if user is authorized to view this session
    const { id: userId, role } = req.user;

    if (
      session.employeeId !== userId &&
      session.supervisorId !== userId &&
      role !== "hr"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this coaching session" });
    }

    res.json(session);
  } catch (error) {
    console.error("Error fetching coaching session:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new coaching session
exports.createCoachingSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { employeeId, scheduledDate, goal, topicTags } = req.body;

    // Check if user is a supervisor
    const { id: userId, role } = req.user;

    if (role !== "supervisor" && role !== "hr") {
      return res
        .status(403)
        .json({ message: "Not authorized to create coaching sessions" });
    }

    // If supervisor, check if the employee is in their team
    if (role === "supervisor") {
      const employee = await User.findByPk(employeeId);

      if (!employee || employee.supervisorId !== userId) {
        return res
          .status(403)
          .json({ message: "Not authorized to coach this employee" });
      }
    }

    // Create coaching session
    const session = await CoachingSession.create({
      supervisorId: userId,
      employeeId,
      scheduledDate,
      goal,
      status: "scheduled",
      topicTags: topicTags || [],
    });

    // Get created session
    const createdSession = await CoachingSession.findByPk(session.id, {
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "name", "email", "department", "programType"],
        },
        {
          model: User,
          as: "supervisor",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(201).json(createdSession);
  } catch (error) {
    console.error("Error creating coaching session:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update coaching session
exports.updateCoachingSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      scheduledDate,
      actualDate,
      status,
      goal,
      notes,
      outcome,
      topicTags,
    } = req.body;

    // Find coaching session
    const session = await CoachingSession.findByPk(id);

    if (!session) {
      return res.status(404).json({ message: "Coaching session not found" });
    }

    // Check if user is authorized to update this session
    const { id: userId, role } = req.user;

    if (role !== "hr" && session.supervisorId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this coaching session" });
    }

    // Update session
    const updateData = {};

    if (scheduledDate) {
      updateData.scheduledDate = scheduledDate;
    }

    if (actualDate) {
      updateData.actualDate = actualDate;
    }

    if (status) {
      updateData.status = status;
    }

    if (goal !== undefined) {
      updateData.goal = goal;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (outcome !== undefined) {
      updateData.outcome = outcome;
    }

    if (topicTags) {
      updateData.topicTags = topicTags;
    }

    await session.update(updateData);

    // Get updated session
    const updatedSession = await CoachingSession.findByPk(id, {
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "name", "email", "department", "programType"],
        },
        {
          model: User,
          as: "supervisor",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json(updatedSession);
  } catch (error) {
    console.error("Error updating coaching session:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete coaching session
exports.deleteCoachingSession = async (req, res) => {
  try {
    const { id } = req.params;

    // Find coaching session
    const session = await CoachingSession.findByPk(id);

    if (!session) {
      return res.status(404).json({ message: "Coaching session not found" });
    }

    // Check if user is authorized to delete this session
    const { id: userId, role } = req.user;

    if (role !== "hr" && session.supervisorId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this coaching session" });
    }

    // Delete session
    await session.destroy();

    res.json({ message: "Coaching session deleted successfully" });
  } catch (error) {
    console.error("Error deleting coaching session:", error);
    res.status(500).json({ message: "Server error" });
  }
};
