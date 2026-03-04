const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  feedbackType: String,
  icon: String,
  title: String,
  message: String
}, { _id: false });

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

    // Investment Mindset
    investmentMindset: String, // 'conservative', 'moderate', 'growth'

    // Financial Status Selection
    financialStatus: String, // 'surplus', 'balanced', 'deficit'

    // Scores
    riskScore: Number,
    stabilityScore: Number,
    readinessScore: Number,
    expenseRatio: String,
    savingsRate: String,
    debtRatio: String,

    // Analysis Status & Recommendation
    status: String,
    recommendation: String,
    stateCategory: String, // 'healthy', 'caution', 'risky'

    // Dynamic Feedbacks Array
    feedbacks: [feedbackSchema],

    // Parental/Guardian Info
    guardianName: String,
    guardianRelation: String,
    guardianPhone: String,
    guardianEmail: String,
    isMinorProfile: Boolean
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
