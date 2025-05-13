const express = require("express");
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/notifications
router.get("/", auth, notificationController.getUserNotifications);

// PUT /api/notifications/:id/read
router.put("/:id/read", auth, notificationController.markAsRead);

// PUT /api/notifications/read-all
router.put("/read-all", auth, notificationController.markAllAsRead);

module.exports = router;
