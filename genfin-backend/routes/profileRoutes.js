const express = require("express");
const router = express.Router();
const UserProfile = require("../models/UserProfile");
const calculateScores = require("../services/scoringService");

// Save comprehensive profile - personal + financial + mindset + status + feedbacks
router.post("/save-profile", async (req, res) => {
  try {
    console.log("Incoming profile data:", req.body);

    const newProfile = new UserProfile({
      // Personal Info
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,

      // Financial Info
      age: req.body.age,
      income: req.body.income,
      expenses: req.body.expenses,
      savings: req.body.savings,
      debt: req.body.debt,
      emergencyFundMonths: req.body.emergencyFundMonths,

      // Investment Mindset
      investmentMindset: req.body.investmentMindset,

      // Financial Status Selection
      financialStatus: req.body.financialStatus,

      // Scores and Analysis
      riskScore: req.body.riskScore,
      stabilityScore: req.body.stabilityScore,
      readinessScore: req.body.readinessScore,
      expenseRatio: req.body.expenseRatio,
      savingsRate: req.body.savingsRate,
      debtRatio: req.body.debtRatio,
      status: req.body.status,
      recommendation: req.body.recommendation,
      stateCategory: req.body.stateCategory,

      // Feedbacks
      feedbacks: req.body.feedbacks || []
    });

    const saved = await newProfile.save();
    console.log("Profile saved to DB:", saved);

    return res.status(200).json(saved);

  } catch (err) {
    console.error("Save profile error:", err);
    // include original message in response for debugging
    return res.status(500).json({ error: "Failed to save profile", details: err.message || err.toString() });
  }
});

// Save parental/guardian info for minors
router.post("/guardian", async (req, res) => {
  try {
    const newProfile = new UserProfile({
      guardianName: req.body.guardianName,
      guardianRelation: req.body.guardianRelation,
      guardianPhone: req.body.guardianPhone,
      guardianEmail: req.body.guardianEmail,
      isMinorProfile: true
    });

    const saved = await newProfile.save();

    return res.status(200).json(saved);

  } catch (err) {
    console.error("Guardian info error:", err.message);
    return res.status(500).json({ error: "Failed to save guardian info" });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    // Run scoring logic (may throw validation error)
    const scores = calculateScores(req.body);

    console.log("Calculated scores:", scores);

    const newProfile = new UserProfile({
      ...req.body,
      ...scores
    });

    const savedProfile = await newProfile.save();

    console.log("Saved to DB:", savedProfile);

    return res.status(200).json(savedProfile);

  } catch (err) {
    console.error("Route error:", err.message);

    // Business validation error (age check, etc.)
    if (err.message && err.message.includes("18+")) {
      return res.status(400).json({ error: err.message });
    }

    // Generic server error
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

module.exports = router;
