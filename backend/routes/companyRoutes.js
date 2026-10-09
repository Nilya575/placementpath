const express = require("express");
const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Any logged-in user can view companies
router.get("/", protect, getCompanies);
router.get("/:id", protect, getCompanyById);

// Only admins can create, edit or delete
router.post("/", protect, adminOnly, createCompany);
router.put("/:id", protect, adminOnly, updateCompany);
router.delete("/:id", protect, adminOnly, deleteCompany);

module.exports = router;