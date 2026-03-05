/**
 * SLM Routes
 * 
 * API endpoints for Specialized Language Model
 * Provides financial analysis, insights, and recommendations
 */

const express = require("express");
const router = express.Router();
const SLMService = require("../services/slmService");
const OllamaService = require("../services/ollamaService");

/**
 * POST /api/slm/analyze
 * 
 * Perform comprehensive financial analysis
 * 
 * Request body:
 * {
 *   income: number,
 *   expenses: number,
 *   savings: number,
 *   debt: number,
 *   emergencyFundMonths: number,
 *   age: number,
 *   riskTolerance: string ('conservative', 'moderate', 'growth'),
 *   financialGoals: string,
 *   timeHorizon: string
 * }
 */
router.post("/analyze", async (req, res) => {
  try {
    console.log("SLM Analysis Request:", req.body);

    const analysis = await SLMService.analyzeFinancialProfile(req.body);
    
    console.log("SLM Analysis Complete:", analysis);

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error("SLM Analysis Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Financial analysis failed"
    });
  }
});

/**
 * POST /api/slm/investment-recommendation
 * 
 * Get specific investment recommendation
 * Based on readiness score and financial profile
 */
router.post("/investment-recommendation", async (req, res) => {
  try {
    console.log("Investment Recommendation Request:", req.body);

    const recommendation = await SLMService.getInvestmentRecommendation(req.body);

    return res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    console.error("Investment Recommendation Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate investment recommendation"
    });
  }
});

/**
 * POST /api/slm/explain
 * 
 * Generate natural language explanation for financial metrics
 * 
 * Query params:
 * ?type=detailed|summary|actionable|investment
 * 
 * Request body: Financial analysis data
 */
router.post("/explain", async (req, res) => {
  try {
    const analysisType = req.query.type || 'detailed';
    const analysisData = req.body;

    console.log(`Generating ${analysisType} explanation...`);

    const explanation = await OllamaService.generateExplanation(
      analysisData,
      analysisType
    );

    return res.status(200).json({
      success: true,
      type: analysisType,
      explanation: explanation
    });
  } catch (error) {
    console.error("Explanation Generation Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate explanation"
    });
  }
});

/**
 * GET /api/slm/health
 * 
 * Check health status of SLM components
 * Verify Ollama connection, knowledge base, etc.
 */
