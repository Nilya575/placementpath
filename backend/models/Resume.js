const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    role: { type: String, required: true },
    year: { type: Number, required: true },
    fileUrl: { type: String, required: true }, // link to the PDF on Cloudinary
    publicId: { type: String, required: true }, // needed to delete the file later
    consent: { type: Boolean, required: true }, // user agreed to share with students
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);