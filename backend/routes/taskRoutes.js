const express = require("express");
const { body } = require("express-validator");
const taskController = require("../controllers/taskController");
const { auth, checkRole } = require("../middleware/auth");

const router = express.Router();

// Validation middleware
const taskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("dueDate").isDate().withMessage("Invalid due date"),
  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority level"),
  body("onboardingStage")
    .isIn(["prepare", "welcome", "connect", "develop", "perform"])
    .withMessage("Invalid onboarding stage"),
  body("controlledBy")
    .isIn(["employee", "supervisor", "hr"])
    .withMessage("Invalid controller"),
];

// Routes
router.get("/", auth, taskController.getUserTasks);
router.get("/:id", auth, taskController.getTaskById);
router.post("/", auth, taskValidation, taskController.createTask);
router.put("/:id", auth, taskValidation, taskController.updateTask);
router.delete("/:id", auth, taskController.deleteTask);
router.get(
  "/employee/:employeeId",
  auth,
  checkRole("supervisor", "manager", "hr"),
  taskController.getEmployeeTasks
);

module.exports = router;
