const express = require("express");
const {
  createExperience,
  getApprovedExperiences,
  getMyExperiences,
  getPendingExperiences,
  updateExperienceStatus,
  deleteExperience,
} = require("../controllers/experienceController");
const { protect, adminOnly, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getApprovedExperiences);
router.get("/mine", protect, getMyExperiences);
router.get("/pending", protect, adminOnly, getPendingExperiences);

router.post("/", protect, allowRoles("senior", "admin"), createExperience);
router.put("/:id/status", protect, adminOnly, updateExperienceStatus);
router.delete("/:id", protect, deleteExperience);

module.exports = router;