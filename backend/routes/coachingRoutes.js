const express = require("express");
const { check } = require("express-validator");
const coachingController = require("../controllers/coachingController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

// GET /api/coaching/supervisor
router.get(
  "/supervisor",
  auth,
  roleCheck(["supervisor"]),
  coachingController.getSupervisorSessions
);

// GET /api/coaching/employee
router.get("/employee", auth, coachingController.getEmployeeSessions);

// GET /api/coaching/:id
router.get("/:id", auth, coachingController.getSessionById);

// POST /api/coaching
router.post(
  "/",
  [
    auth,
    roleCheck(["supervisor", "hr"]),
    check("employeeId", "Employee ID is required").not().isEmpty(),
    check("scheduledDate", "Scheduled date is required").isISO8601(),
  ],
  coachingController.createSession
);

// PUT /api/coaching/:id
router.put(
  "/:id",
  [
    auth,
    check(
      "status",
      "Status must be scheduled, completed, cancelled, or rescheduled"
    )
      .optional()
      .isIn(["scheduled", "completed", "cancelled", "rescheduled"]),
    check("scheduledDate", "Scheduled date must be a valid date")
      .optional()
      .isISO8601(),
  ],
  coachingController.updateSession
);

// DELETE /api/coaching/:id
router.delete("/:id", auth, coachingController.deleteSession);

module.exports = router;
