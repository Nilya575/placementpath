const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));
app.get("/", (req, res) => {
  res.send("PlacementPath API chal raha hai");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));