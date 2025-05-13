const express = require("express");
const { check } = require("express-validator");
const documentController = require("../controllers/documentController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// GET /api/documents
router.get("/", auth, documentController.getAllDocuments);

// GET /api/documents/:id
router.get("/:id", auth, documentController.getDocumentById);

// POST /api/documents
router.post(
  "/",
  [
    auth,
    roleCheck(["hr"]),
    upload.single("file"),
    check("name", "Name is required").not().isEmpty(),
    check(
      "category",
      "Category must be contract, policy, training, guide, or form"
    ).isIn(["contract", "policy", "training", "guide", "form"]),
  ],
  documentController.uploadDocument
);

// PUT /api/documents/:id
router.put(
  "/:id",
  [
    auth,
    roleCheck(["hr"]),
    check("name", "Name is required").optional(),
    check(
      "category",
      "Category must be contract, policy, training, guide, or form"
    )
      .optional()
      .isIn(["contract", "policy", "training", "guide", "form"]),
  ],
  documentController.updateDocument
);

// DELETE /api/documents/:id
router.delete(
  "/:id",
  auth,
  roleCheck(["hr"]),
  documentController.deleteDocument
);

// POST /api/documents/access
router.post(
  "/access",
  [
    auth,
    roleCheck(["hr"]),
    check("documentId", "Document ID is required").not().isEmpty(),
    check(
      "roleAccess",
      "Role access must be employee, supervisor, manager, hr, or all"
    ).isIn(["employee", "supervisor", "manager", "hr", "all"]),
  ],
  documentController.setDocumentAccess
);

module.exports = router;
