const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const profileRoutes = require("./routes/profileRoutes");
const slmRoutes = require("./routes/slmRoutes");
const optimizedSLMRoutes = require("./routes/optimizedSLMRoutes");
const chatRoutes = require("./routes/chatRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/profile", profileRoutes);
app.use("/api/slm", slmRoutes);
app.use("/api/slm-fast", optimizedSLMRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/test", testRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend server running", timestamp: new Date().toISOString() });
});

app.listen(5000, () => {
  console.log("\n🚀 GenFin Backend Server running on port 5000\n");
  console.log("📊 Profile API:");
  console.log("   GET/POST /api/profile\n");
  console.log("🧠 SLM API (Original):");
  console.log("   POST /api/slm/analyze");
  console.log("   POST /api/slm/quick-summary");
  console.log("   POST /api/slm/action-plan\n");
  console.log("⚡ SLM API (OPTIMIZED - FASTEST):");
  console.log("   POST /api/slm-fast/analyze-fast (1-3s, cached <50ms)");
  console.log("   POST /api/slm-fast/quick-summary-fast (<100ms)");
  console.log("   POST /api/slm-fast/action-plan-fast (<100ms)");
  console.log("   POST /api/slm-fast/risk-assessment-fast (<50ms)");
  console.log("   GET /api/slm-fast/health-fast");
  console.log("   GET /api/slm-fast/performance-stats");
  console.log("   GET /api/slm-fast/cache-details\n");
  console.log("💡 Health Check: GET /api/health\n");
  console.log("💬 Chat API:");
  console.log("   GET /api/chat/history");
  console.log("   POST /api/chat/message");
  console.log("   DELETE /api/chat/history\n");
});
