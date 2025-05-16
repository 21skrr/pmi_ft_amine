const { OnboardingProgress, User, Task } = require("../models");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

// Get onboarding progress for a user
const getOnboardingProgress = async (req, res) => {
  try {
    const progress = await OnboardingProgress.findOne({
      where: { userId: req.params.id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role", "department"],
        },
      ],
    });

    if (!progress) {
      return res.status(404).json({ message: "Onboarding progress not found" });
    }

    // Check if user has permission to view this progress
    if (req.user.role !== "hr" && req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this progress" });
    }

    // Get tasks for each onboarding stage
    const tasks = await Task.findAll({
      where: {
        userId: req.params.id,
        onboardingStage: {
          [Op.ne]: null,
        },
      },
    });

    // Group tasks by stage
    const tasksByStage = {
      prepare: tasks.filter((task) => task.onboardingStage === "prepare"),
      orient: tasks.filter((task) => task.onboardingStage === "orient"),
      land: tasks.filter((task) => task.onboardingStage === "land"),
      integrate: tasks.filter((task) => task.onboardingStage === "integrate"),
      excel: tasks.filter((task) => task.onboardingStage === "excel"),
    };

    // Add tasks to the response
    const result = progress.toJSON();
    result.tasks = tasksByStage;

    res.json(result);
  } catch (error) {
    console.error("Error fetching onboarding progress:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update onboarding progress
const updateOnboardingProgress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const progress = await OnboardingProgress.findOne({
      where: { userId: req.params.id },
    });

    if (!progress) {
      return res.status(404).json({ message: "Onboarding progress not found" });
    }

    const { stage, progress: progressValue } = req.body;

    // Update progress
    const updateData = {};
    if (stage) {
      updateData.stage = stage;
      updateData.stageStartDate = new Date();
      updateData.estimatedCompletionDate = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ); // 30 days from now
    }
    if (progressValue !== undefined) {
      updateData.progress = progressValue;
    }

    await progress.update(updateData);

    // Get updated progress
    const updatedProgress = await OnboardingProgress.findOne({
      where: { userId: req.params.id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role", "department"],
        },
      ],
    });

    res.json(updatedProgress);
  } catch (error) {
    console.error("Error updating onboarding progress:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getOnboardingProgress,
  updateOnboardingProgress,
};
