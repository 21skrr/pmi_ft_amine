// backend/controllers/surveyController.js
const {
  Survey,
  SurveyQuestion,
  SurveyResponse,
  SurveyQuestionResponse,
  User,
  Notification,
} = require("../models");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

// Get all surveys (HR only)
exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get surveys assigned to user
exports.getUserSurveys = async (req, res) => {
  try {
    const { id, role, programType } = req.user;

    // Find surveys assigned to user's role and program
    const surveys = await Survey.findAll({
      where: {
        status: "active",
        [Op.or]: [{ targetRole: role }, { targetRole: "all" }],
        [Op.or]: [{ targetProgram: programType }, { targetProgram: "all" }],
      },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: SurveyResponse,
          where: { userId: id },
          required: false,
        },
      ],
      order: [["dueDate", "ASC"]],
    });

    // Filter out surveys that user has already responded to
    const filteredSurveys = surveys.filter(
      (survey) => survey.SurveyResponses.length === 0
    );

    res.json(filteredSurveys);
  } catch (error) {
    console.error("Error fetching user surveys:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get survey by ID
exports.getSurveyById = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await Survey.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: SurveyQuestion,
          order: [["order", "ASC"]],
        },
      ],
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Check if user is HR or the survey is active and assigned to user
    if (
      req.user.role !== "hr" &&
      (survey.status !== "active" ||
        (survey.targetRole !== req.user.role && survey.targetRole !== "all") ||
        (survey.targetProgram !== req.user.programType &&
          survey.targetProgram !== "all"))
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(survey);
  } catch (error) {
    console.error("Error fetching survey:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create survey (HR only)
exports.createSurvey = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      type,
      status = "draft",
      dueDate,
      targetRole,
      targetProgram = "all",
    } = req.body;

    // Create survey
    const survey = await Survey.create({
      title,
      description,
      type,
      status,
      createdBy: req.user.id,
      dueDate,
      targetRole,
      targetProgram,
    });

    // Get created survey
    const createdSurvey = await Survey.findByPk(survey.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // If survey is active, send notifications to target users
    if (status === "active") {
      try {
        // Find users matching the target criteria
        const targetUsers = await User.findAll({
          where: {
            [Op.or]: [
              { role: targetRole },
              { role: targetRole === "all" ? { [Op.ne]: null } : targetRole },
            ],
            [Op.or]: [
              { programType: targetProgram },
              {
                programType:
                  targetProgram === "all" ? { [Op.ne]: null } : targetProgram,
              },
            ],
          },
        });

        // Create notifications for each user
        for (const user of targetUsers) {
          await Notification.create({
            userId: user.id,
            title: "New Survey Available",
            message: `Please complete the "${title}" survey by ${new Date(
              dueDate
            ).toLocaleDateString()}.`,
            type: "info",
            isRead: false,
            link: `/forms/surveys/${survey.id}`,
          });
        }
      } catch (err) {
        console.error("Error creating survey notifications:", err);
        // Don't fail the request if notifications fail
      }
    }

    res.status(201).json(createdSurvey);
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update survey (HR only)
exports.updateSurvey = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      title,
      description,
      type,
      status,
      dueDate,
      targetRole,
      targetProgram,
    } = req.body;

    // Find survey
    const survey = await Survey.findByPk(id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Prepare update data
    const updateData = {};

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type) updateData.type = type;
    if (status) updateData.status = status;
    if (dueDate) updateData.dueDate = dueDate;
    if (targetRole) updateData.targetRole = targetRole;
    if (targetProgram) updateData.targetProgram = targetProgram;

    // Update survey
    await survey.update(updateData);

    // Send notifications if survey is being activated
    if (status === "active" && survey.status !== "active") {
      try {
        // Find users matching the target criteria
        const targetUsers = await User.findAll({
          where: {
            [Op.or]: [
              { role: updateData.targetRole || survey.targetRole },
              {
                role:
                  (updateData.targetRole || survey.targetRole) === "all"
                    ? { [Op.ne]: null }
                    : updateData.targetRole || survey.targetRole,
              },
            ],
            [Op.or]: [
              { programType: updateData.targetProgram || survey.targetProgram },
              {
                programType:
                  (updateData.targetProgram || survey.targetProgram) === "all"
                    ? { [Op.ne]: null }
                    : updateData.targetProgram || survey.targetProgram,
              },
            ],
          },
        });

        // Create notifications for each user
        for (const user of targetUsers) {
          await Notification.create({
            userId: user.id,
            title: "New Survey Available",
            message: `Please complete the "${
              updateData.title || survey.title
            }" survey by ${new Date(
              updateData.dueDate || survey.dueDate
            ).toLocaleDateString()}.`,
            type: "info",
            isRead: false,
            link: `/forms/surveys/${survey.id}`,
          });
        }
      } catch (err) {
        console.error("Error creating survey notifications:", err);
        // Don't fail the request if notifications fail
      }
    }

    // Get updated survey
    const updatedSurvey = await Survey.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: SurveyQuestion,
          order: [["order", "ASC"]],
        },
      ],
    });

    res.json(updatedSurvey);
  } catch (error) {
    console.error("Error updating survey:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete survey (HR only)
exports.deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;

    // Find survey
    const survey = await Survey.findByPk(id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Delete survey questions
    await SurveyQuestion.destroy({
      where: { surveyId: id },
    });

    // Delete survey responses
    const surveyResponses = await SurveyResponse.findAll({
      where: { surveyId: id },
    });

    for (const response of surveyResponses) {
      await SurveyQuestionResponse.destroy({
        where: { surveyResponseId: response.id },
      });
    }

    await SurveyResponse.destroy({
      where: { surveyId: id },
    });

    // Delete survey
    await survey.destroy();

    res.json({ message: "Survey deleted successfully" });
  } catch (error) {
    console.error("Error deleting survey:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add question to survey (HR only)
exports.addQuestion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { text, type, options, isRequired = true } = req.body;

    // Find survey
    const survey = await Survey.findByPk(id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Get current highest order
    const maxOrder = await SurveyQuestion.max("order", {
      where: { surveyId: id },
    });

    // Create question
    const question = await SurveyQuestion.create({
      surveyId: id,
      text,
      type,
      options: options ? JSON.stringify(options) : null,
      isRequired,
      order: (maxOrder || 0) + 1,
    });

    res.status(201).json(question);
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update question (HR only)
exports.updateQuestion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { text, type, options, isRequired, order } = req.body;

    // Find question
    const question = await SurveyQuestion.findByPk(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update question
    const updateData = {};

    if (text) updateData.text = text;
    if (type) updateData.type = type;
    if (options) updateData.options = JSON.stringify(options);
    if (isRequired !== undefined) updateData.isRequired = isRequired;
    if (order !== undefined) updateData.order = order;

    await question.update(updateData);

    res.json(question);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete question (HR only)
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Find question
    const question = await SurveyQuestion.findByPk(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Delete question responses
    await SurveyQuestionResponse.destroy({
      where: { questionId: id },
    });

    // Delete question
    await question.destroy();

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit survey response
exports.submitResponse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { answers } = req.body;

    // Find survey
    const survey = await Survey.findByPk(id, {
      include: [
        {
          model: SurveyQuestion,
          where: { isRequired: true },
          required: false,
        },
      ],
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Check if user has already responded
    const existingResponse = await SurveyResponse.findOne({
      where: {
        surveyId: id,
        userId: req.user.id,
      },
    });

    if (existingResponse) {
      return res
        .status(400)
        .json({ message: "You have already responded to this survey" });
    }

    // Check if all required questions are answered
    const requiredQuestionIds = survey.SurveyQuestions.map(
      (question) => question.id
    );
    const answeredQuestionIds = answers.map((answer) => answer.questionId);

    const missingQuestions = requiredQuestionIds.filter(
      (id) => !answeredQuestionIds.includes(id)
    );

    if (missingQuestions.length > 0) {
      return res.status(400).json({
        message: "All required questions must be answered",
        missingQuestions,
      });
    }

    // Create survey response
    const response = await SurveyResponse.create({
      surveyId: id,
      userId: req.user.id,
    });

    // Create question responses
    for (const answer of answers) {
      await SurveyQuestionResponse.create({
        surveyResponseId: response.id,
        questionId: answer.questionId,
        answer: answer.answer,
        ratingValue: answer.ratingValue,
        selectedOption: answer.selectedOption,
      });
    }

    // Notify HR that a survey has been completed
    try {
      const hrUsers = await User.findAll({
        where: { role: "hr" },
      });

      for (const hrUser of hrUsers) {
        await Notification.create({
          userId: hrUser.id,
          title: "Survey Response Submitted",
          message: `${req.user.name} has completed the "${survey.title}" survey.`,
          type: "info",
          isRead: false,
          link: `/admin/surveys/${id}/responses`,
        });
      }
    } catch (err) {
      console.error("Error creating survey completion notification:", err);
      // Don't fail the request if notifications fail
    }

    res.status(201).json({
      message: "Survey response submitted successfully",
      responseId: response.id,
    });
  } catch (error) {
    console.error("Error submitting survey response:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get survey responses (HR only)
exports.getSurveyResponses = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is HR
    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find survey
    const survey = await Survey.findByPk(id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Get responses
    const responses = await SurveyResponse.findAll({
      where: { surveyId: id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "department", "programType"],
        },
        {
          model: SurveyQuestionResponse,
          include: [
            {
              model: SurveyQuestion,
            },
          ],
        },
      ],
      order: [["completedAt", "DESC"]],
    });

    res.json(responses);
  } catch (error) {
    console.error("Error fetching survey responses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get survey analytics (HR only)
exports.getSurveyAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is HR
    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find survey
    const survey = await Survey.findByPk(id, {
      include: [
        {
          model: SurveyQuestion,
        },
      ],
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Get responses
    const responses = await SurveyResponse.findAll({
      where: { surveyId: id },
      include: [
        {
          model: SurveyQuestionResponse,
        },
      ],
    });

    // Process analytics
    const analytics = {
      totalResponses: responses.length,
      questions: [],
    };

    // Process each question
    for (const question of survey.SurveyQuestions) {
      const questionAnalytics = {
        id: question.id,
        text: question.text,
        type: question.type,
      };

      if (question.type === "rating") {
        // Calculate average rating
        const ratings = responses
          .flatMap((r) => r.SurveyQuestionResponses)
          .filter(
            (qr) => qr.questionId === question.id && qr.ratingValue !== null
          )
          .map((qr) => qr.ratingValue);

        questionAnalytics.averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, val) => sum + val, 0) / ratings.length
            : 0;

        // Calculate rating distribution
        questionAnalytics.ratingDistribution = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        };

        for (const rating of ratings) {
          questionAnalytics.ratingDistribution[rating]++;
        }
      } else if (question.type === "multiple_choice") {
        // Calculate option distribution
        const options = JSON.parse(question.options || "[]");
        questionAnalytics.optionDistribution = {};

        options.forEach((option) => {
          questionAnalytics.optionDistribution[option] = 0;
        });

        const selections = responses
          .flatMap((r) => r.SurveyQuestionResponses)
          .filter((qr) => qr.questionId === question.id && qr.selectedOption)
          .map((qr) => qr.selectedOption);

        for (const selection of selections) {
          if (selection in questionAnalytics.optionDistribution) {
            questionAnalytics.optionDistribution[selection]++;
          }
        }
      } else if (question.type === "text") {
        // Collect text responses
        questionAnalytics.textResponses = responses
          .flatMap((r) => r.SurveyQuestionResponses)
          .filter((qr) => qr.questionId === question.id && qr.answer)
          .map((qr) => qr.answer);
      }

      analytics.questions.push(questionAnalytics);
    }

    res.json(analytics);
  } catch (error) {
    console.error("Error fetching survey analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};
