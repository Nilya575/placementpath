const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

// Wrapper so that upload errors (wrong type, too large) return clean JSON
exports.uploadResumeFile = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE" ? "File must be smaller than 2 MB" : err.message;
      return res.status(400).json({ message });
    }
    next();
  });
};