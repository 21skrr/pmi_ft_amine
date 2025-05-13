// backend/routes/onboardingTemplateRoutes.js
const express = require("express");
const { check } = require("express-validator");
const onboardingTemplateController = require("../controllers/onboardingTemplateController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

// GET /api/onboarding-templates
router.get(
  "/",
  auth,
  roleCheck(["hr"]),
  onboardingTemplateController.getAllTemplates
);

// GET /api/onboarding-templates/:id
router.get(
  "/:id",
  auth,
  roleCheck(["hr"]),
  onboardingTemplateController.getTemplateById
);

// POST /api/onboarding-templates
router.post(
  "/",
  [
    auth,
    roleCheck(["hr"]),
    check("name", "Template name is required").not().isEmpty(),
    check("programType", "Program type is required").isIn([
      "inkompass",
      "earlyTalent",
      "apprenticeship",
      "academicPlacement",
      "workExperience",
      "all",
    ]),
  ],
  onboardingTemplateController.createTemplate
);

// PUT /api/onboarding-templates/:id
router.put(
  "/:id",
  [
    auth,
    roleCheck(["hr"]),
    check("name", "Template name is required").optional(),
    check("programType", "Invalid program type")
      .optional()
      .isIn([
        "inkompass",
        "earlyTalent",
        "apprenticeship",
        "academicPlacement",
        "workExperience",
        "all",
      ]),
  ],
  onboardingTemplateController.updateTemplate
);

// DELETE /api/onboarding-templates/:id
router.delete(
  "/:id",
  auth,
  roleCheck(["hr"]),
  onboardingTemplateController.deleteTemplate
);

// POST /api/onboarding-templates/apply
router.post(
  "/apply",
  [
    auth,
    roleCheck(["hr"]),
    check("templateId", "Template ID is required").not().isEmpty(),
    check("userId", "User ID is required").not().isEmpty(),
  ],
  onboardingTemplateController.applyTemplateToUser
);

module.exports = router;
