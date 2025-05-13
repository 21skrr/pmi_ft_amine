const express = require("express");
const { check } = require("express-validator");
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

// GET /api/tasks
router.get("/", auth, taskController.getUserTasks);

// GET /api/tasks/:id
router.get("/:id", auth, taskController.getTaskById);

// POST /api/tasks
router.post(
  "/",
  [
    auth,
    roleCheck(["hr", "supervisor", "manager"]),
    check("userId", "User ID is required").not().isEmpty(),
    check("title", "Title is required").not().isEmpty(),
    check("dueDate", "Due date is required").isISO8601(),
    check("priority", "Priority must be high, medium, or low").isIn([
      "high",
      "medium",
      "low",
    ]),
    check("controlledBy", "Controller must be hr, supervisor, or manager").isIn(
      ["hr", "supervisor", "manager"]
    ),
  ],
  taskController.createTask
);

// PUT /api/tasks/:id
router.put(
  "/:id",
  [
    auth,
    check("title", "Title is required").optional(),
    check("dueDate", "Due date must be a valid date").optional().isISO8601(),
    check("priority", "Priority must be high, medium, or low")
      .optional()
      .isIn(["high", "medium", "low"]),
  ],
  taskController.updateTask
);

// DELETE /api/tasks/:id
router.delete("/:id", auth, taskController.deleteTask);

// GET /api/tasks/employee/:employeeId
router.get(
  "/employee/:employeeId",
  auth,
  roleCheck(["supervisor", "manager", "hr"]),
  taskController.getEmployeeTasks
);

module.exports = router;
