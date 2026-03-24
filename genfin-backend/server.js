const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const profileRoutes = require("./routes/profileRoutes");
const slmRoutes = require("./routes/slmRoutes");
const optimizedSLMRoutes = require("./routes/optimizedSLMRoutes");
const chatRoutes = require("./routes/chatRoutes");
const testRoutes = require("./routes/testRoutes");
const liveRatesService = require("./services/liveRatesService");

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization',
                   'x-user-id', 'x-auth-token']
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/profile", profileRoutes);
app.use("/api/slm", slmRoutes);
app.use("/api/slm-fast", optimizedSLMRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/test", testRoutes);

// Live rates endpoints
app.get('/api/rates/live', async (req, res) => {
  try {
    const [nifty, sensex, usdInr, nav, gold] = await Promise.all([
      liveRatesService.getNifty(),
      liveRatesService.getSensex(),
      liveRatesService.getUSDINR(),
      liveRatesService.getTopFundNAV(),
      liveRatesService.getGoldPrice()
    ]);
    res.json({
      success: true,
      market: { nifty, sensex, gold, usdInr },
      mutualFunds: { topFund: nav },
      governmentRates: liveRatesService.getGovernmentRates(),
      rbiRates: liveRatesService.getRBIRates(),
      cacheStatus: liveRatesService.getCacheStatus(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.post('/api/rates/refresh', async (req, res) => {
  try {
    liveRatesService.cache = {};
    const context = await liveRatesService.buildLiveContext();
    res.json({ success: true,
      message: 'Live data cache cleared and refreshed',
      preview: context.substring(0, 300) + '...' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend server running", timestamp: new Date().toISOString() });
});

app.listen(5000, () => {
  console.log("\n🚀 GenFin Backend Server running on port 5000\n");
  
  // Check Groq API status
  const groqAvailable = !!process.env.GROQ_API_KEY;
  console.log("🤖 Groq API:", groqAvailable ? 'Connected' : 'Missing API Key - add GROQ_API_KEY to .env');
  
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
