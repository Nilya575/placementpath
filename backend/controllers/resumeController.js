const Resume = require("../models/Resume");
const Company = require("../models/Company");
const cloudinary = require("../config/cloudinary");

// Send a file buffer to Cloudinary and return the upload result
const uploadToCloudinary = (buffer, publicId) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "placementpath/resumes",
        resource_type: "raw", // PDFs are stored as raw files
        public_id: publicId,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

// POST /api/resumes  (senior or admin) - multipart form with a "resume" file
exports.uploadResume = async (req, res) => {
  try {
    const { company, role, year, consent } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please attach a PDF file" });
    }
    if (!company || !role || !year) {
      return res.status(400).json({ message: "Company, role and year are required" });
    }
    // Form fields arrive as strings, so compare with "true"
    if (consent !== "true") {
      return res
        .status(400)
        .json({ message: "You must agree to share your resume with students" });
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({ message: "Company not found" });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      `${req.user._id}-${Date.now()}.pdf`
    );

    const resume = await Resume.create({
      user: req.user._id,
      company,
      role,
      year,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      consent: true,
      status: req.user.role === "admin" ? "approved" : "pending",
    });

    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/resumes?company=<companyId>  (any logged-in user, approved only)
exports.getApprovedResumes = async (req, res) => {
  try {
    const filter = { status: "approved" };
    if (req.query.company) filter.company = req.query.company;

    const resumes = await Resume.find(filter)
      .populate("company", "name")
      .populate("user", "name branch")
      .sort({ createdAt: -1 });

    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/resumes/mine  (my own uploads with their status)
exports.getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .populate("company", "name")
      .sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/resumes/pending  (admin only)
exports.getPendingResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ status: "pending" })
      .populate("company", "name")
      .populate("user", "name email")
      .sort({ createdAt: 1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/resumes/:id/status  (admin only)  body: { "status": "approved" | "rejected" }
exports.updateResumeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }

    const resume = await Resume.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/resumes/:id  (the owner or an admin) - also removes the file from Cloudinary
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const isOwner = resume.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own resume" });
    }

    await cloudinary.uploader.destroy(resume.publicId, { resource_type: "raw" });
    await resume.deleteOne();

    res.json({ message: "Resume deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};