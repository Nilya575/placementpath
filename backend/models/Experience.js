const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true }, // e.g. "Software Engineer"
    year: { type: Number, required: true }, // year of the placement drive
    result: { type: String, enum: ["selected", "rejected"], required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    rounds: [
      {
        name: { type: String, required: true }, // e.g. "Technical Interview"
        details: { type: String }, // what was asked / how it went
        _id: false,
      },
    ],
    questions: [{ type: String }], // notable questions asked
    tips: { type: String }, // advice for juniors
    isAnonymous: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);