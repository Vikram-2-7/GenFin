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
