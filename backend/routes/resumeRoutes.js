const express = require("express");
const {
  uploadResume,
  getApprovedResumes,
  getMyResumes,
  getPendingResumes,
  updateResumeStatus,
  deleteResume,
} = require("../controllers/resumeController");
const { protect, adminOnly, allowRoles } = require("../middleware/authMiddleware");
const { uploadResumeFile } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", protect, getApprovedResumes);
router.get("/mine", protect, getMyResumes);
router.get("/pending", protect, adminOnly, getPendingResumes);

router.post("/", protect, allowRoles("senior", "admin"), uploadResumeFile, uploadResume);
router.put("/:id/status", protect, adminOnly, updateResumeStatus);
router.delete("/:id", protect, deleteResume);

module.exports = router;