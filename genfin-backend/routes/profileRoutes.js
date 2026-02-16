const express = require("express");
const router = express.Router();
const UserProfile = require("../models/UserProfile");
const calculateScores = require("../services/scoringService");
// Save personal info only
router.post("/personal", async (req, res) => {
  try {
    const newProfile = new UserProfile({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth
    });

    const saved = await newProfile.save();

    return res.status(200).json(saved);

  } catch (err) {
    console.error("Personal info error:", err.message);
    return res.status(500).json({ error: "Failed to save personal info" });
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
