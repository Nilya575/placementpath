const Company = require("../models/Company");

// POST /api/companies  (admin only)
exports.createCompany = async (req, res) => {
  try {
    const exists = await Company.findOne({ name: req.body.name });
    if (exists) {
      return res.status(400).json({ message: "This company already exists" });
    }

    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/companies?search=goo  (any logged-in user)
exports.getCompanies = async (req, res) => {
  try {
    const { search } = req.query;

    // If a search term is given, match company names containing it (case-insensitive)
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};

    const companies = await Company.find(filter).sort({ name: 1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/companies/:id  (any logged-in user)
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/companies/:id  (admin only)
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true, // apply schema rules on update too
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/companies/:id  (admin only)
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};