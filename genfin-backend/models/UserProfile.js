const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    // Personal Info
    fullName: String,
    email: String,
    phone: String,
    dateOfBirth: Date,

    // Financial Info
    age: Number,
    income: Number,
    expenses: Number,
    savings: Number,
    debt: Number,
    emergencyFundMonths: Number,
    riskTolerance: String,
    goal: String,
    timeHorizon: String,

    // Scores
    riskScore: Number,
    stabilityScore: Number,
    readinessScore: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
