const mongoose = require("mongoose");

// Each hiring round, e.g. "Online Test", "Technical Interview"
const roundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

// Each past visit to the college, e.g. year 2025 with 12 selections
const visitSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    selectedCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    about: { type: String },
    website: { type: String },
    roles: [{ type: String }], // e.g. ["Software Engineer", "Analyst"]
    package: {
      min: { type: Number }, // in LPA
      max: { type: Number },
    },
    eligibility: {
      minCGPA: { type: Number },
      maxBacklogs: { type: Number, default: 0 },
      branches: [{ type: String }], // e.g. ["CSE", "IT"]
    },
    rounds: [roundSchema],
    prepTopics: [{ type: String }], // e.g. ["Arrays", "SQL", "OOPs"]
    visits: [visitSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);