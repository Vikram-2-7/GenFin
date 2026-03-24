/**
 * Optimized SLM API Routes
 * 
 * Performance-focused endpoints with:
 * - Response caching
 * - Parallel processing
 * - Performance monitoring
 * - Quality validation
 */

const express = require('express');
const OptimizedSLMService = require('../services/optimizedSLMService');
const cacheService = require('../services/cacheService');

const router = express.Router();

// Performance tracking
const performanceMetrics = {
  requests: [],
  avgLatency: 0,
  maxLatency: 0,
  minLatency: Infinity
};

/**
 * Track performance
 */
function trackPerformance(endpoint, latency) {
  performanceMetrics.requests.push({
    endpoint,
    latency,
    timestamp: new Date()
  });

  // Keep only last 100 requests
  if (performanceMetrics.requests.length > 100) {
    performanceMetrics.requests.shift();
  }

  performanceMetrics.maxLatency = Math.max(performanceMetrics.maxLatency, latency);
  performanceMetrics.minLatency = Math.min(performanceMetrics.minLatency, latency);
  performanceMetrics.avgLatency = 
    performanceMetrics.requests.reduce((sum, r) => sum + r.latency, 0) / performanceMetrics.requests.length;
}

/**
 * POST /api/slm/analyze-fast
 * 
 * ⚡ FAST COMPREHENSIVE ANALYSIS
 * Response time: 1-3 seconds (cached: <50ms)
 * 
 * Returns: Full analysis with metrics, insights, action plan
 * Quality: ⭐⭐⭐⭐⭐ (LLM + Rule-based hybrid)
 */
router.post('/analyze-fast', async (req, res) => {
  const startTime = Date.now();

  try {
    const profileData = {
      ...req.body,
      monthlyIncome: req.body.monthlyIncome || req.body.income,
      debts: req.body.debts || req.body.debt
    };

    const analysis = await OptimizedSLMService.analyzeFinancialProfileFast(profileData);
    const latency = Date.now() - startTime;

    trackPerformance('analyze-fast', latency);

    res.json({
      success: true,
      data: analysis,
      performance: {
        latency: `${latency}ms`,
        cached: analysis.cached || false,
        qualityScore: analysis.qualityScore
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      latency: `${Date.now() - startTime}ms`
    });
  }
});

/**
 * POST /api/slm/quick-summary-fast
 * 
 * ⚡ LIGHTNING QUICK SUMMARY
 * Response time: < 100ms
 * 
 * Returns: Essential metrics only
 * Quality: ⭐⭐⭐⭐ (Rule-based only, super fast)
 */
router.post('/quick-summary-fast', async (req, res) => {
  const startTime = Date.now();

  try {
    const summary = await OptimizedSLMService.quickSummaryFast(req.body);
    const latency = Date.now() - startTime;

    trackPerformance('quick-summary-fast', latency);

    res.json({
      success: true,
      data: summary,
      latency: `${latency}ms`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      latency: `${Date.now() - startTime}ms`
    });
  }
});

/**
 * POST /api/slm/action-plan-fast
 * 
 * 💡 PRIORITIZED ACTION PLAN
 * Response time: < 100ms
 * 
 * Returns: Top 5 prioritized actions
 * Quality: ⭐⭐⭐⭐⭐ (Rule-based, consistent)
 */
router.post('/action-plan-fast', async (req, res) => {
  const startTime = Date.now();

  try {
    const analysis = OptimizedSLMService.performRuleBasedAnalysis(req.body);
    const actionPlan = OptimizedSLMService.generateActionPlanFast(analysis);
    const latency = Date.now() - startTime;

    trackPerformance('action-plan-fast', latency);

    res.json({
      success: true,
      data: {
        actions: actionPlan,
        totalActions: actionPlan.length
      },
      latency: `${latency}ms`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      latency: `${Date.now() - startTime}ms`
    });
  }
});

/**
 * POST /api/slm/risk-assessment-fast
 * 
 * ⚠️ RISK PROFILE
 * Response time: < 50ms
 * 
 * Returns: Risk score and factors
 * Quality: ⭐⭐⭐⭐⭐ (Deterministic)
 */
router.post('/risk-assessment-fast', async (req, res) => {
  const startTime = Date.now();

  try {
    const analysis = OptimizedSLMService.performRuleBasedAnalysis(req.body);
    const riskAssessment = OptimizedSLMService.assessRiskFast(analysis);
    const latency = Date.now() - startTime;

    trackPerformance('risk-assessment-fast', latency);

    res.json({
      success: true,
      data: riskAssessment,
      latency: `${latency}ms`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      latency: `${Date.now() - startTime}ms`
    });
  }
});

/**
 * GET /api/slm/health-fast
 * 
 * 🏥 SYSTEM HEALTH
 * Response time: < 100ms
 * 
 * Returns: Service status, cache stats, Ollama health
 */
router.get('/health-fast', async (req, res) => {
  const startTime = Date.now();

  try {
    const health = await OptimizedSLMService.healthCheck();
    const latency = Date.now() - startTime;

    trackPerformance('health-fast', latency);

    res.json({
      success: true,
      data: health,
      latency: `${latency}ms`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      latency: `${Date.now() - startTime}ms`
    });
  }
});

/**
 * GET /api/slm/performance-stats
 * 
 * 📊 PERFORMANCE ANALYTICS
 * 
 * Returns: Cache hit rates, average latencies, endpoint performance
 */
router.get('/performance-stats', (req, res) => {
  const endpointStats = {};

  performanceMetrics.requests.forEach(req => {
    if (!endpointStats[req.endpoint]) {
      endpointStats[req.endpoint] = {
        count: 0,
        totalLatency: 0,
        avgLatency: 0,
        maxLatency: 0,
        minLatency: Infinity
      };
    }

    const stats = endpointStats[req.endpoint];
    stats.count++;
    stats.totalLatency += req.latency;
    stats.maxLatency = Math.max(stats.maxLatency, req.latency);
    stats.minLatency = Math.min(stats.minLatency, req.latency);
    stats.avgLatency = stats.totalLatency / stats.count;
  });

  res.json({
    success: true,
    data: {
      cache: cacheService.getStats(),
      endpoints: endpointStats,
      overall: {
        avgLatency: Math.round(performanceMetrics.avgLatency),
        maxLatency: performanceMetrics.maxLatency,
        minLatency: performanceMetrics.minLatency === Infinity ? 0 : performanceMetrics.minLatency,
        totalRequests: performanceMetrics.requests.length
      }
    }
  });
});

/**
 * GET /api/slm/cache-details
 * 
 * 🗂️ CACHE DETAILS
 * 
 * Returns: Detailed cache information for debugging
 */
router.get('/cache-details', (req, res) => {
  res.json({
    success: true,
    data: {
      stats: cacheService.getStats(),
      entries: cacheService.getDetails()
    }
  });
});

/**
 * POST /api/slm/clear-cache
 * 
 * 🗑️ CLEAR CACHE
 * 
 * Clears all cached responses
 */
router.post('/clear-cache', (req, res) => {
  cacheService.clear();

  res.json({
    success: true,
    message: 'Cache cleared successfully'
  });
});

module.exports = router;
