/**
 * Specialized Language Model (SLM) Service
 * 
 * Hybrid system combining:
 * - Rule-based financial scoring (deterministic)
 * - Financial knowledge base (domain expertise)
 * - Mistral LLM (natural language generation)
 */

const financialKnowledgeBase = require('./financialKnowledgeBase');
const OllamaService = require('./ollamaService');

class SLMService {
  /**
   * Comprehensive financial analysis combining rules and LLM
   */
  static async analyzeFinancialProfile(profileData) {
    try {
      // Step 1: Rule-based analysis
      const ruleBasedAnalysis = this.performRuleBasedAnalysis(profileData);
      
      // Step 2: Get LLM explanation
      const llmExplanation = await OllamaService.generateExplanation(
        ruleBasedAnalysis,
        'detailed'
      );
      
      // Step 3: Generate investment recommendation
      const investmentAdvice = await OllamaService.generateInvestmentRecommendation(
        ruleBasedAnalysis
      );
      
      // Step 4: Generate action plan
      const actionPlan = this.generateActionPlan(ruleBasedAnalysis);
      
      return {
        timestamp: new Date().toISOString(),
        profileId: profileData.id || null,
        
        // Quantitative Analysis
        metrics: {
          expenseRatio: parseFloat(ruleBasedAnalysis.expenseRatio),
          savingsRate: parseFloat(ruleBasedAnalysis.savingsRate),
          debtRatio: parseFloat(ruleBasedAnalysis.debtRatio),
          stabilityScore: ruleBasedAnalysis.stabilityScore,
          riskScore: ruleBasedAnalysis.riskScore,
          readinessScore: ruleBasedAnalysis.readinessScore
        },
        
        // Status & Categorization
        status: {
          overallStatus: ruleBasedAnalysis.status,
          category: ruleBasedAnalysis.stateCategory,
          emoji: financialKnowledgeBase.financialStates[ruleBasedAnalysis.stateCategory]?.displayEmoji,
          canInvest: ruleBasedAnalysis.canInvest
        },
        
        // LLM-Generated Insights
        analysis: {
          overview: llmExplanation,
          investmentRecommendation: investmentAdvice,
          keyInsights: this.extractKeyInsights(ruleBasedAnalysis)
        },
        
        // Action Plan
        actionPlan: actionPlan,
        
        // Contextual Information
        context: this.getContextualInfo(ruleBasedAnalysis),
        
        // Risk Assessment
        riskAssessment: this.assessRisk(ruleBasedAnalysis),
        
        // Recommendations from Knowledge Base
        recommendations: this.getContextualRecommendations(ruleBasedAnalysis)
      };
    } catch (error) {
      console.error('SLM Analysis Error:', error);
      throw new Error(`Financial analysis failed: ${error.message}`);
    }
  }

  /**
   * Rule-based financial analysis
   */
  static performRuleBasedAnalysis(data) {
    const income = data.income || 0;
    const expenses = data.expenses || 0;
    const savings = data.savings || 0;
    const debt = data.debt || 0;
    const emergencyMonths = data.emergencyFundMonths || 0;

    // Calculate ratios
    const expenseRatio = income > 0 ? (expenses / income) * 100 : 0;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const debtRatio = income > 0 ? debt / (income * 12) : 0;

    // Calculate scores
    const stabilityScore = Math.min(100, (emergencyMonths / 6) * 100);
    const expenseComponent = Math.min(100, (expenseRatio / 50) * 100);
    const debtComponent = Math.min(100, (debtRatio / 0.2) * 100);
    const riskScore = Math.round((expenseComponent + debtComponent) / 2);
    const readinessScore = Math.round(
      (stabilityScore + (100 - riskScore) + savingsRate) / 3
    );

    // Determine state and recommendations
    let status = '';
    let recommendation = '';
    let stateCategory = '';
    let canInvest = false;

    if (
      savingsRate >= 20 &&
      emergencyMonths >= 6 &&
      expenseRatio <= 50 &&
      debtRatio <= 0.2
    ) {
      stateCategory = 'healthy';
      status = 'Stable & Investing Ready';
      recommendation =
        'Your emergency fund is solid and expenses are well under control. You can start allocating surplus towards diversified investments.';
      canInvest = true;
    } else if (
      savingsRate >= 10 &&
      emergencyMonths >= 3 &&
      expenseRatio <= 75
    ) {
      stateCategory = 'caution';
      status = 'Moderate Health, Improve Before Investing';
      recommendation =
        'You\'re on the right track but build your emergency buffer and reduce spending/debt before taking on new investment risk.';
    } else {
      stateCategory = 'risky';
      status = 'Financial Risk Zone';
      recommendation =
        'Focus first on emergency savings and cutting expenses or paying down debt. Avoid investing until your basics are secure.';
    }

    return {
      expenseRatio: expenseRatio.toFixed(1),
      savingsRate: savingsRate.toFixed(1),
      debtRatio: debtRatio.toFixed(1),
      stabilityScore: Math.round(stabilityScore),
      riskScore: Math.round(riskScore),
      readinessScore: Math.round(readinessScore),
      status,
      recommendation,
      stateCategory,
      canInvest,
      inputData: data
    };
  }

