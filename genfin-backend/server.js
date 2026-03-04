const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const profileRoutes = require("./routes/profileRoutes");
const slmRoutes = require("./routes/slmRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/profile", profileRoutes);
app.use("/api/slm", slmRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend server running", timestamp: new Date().toISOString() });
});

app.listen(5000, () => {
  console.log("GenFin Backend Server running on port 5000");
  console.log("📊 Profile API: GET/POST /api/profile");
  console.log("🧠 SLM API: POST /api/slm/analyze");
  console.log("💡 Health Check: GET /api/health");
});
