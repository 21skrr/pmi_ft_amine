const express = require("express");
const { check } = require("express-validator");
const onboardingController = require("../controllers/onboardingController");
const { auth } = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

// GET /api/onboarding/:id
router.get("/:id", auth, onboardingController.getOnboardingProgress);

// PUT /api/onboarding/:id
router.put(
  "/:id",
  [
    auth,
    roleCheck(["hr", "supervisor"]),
    check("stage", "Stage must be prepare, orient, land, integrate, or excel")
      .optional()
      .isIn(["prepare", "orient", "land", "integrate", "excel"]),
    check("progress", "Progress must be a number between 0 and 100")
      .optional()
      .isInt({ min: 0, max: 100 }),
  ],
  onboardingController.updateOnboardingProgress
);

module.exports = router;
