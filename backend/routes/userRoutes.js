const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

// GET /api/users
router.get("/", auth, roleCheck(["hr", "manager"]), userController.getAllUsers);

// GET /api/users/:id
router.get("/:id", auth, userController.getUserById);

// POST /api/users
router.post(
  "/",
  [
    auth,
    roleCheck(["hr"]),
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("role", "Role is required").isIn([
      "employee",
      "supervisor",
      "manager",
      "hr",
    ]),
  ],
  userController.createUser
);

// PUT /api/users/:id
router.put(
  "/:id",
  [
    auth,
    roleCheck(["hr"]),
    check("email", "Please include a valid email").optional().isEmail(),
    check("role", "Invalid role")
      .optional()
      .isIn(["employee", "supervisor", "manager", "hr"]),
  ],
  userController.updateUser
);

// DELETE /api/users/:id
router.delete("/:id", auth, roleCheck(["hr"]), userController.deleteUser);

// GET /api/users/team/members
router.get(
  "/team/members",
  auth,
  roleCheck(["supervisor", "manager"]),
  userController.getTeamMembers
);

// PUT /api/users/:id/password
router.put(
  "/:id/password",
  [
    auth,
    check("currentPassword", "Current password is required").exists(),
    check(
      "newPassword",
      "Please enter a new password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  userController.updatePassword
);

module.exports = router;
