const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Pehle login karo" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User nahi mila" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token galat ya expire ho gaya" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  res.status(403).json({ message: "Sirf admin ke liye" });
};
// Allow only the given roles, e.g. allowRoles("senior", "admin")
exports.allowRoles = (...roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) return next();
  res.status(403).json({ message: "You do not have permission to do this" });
};