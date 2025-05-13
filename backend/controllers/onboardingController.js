const { OnboardingProgress, User, Task } = require("../models");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

// Get onboarding progress for a user
exports.getOnboardingProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const progress = await OnboardingProgress.findOne({
      where: { userId: id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "programType", "startDate"],
        },
      ],
    });

    if (!progress) {
      return res.status(404).json({ message: "Onboarding progress not found" });
    }

    // Get tasks for each onboarding stage
    const tasks = await Task.findAll({
      where: {
        userId: id,
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
exports.updateOnboardingProgress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { stage, progress } = req.body;

    // Find onboarding progress
    const onboardingProgress = await OnboardingProgress.findOne({
      where: { userId: id },
    });

    if (!onboardingProgress) {
      return res.status(404).json({ message: "Onboarding progress not found" });
    }

    // Check if user is authorized to update onboarding progress
    const user = await User.findByPk(req.user.id);

    if (user.role !== "hr" && user.role !== "supervisor" && user.id !== id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update onboarding progress" });
    }

    // Update progress
    const updateData = {};

    if (stage && stage !== onboardingProgress.stage) {
      updateData.stage = stage;
      updateData.stageStartDate = new Date();

      // Set estimated completion date based on stage
      const estimatedDays = {
        prepare: 1,
        orient: 1,
        land: 5,
        integrate: 4,
        excel: 30,
      };

      updateData.estimatedCompletionDate = new Date(
        Date.now() + (estimatedDays[stage] || 30) * 24 * 60 * 60 * 1000
      );
    }

    if (progress !== undefined) {
      updateData.progress = progress;
    }

    await onboardingProgress.update(updateData);

    // Also update user's onboardingProgress field for quick access
    if (progress !== undefined) {
      await User.update({ onboardingProgress: progress }, { where: { id } });
    }

    // Get updated onboarding progress
    const updatedProgress = await OnboardingProgress.findOne({
      where: { userId: id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "programType", "startDate"],
        },
      ],
    });

    res.json(updatedProgress);
  } catch (error) {
    console.error("Error updating onboarding progress:", error);
    res.status(500).json({ message: "Server error" });
  }
};
