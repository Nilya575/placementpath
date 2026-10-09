const Experience = require("../models/Experience");
const Company = require("../models/Company");

// Hide the author's identity if the experience is anonymous
const formatExperience = (exp) => {
  const obj = exp.toObject();
  if (obj.isAnonymous) {
    obj.user = { name: "Anonymous" };
  }
  return obj;
};

// POST /api/experiences  (senior or admin)
exports.createExperience = async (req, res) => {
  try {
    const { company, role, year, result, difficulty, rounds, questions, tips, isAnonymous } =
      req.body;

    if (!company || !role || !year || !result) {
      return res.status(400).json({ message: "Company, role, year and result are required" });
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({ message: "Company not found" });
    }

    const experience = await Experience.create({
      company,
      user: req.user._id,
      role,
      year,
      result,
      difficulty,
      rounds,
      questions,
      tips,
      isAnonymous,
      // Admin posts are trusted, everyone else waits for approval
      status: req.user.role === "admin" ? "approved" : "pending",
    });

    res.status(201).json(experience);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/experiences?company=<companyId>  (any logged-in user, approved only)
exports.getApprovedExperiences = async (req, res) => {
  try {
    const filter = { status: "approved" };
    if (req.query.company) filter.company = req.query.company;

    const experiences = await Experience.find(filter)
      .populate("company", "name")
      .populate("user", "name branch")
      .sort({ createdAt: -1 });

    res.json(experiences.map(formatExperience));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/experiences/mine  (my own submissions with their status)
exports.getMyExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ user: req.user._id })
      .populate("company", "name")
      .sort({ createdAt: -1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/experiences/pending  (admin only)
exports.getPendingExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ status: "pending" })
      .populate("company", "name")
      .populate("user", "name email")
      .sort({ createdAt: 1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/experiences/:id/status  (admin only)  body: { "status": "approved" | "rejected" }
exports.updateExperienceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }

    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json(experience);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/experiences/:id  (the author or an admin)
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const isOwner = experience.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own experience" });
    }

    await experience.deleteOne();
    res.json({ message: "Experience deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};