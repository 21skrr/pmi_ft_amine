// backend/controllers/onboardingTemplateController.js
const { OnboardingTemplate, User } = require("../models");
const { validationResult } = require("express-validator");

// Get all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await OnboardingTemplate.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await OnboardingTemplate.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create template
exports.createTemplate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is HR
    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, description, programType, phases } = req.body;

    // Create template
    const template = await OnboardingTemplate.create({
      name,
      description,
      programType,
      phases: phases || OnboardingTemplate.getAttributes().phases.defaultValue,
      createdBy: req.user.id,
      isActive: true,
    });

    // Get created template with creator info
    const createdTemplate = await OnboardingTemplate.findByPk(template.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(201).json(createdTemplate);
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update template
exports.updateTemplate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is HR
    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { id } = req.params;
    const { name, description, programType, phases, isActive } = req.body;

    // Find template
    const template = await OnboardingTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Update template
    await template.update({
      name: name || template.name,
      description:
        description !== undefined ? description : template.description,
      programType: programType || template.programType,
      phases: phases || template.phases,
      isActive: isActive !== undefined ? isActive : template.isActive,
    });

    // Get updated template with creator info
    const updatedTemplate = await OnboardingTemplate.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json(updatedTemplate);
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    // Check if user is HR
    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { id } = req.params;

    // Find template
    const template = await OnboardingTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Delete template
    await template.destroy();

    res.json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Apply template to user
exports.applyTemplateToUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is HR
    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { templateId, userId } = req.body;

    // Find template
    const template = await OnboardingTemplate.findByPk(templateId);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find or create onboarding progress
    const { OnboardingProgress, Task } = require("../models");

    const [progress, created] = await OnboardingProgress.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        stage: "prepare",
        progress: 0,
        stageStartDate: new Date(),
        estimatedCompletionDate: new Date(
          Date.now() + template.phases[0].duration * 24 * 60 * 60 * 1000
        ),
      },
    });

    // Create tasks from template
    for (const phase of template.phases) {
      if (phase.tasks && phase.tasks.length > 0) {
        for (const taskTemplate of phase.tasks) {
          await Task.create({
            userId,
            title: taskTemplate.title,
            description: taskTemplate.description || "",
            dueDate: new Date(
              Date.now() + taskTemplate.daysToComplete * 24 * 60 * 60 * 1000
            ),
            isCompleted: false,
            priority: taskTemplate.priority || "medium",
            onboardingStage: phase.name,
            controlledBy: taskTemplate.controlledBy || "hr",
          });
        }
      }
    }

    res.json({
      message: "Template applied successfully",
      onboardingProgress: progress,
    });
  } catch (error) {
    console.error("Error applying template:", error);
    res.status(500).json({ message: "Server error" });
  }
};
