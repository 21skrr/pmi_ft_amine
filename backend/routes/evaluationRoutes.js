const express = require("express");
const { check } = require("express-validator");
const evaluationController = require("../controllers/evaluationController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

// GET /api/evaluations/user
router.get("/user", auth, evaluationController.getUserEvaluations);

// GET /api/evaluations/supervisor
router.get(
  "/supervisor",
  auth,
  roleCheck(["supervisor"]),
  evaluationController.getSupervisorEvaluations
);

// GET /api/evaluations/review
router.get(
  "/review",
  auth,
  roleCheck(["manager", "hr"]),
  evaluationController.getReviewEvaluations
);

// GET /api/evaluations/:id
router.get("/:id", auth, evaluationController.getEvaluationById);

// POST /api/evaluations
router.post(
  "/",
  [
    auth,
    roleCheck(["hr", "supervisor", "manager"]),
    check("employeeId", "Employee ID is required").not().isEmpty(),
    check(
      "type",
      "Type must be 3-month, 6-month, 12-month, performance, training, or probation"
    ).isIn([
      "3-month",
      "6-month",
      "12-month",
      "performance",
      "training",
      "probation",
    ]),
    check("dueDate", "Due date is required").isISO8601(),
  ],
  evaluationController.createEvaluation
);

// PUT /api/evaluations/:id
router.put(
  "/:id",
  [
    auth,
    roleCheck(["supervisor", "manager", "hr"]),
    check("status", "Status must be pending, in_progress, or completed")
      .optional()
      .isIn(["pending", "in_progress", "completed"]),
  ],
  evaluationController.updateEvaluation
);

// PUT /api/evaluations/:id/review
router.put(
  "/:id/review",
  [auth, roleCheck(["manager", "hr"])],
  evaluationController.reviewEvaluation
);

// DELETE /api/evaluations/:id
router.delete(
  "/:id",
  auth,
  roleCheck(["hr"]),
  evaluationController.deleteEvaluation
);

module.exports = router;