  /**
   * Generate structured action plan
   */
  static generateActionPlan(analysis) {
    const actions = [];
    const data = analysis.inputData;
    const savingsRate = parseFloat(analysis.savingsRate);
    const debtRatio = parseFloat(analysis.debtRatio);
    const expenseRatio = parseFloat(analysis.expenseRatio);

    // Priority 1: Emergency Fund
    if (data.emergencyFundMonths < 3) {
      actions.push({
        priority: 1,
        task: 'Build Emergency Fund to 3 Months',
        reason: `You have only ${data.emergencyFundMonths} months coverage. One unexpected expense could derail finances.`,
        target: '3 months of expenses',
        timeline: '3-6 months',
        estimatedAmount: (data.expenses * 3 - (data.savings || 0)).toFixed(0)
      });
    } else if (data.emergencyFundMonths < 6) {
      actions.push({
        priority: 2,
        task: 'Increase Emergency Fund to 6 Months',
        reason: `Adequate buffer exists, but optimal coverage is 6 months for complete security.`,
        target: '6 months of expenses',
        timeline: '2-3 months',
        estimatedAmount: (data.expenses * 6 - (data.savings || 0)).toFixed(0)
      });
    }

    // Priority 2: Reduce Expenses
    if (expenseRatio > 70) {
      actions.push({
        priority: savingsRate < 10 ? 1 : 2,
        task: 'Optimize Spending',
        reason: `Expenses consume ${expenseRatio}% of income. Target is 40-50%.`,
        target: `Reduce to ${Math.min(50, data.income * 0.5).toFixed(0)} per month`,
        timeline: '1-2 months',
        potentialSavings: (data.expenses - data.income * 0.5).toFixed(0)
      });
    }

    // Priority 3: Increase Savings Rate
    if (savingsRate < 20) {
      actions.push({
        priority: 2,
        task: 'Increase Savings Rate',
        reason: `Current rate is ${savingsRate}%. Target is 20% for wealth building.`,
        target: '20% of monthly income',
        timeline: '2-3 months',
        estimatedMonthlyAmount: (data.income * 0.20).toFixed(0)
      });
    }

    // Priority 4: Debt Management
    if (debtRatio > 0.2) {
      actions.push({
        priority: 1,
        task: 'Aggressive Debt Payoff',
        reason: `Debt ratio is ${(debtRatio * 100).toFixed(1)}%. High debt limits financial flexibility.`,
        target: 'Reduce to < 20% of annual income',
        timeline: '12-18 months',
        estimatedMonthlyPayment: ((data.debt / 12) * 1.5).toFixed(0)
      });
    }

    // Priority 5: Investment
    if (analysis.canInvest) {
      actions.push({
        priority: 3,
        task: 'Start Investment Program',
        reason: `Your readiness score is ${analysis.readinessScore}/100. Foundation is strong.`,
        target: 'Build diversified portfolio',
        timeline: 'Start immediately',
        suggestedMonthlAmount: (data.income * 0.15).toFixed(0),
        recommendedApproach: 'SIPs in index funds or balanced funds'
      });
    }

    return actions;
  }

  /**
   * Extract key insights from analysis
   */
  static extractKeyInsights(analysis) {
    const insights = [];
    const savingsRate = parseFloat(analysis.savingsRate);
    const debtRatio = parseFloat(analysis.debtRatio);
    const expenseRatio = parseFloat(analysis.expenseRatio);
    const readiness = analysis.readinessScore;

    if (savingsRate >= 25) {
      insights.push('💰 Exceptional savings discipline - you\'re on track for rapid wealth accumulation');
    } else if (savingsRate >= 15) {
      insights.push('💰 Strong savings rate - continue momentum for wealth building');
    } else {
      insights.push('⚠️ Savings rate below target - increasing it would accelerate wealth growth');
    }

    if (debtRatio <= 0.1) {
      insights.push('✅ Excellent debt management - minimal interest drag on finances');
    } else if (debtRatio <= 0.3) {
      insights.push('⚠️ Moderate debt - manage aggressively to free up cash flow');
    } else {
      insights.push('🚨 High debt burden - prioritize payoff before major financial moves');
    }

    if (expenseRatio <= 50) {
      insights.push('✅ Excellent spending control - leaves plenty for savings and investments');
    } else if (expenseRatio <= 75) {
      insights.push('⚠️ Moderate spending - review for optimization opportunities');
    } else {
      insights.push('🚨 High expenses - immediate review and reduction needed');
    }

    if (readiness >= 75) {
      insights.push('🚀 Investment-ready - diversified portfolio recommended');
    } else if (readiness >= 60) {
      insights.push('✅ Can start conservative investing - index funds and SIPs suitable');
    } else {
      insights.push('⏳ Build foundation first - focus on emergency fund and expense reduction');
    }

    return insights;
  }