router.get("/health", async (req, res) => {
  try {
    const health = await SLMService.healthCheck();

    const isHealthy = health.ollama.ollamaRunning;
    const statusCode = isHealthy ? 200 : 503;

    return res.status(statusCode).json({
      success: true,
      status: isHealthy ? 'healthy' : 'degraded',
      ...health
    });
  } catch (error) {
    console.error("Health Check Error:", error);
    return res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
});

/**
 * POST /api/slm/quick-summary
 * 
 * Get quick summary of financial status
 * Faster response, minimal LLM usage
 */
router.post("/quick-summary", async (req, res) => {
  try {
    const analysis = SLMService.performRuleBasedAnalysis(req.body);
    const summary = await OllamaService.generateExplanation(analysis, 'summary');

    return res.status(200).json({
      success: true,
      metrics: {
        expenseRatio: parseFloat(analysis.expenseRatio),
        savingsRate: parseFloat(analysis.savingsRate),
        debtRatio: parseFloat(analysis.debtRatio),
        readinessScore: analysis.readinessScore
      },
      status: analysis.status,
      summary: summary
    });
  } catch (error) {
    console.error("Quick Summary Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/slm/action-plan
 * 
 * Get structured action plan
 * Prioritized steps for financial improvement
 */
router.post("/action-plan", async (req, res) => {
  try {
    const analysis = SLMService.performRuleBasedAnalysis(req.body);
    const actionPlan = SLMService.generateActionPlan(analysis);

    return res.status(200).json({
      success: true,
      status: analysis.status,
      readinessScore: analysis.readinessScore,
      actions: actionPlan
    });
  } catch (error) {
    console.error("Action Plan Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/slm/chat
 *
 * Lightweight conversational endpoint for GenFin.ai UI.
 * Uses current financial profile (if provided) plus the user's question
 * to generate an educational, low‑risk answer.
 */
router.post("/chat", async (req, res) => {
  try {
    const { message, profile } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid request: 'message' is required"
      });
    }

    const baseAnalysis = profile
      ? SLMService.performRuleBasedAnalysis(profile)
      : {
          income: 0,
          expenses: 0,
          savings: 0,
          debt: 0,
          emergencyFundMonths: 0,
          expenseRatio: "0.0",
          savingsRate: "0.0",
          debtRatio: "0.0",
          stabilityScore: 0,
          riskScore: 0,
          readinessScore: 0,
          status: "Financial Profile Not Provided",
          riskTolerance: profile?.riskTolerance || "Not specified"
        };

    const enriched = {
      ...baseAnalysis,
      userQuestion: message
    };

    const reply = await OllamaService.generateExplanation(enriched, "chat");

    return res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    console.error("Chat Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate chat response"
    });
  }
});

/**
 * GET /api/slm/profile-history
 * 
 * Fetch user's complete financial profile history from database
 */
router.get("/profile-history", async (req, res) => {
  try {
    const UserProfile = require('../models/UserProfile');
    
    // Get the latest profile from database
    const latestProfile = await UserProfile.findOne().sort({ createdAt: -1 });
    
    if (!latestProfile) {
      return res.status(200).json({
        success: true,
        history: {
          hasProfile: false,
          message: "No profile data found in database. Please complete your profile first."
        }
      });
    }

    // Convert to plain object and format for SLM
    const profileData = latestProfile.toObject();
    
    const history = {
      hasProfile: true,
      profile: profileData,
      lastUpdated: profileData.updatedAt || profileData.createdAt,
      profileCompleteness: SLMService.calculateProfileCompleteness(profileData)
    };

    return res.status(200).json({
      success: true,
      history: history
    });
  } catch (error) {
    console.error("Profile History Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch profile history from database"
    });
  }
});

/**
 * GET /api/slm/latest-profile
 * 
 * Get the latest user profile for chat usage
 */
router.get("/latest-profile", async (req, res) => {
  try {
    const UserProfile = require('../models/UserProfile');
    
    // Get the latest profile from database
    const latestProfile = await UserProfile.findOne().sort({ createdAt: -1 });
    
    if (!latestProfile) {
      return res.status(200).json({
        success: true,
        profile: null
      });
    }

    // Return only the essential fields for chat
    const chatProfile = {
      income: latestProfile.income,
      expenses: latestProfile.expenses,
      savings: latestProfile.savings,
      debt: latestProfile.debt,
      emergencyFundMonths: latestProfile.emergencyFundMonths,
      age: latestProfile.age,
      investmentMindset: latestProfile.investmentMindset,
      financialStatus: latestProfile.financialStatus,
      stabilityScore: latestProfile.stabilityScore,
      riskScore: latestProfile.riskScore,
      readinessScore: latestProfile.readinessScore,
      expenseRatio: latestProfile.expenseRatio,
      savingsRate: latestProfile.savingsRate,
      debtRatio: latestProfile.debtRatio,
      status: latestProfile.status,
      fullName: latestProfile.fullName,
      email: latestProfile.email
    };

    return res.status(200).json({
      success: true,
      profile: chatProfile
    });
  } catch (error) {
    console.error("Latest Profile Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch latest profile"
    });
  }
});

/**
 * POST /api/slm/financial-health-summary
 * 
 * Get comprehensive financial health summary with statistics and guided path
 */
router.post("/financial-health-summary", async (req, res) => {
  try {
    const { profile } = req.body || {};
    
    if (!profile) {
      return res.status(400).json({
        success: false,
        error: "Profile data is required"
      });
    }

    const comprehensiveAnalysis = await SLMService.getComprehensiveFinancialSummary(profile);
    
    return res.status(200).json({
      success: true,
      data: comprehensiveAnalysis
    });
  } catch (error) {
    console.error("Financial Health Summary Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate financial health summary"
    });
  }
});

/**
 * POST /api/slm/risk-assessment
 * 
 * Detailed risk assessment
 * Analyzes financial risk level and factors
 */
router.post("/risk-assessment", async (req, res) => {
  try {
    const analysis = SLMService.performRuleBasedAnalysis(req.body);
    const riskAssessment = SLMService.assessRisk(analysis);

    return res.status(200).json({
      success: true,
      ...riskAssessment
    });
  } catch (error) {
    console.error("Risk Assessment Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/slm/insights
 * 
 * Get key insights and observations
 * Extracted from financial analysis
 */
router.post("/insights", async (req, res) => {
  try {
    const analysis = SLMService.performRuleBasedAnalysis(req.body);
    const insights = SLMService.extractKeyInsights(analysis);
    const context = SLMService.getContextualInfo(analysis);

    return res.status(200).json({
      success: true,
      insights: insights,
      context: context
    });
  } catch (error) {
    console.error("Insights Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