  /**
   * Get contextual information
   */
  static getContextualInfo(analysis) {
    const category = analysis.stateCategory;
    const categoryInfo = financialKnowledgeBase.financialStates[category];

    return {
      category: categoryInfo.name,
      description: categoryInfo.description,
      color: categoryInfo.color,
      priorityActions: categoryInfo.priorityActions,
      metrics: financialKnowledgeBase.metricsContext
    };
  }

  /**
   * Risk assessment
   */
  static assessRisk(analysis) {
    const riskScore = analysis.riskScore;
    let riskLevel = '';
    let assessment = '';

    if (riskScore >= 70) {
      riskLevel = 'High';
      assessment = 'Your financial risk is elevated due to high expenses or debt. Focus on stability first.';
    } else if (riskScore >= 40) {
      riskLevel = 'Moderate';
      assessment = 'Balanced risk level. Attention needed in key areas but not critical.';
    } else {
      riskLevel = 'Low';
      assessment = 'Financial risk is well-managed. You have good financial stability.';
    }

    return {
      score: riskScore,
      level: riskLevel,
      assessment: assessment,
      factors: [
        `Expense Ratio: ${analysis.expenseRatio}% (Target: < 50%)`,
        `Savings Rate: ${analysis.savingsRate}% (Target: ≥ 20%)`,
        `Debt Ratio: ${analysis.debtRatio}% (Target: < 20%)`
      ]
    };
  }

  /**
   * Get contextual recommendations from knowledge base
   */
  static getContextualRecommendations(analysis) {
    const recommendations = [];
    const savingsRate = parseFloat(analysis.savingsRate);
    const debtRatio = parseFloat(analysis.debtRatio);
    const emergencyMonths = analysis.inputData.emergencyFundMonths;

    // Savings recommendations
    const savingsRec = Object.values(financialKnowledgeBase.recommendations.savingsRate).find(
      rec => rec.trigger(savingsRate)
    );
    if (savingsRec) {
      recommendations.push({
        category: 'Savings',
        ...savingsRec
      });
    }

    // Debt recommendations
    const debtRec = Object.values(financialKnowledgeBase.recommendations.debtManagement).find(
      rec => rec.trigger(debtRatio)
    );
    if (debtRec) {
      recommendations.push({
        category: 'Debt',
        ...debtRec
      });
    }

    // Emergency fund recommendations
    const emergencyRec = Object.values(financialKnowledgeBase.recommendations.emergencyFund).find(
      rec => rec.trigger(emergencyMonths)
    );
    if (emergencyRec) {
      recommendations.push({
        category: 'Emergency Fund',
        ...emergencyRec
      });
    }

    return recommendations;
  }

  /**
   * Get investment recommendation
   */
  static async getInvestmentRecommendation(profileData) {
    const analysis = this.performRuleBasedAnalysis(profileData);
    const recommendation = await OllamaService.generateInvestmentRecommendation(analysis);
    
    const readinessLevel = Object.values(financialKnowledgeBase.investmentReadiness).find(
      level => analysis.readinessScore >= level.scoreRange[0] && 
               analysis.readinessScore < level.scoreRange[1]
    ) || financialKnowledgeBase.investmentReadiness.readyAggressive;

    return {
      isReady: analysis.canInvest,
      readinessScore: analysis.readinessScore,
      readinessLevel: readinessLevel,
      recommendation: recommendation,
      suggestedProducts: readinessLevel.recommendedProducts,
      timeline: readinessLevel.actions
    };
  }

  /**
   * Health check for SLM
   */
  static async healthCheck() {
    const ollamaHealth = await OllamaService.healthCheck();
    
    return {
      slm: 'operational',
      knowledge_base: 'operational',
      ollama: ollamaHealth,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = SLMService;
