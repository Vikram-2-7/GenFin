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
   * Get user's complete financial profile history
   */
  static async getProfileHistory() {
    try {
      // For now, return the current profile from localStorage simulation
      // In a real implementation, this would fetch from database
      const profileData = this.getCurrentProfileFromStorage();
      
      if (!profileData) {
        return {
          hasProfile: false,
          message: "No profile data found. Please complete your financial profile first."
        };
      }

      const analysis = this.performRuleBasedAnalysis(profileData);
      const actionPlan = this.generateActionPlan(analysis);
      
      return {
        hasProfile: true,
        profile: profileData,
        currentAnalysis: analysis,
        actionPlan: actionPlan,
        lastUpdated: profileData.lastUpdated || new Date().toISOString(),
        profileCompleteness: this.calculateProfileCompleteness(profileData)
      };
    } catch (error) {
      console.error('Profile History Error:', error);
      throw new Error(`Failed to fetch profile history: ${error.message}`);
    }
  }

  /**
   * Get comprehensive financial health summary with statistics and guided path
   */
  static async getComprehensiveFinancialSummary(profileData) {
    try {
      // Basic analysis
      const analysis = this.performRuleBasedAnalysis(profileData);
      
      // Enhanced statistics
      const statistics = this.generateFinancialStatistics(profileData, analysis);
      
      // Guided path recommendations
      const guidedPath = this.generateGuidedPath(analysis, profileData);
      
      // Risk assessment
      const riskAssessment = this.assessRisk(analysis);
      
      // Key insights
      const insights = this.extractKeyInsights(analysis);
      
      // Action plan
      const actionPlan = this.generateActionPlan(analysis);
      
      // Investment readiness
      const investmentReadiness = await this.getInvestmentRecommendation(profileData);

      return {
        timestamp: new Date().toISOString(),
        
        // Core Analysis
        analysis: {
          ...analysis,
          insights: insights,
          riskAssessment: riskAssessment
        },
        
        // Financial Statistics
        statistics: statistics,
        
        // Guided Path
        guidedPath: guidedPath,
        
        // Action Plan
        actionPlan: actionPlan,
        
        // Investment Guidance
        investmentReadiness: investmentReadiness,
        
        // Profile Health
        profileHealth: {
          completeness: this.calculateProfileCompleteness(profileData),
          dataQuality: this.assessDataQuality(profileData),
          recommendations: this.getProfileImprovementSuggestions(profileData)
        }
      };
    } catch (error) {
      console.error('Comprehensive Summary Error:', error);
      throw new Error(`Failed to generate comprehensive summary: ${error.message}`);
    }
  }

  /**
   * Generate detailed financial statistics
   */
  static generateFinancialStatistics(profileData, analysis) {
    const income = profileData.income || 0;
    const expenses = profileData.expenses || 0;
    const savings = profileData.savings || 0;
    const debt = profileData.debt || 0;
    
    return {
      cashFlow: {
        monthlyIncome: income,
        monthlyExpenses: expenses,
        monthlySavings: savings,
        netCashFlow: income - expenses - savings,
        savingsRate: analysis.savingsRate,
        expenseRatio: analysis.expenseRatio
      },
      
      emergencyFund: {
        currentMonths: profileData.emergencyFundMonths || 0,
        targetMonths: 6,
        adequacyScore: Math.min(100, ((profileData.emergencyFundMonths || 0) / 6) * 100),
        recommendedAmount: expenses * 6,
        currentAmount: savings * (profileData.emergencyFundMonths || 0),
        gap: Math.max(0, (expenses * 6) - (savings * (profileData.emergencyFundMonths || 0)))
      },
      
      debtAnalysis: {
        totalDebt: debt,
        debtToIncomeRatio: analysis.debtRatio,
        monthlyDebtPayment: debt > 0 ? (debt * 0.05) : 0, // Assuming 5% monthly payment
        debtBurden: debt > (income * 12 * 0.3) ? 'High' : debt > (income * 12 * 0.2) ? 'Moderate' : 'Low'
      },
      
      investmentCapacity: {
        readinessScore: analysis.readinessScore,
        canInvest: analysis.canInvest,
        recommendedInvestmentAmount: analysis.canInvest ? Math.max(0, (income * 0.15)) : 0,
        riskCapacity: this.assessRiskCapacity(analysis),
        suggestedProducts: this.getSuggestedInvestmentProducts(analysis)
      },
      
      financialHealthScore: {
        overall: Math.round((analysis.stabilityScore + (100 - analysis.riskScore) + analysis.readinessScore) / 3),
        stability: analysis.stabilityScore,
        risk: 100 - analysis.riskScore,
        readiness: analysis.readinessScore,
        trend: 'stable' // In real implementation, would track over time
      }
    };
  }

  /**
   * Generate guided financial path based on current situation
   */
  static generateGuidedPath(analysis, profileData) {
    const readinessScore = analysis.readinessScore;
    const emergencyMonths = profileData.emergencyFundMonths || 0;
    const savingsRate = parseFloat(analysis.savingsRate);
    const debtRatio = parseFloat(analysis.debtRatio);
    
    let currentPhase = '';
    let nextPhase = '';
    let immediateActions = [];
    let shortTermGoals = [];
    let longTermVision = [];
    
    // Determine current phase
    if (readinessScore < 40) {
      currentPhase = 'Foundation Building';
      nextPhase = 'Stability Enhancement';
      immediateActions = [
        'Create detailed monthly budget',
        'Build emergency fund to 3 months',
        'Reduce high-interest debt',
        'Increase savings rate to 15%'
      ];
      shortTermGoals = [
        'Achieve 3-month emergency fund',
        'Reduce expenses to 60% of income',
        'Establish consistent savings habit'
      ];
      longTermVision = [
        'Reach 6-month emergency fund',
        'Become debt-free',
        'Develop investment discipline'
      ];
    } else if (readinessScore < 60) {
      currentPhase = 'Stability Enhancement';
      nextPhase = 'Investment Preparation';
      immediateActions = [
        'Increase emergency fund to 6 months',
        'Optimize expense ratio below 50%',
        'Maintain savings rate of 20%',
        'Research low-risk investment options'
      ];
      shortTermGoals = [
        'Complete 6-month emergency fund',
        'Achieve debt-to-income ratio below 20%',
        'Start conservative investment education'
      ];
      longTermVision = [
        'Build diversified investment portfolio',
        'Achieve financial independence milestones',
        'Create long-term wealth strategy'
      ];
    } else if (readinessScore < 80) {
      currentPhase = 'Investment Preparation';
      nextPhase = 'Wealth Building';
      immediateActions = [
        'Start systematic investment plan (SIP)',
        'Diversify into low-risk instruments',
        'Set up automatic investment transfers',
        'Monitor and rebalance portfolio quarterly'
      ];
      shortTermGoals = [
        'Build 1-year investment track record',
        'Achieve portfolio diversification',
        'Maximize tax-advantaged investments'
      ];
      longTermVision = [
        'Achieve financial independence',
        'Build substantial investment portfolio',
        'Create passive income streams'
      ];
    } else {
      currentPhase = 'Wealth Building';
      nextPhase = 'Financial Freedom';
      immediateActions = [
        'Optimize investment allocation',
        'Explore advanced investment strategies',
        'Plan for major life goals',
        'Consider philanthropic giving'
      ];
      shortTermGoals = [
        'Achieve target net worth',
        'Maximize investment returns',
        'Build multiple income streams'
      ];
      longTermVision = [
        'Complete financial freedom',
        'Legacy planning',
        'Financial mentorship for others'
      ];
    }
    
    return {
      currentPhase,
      nextPhase,
      phaseProgress: Math.min(100, readinessScore),
      immediateActions,
      shortTermGoals,
      longTermVision,
      estimatedTimeline: this.estimatePhaseTimeline(readinessScore),
      milestones: this.generateMilestones(analysis, profileData)
    };
  }

  /**
   * Calculate profile completeness percentage
   */
  static calculateProfileCompleteness(profileData) {
    const requiredFields = [
      'income', 'expenses', 'savings', 'debt', 
      'emergencyFundMonths', 'age', 'investmentMindset'
    ];
    
    const optionalFields = [
      'fullName', 'email', 'phone', 'financialStatus'
    ];
    
    let requiredComplete = 0;
    let optionalComplete = 0;
    
    requiredFields.forEach(field => {
      if (profileData[field] && profileData[field] !== '') {
        requiredComplete++;
      }
    });
    
    optionalFields.forEach(field => {
      if (profileData[field] && profileData[field] !== '') {
        optionalComplete++;
      }
    });
    
    const requiredScore = (requiredComplete / requiredFields.length) * 70;
    const optionalScore = (optionalComplete / optionalFields.length) * 30;
    
    return Math.round(requiredScore + optionalScore);
  }

  /**
   * Assess data quality of profile
   */
  static assessDataQuality(profileData) {
    const issues = [];
    const warnings = [];
    
    // Check for logical inconsistencies
    if (profileData.income && profileData.expenses && profileData.savings) {
      const calculatedSavings = profileData.income - profileData.expenses;
      if (Math.abs(calculatedSavings - profileData.savings) > profileData.income * 0.1) {
        warnings.push('Savings amount seems inconsistent with income minus expenses');
      }
    }
    
    if (profileData.income && profileData.income < 1000) {
      issues.push('Income seems unusually low');
    }
    
    if (profileData.expenses && profileData.income && (profileData.expenses / profileData.income) > 1) {
      issues.push('Expenses exceed income - please verify data');
    }
    
    return {
      score: issues.length === 0 ? (warnings.length === 0 ? 'high' : 'medium') : 'low',
      issues,
      warnings,
      recommendations: this.getDataQualityRecommendations(issues, warnings)
    };
  }

  /**
   * Get profile improvement suggestions
   */
  static getProfileImprovementSuggestions(profileData) {
    const suggestions = [];
    
    if (!profileData.fullName || profileData.fullName === '') {
      suggestions.push('Add your full name for personalized experience');
    }
    
    if (!profileData.investmentMindset || profileData.investmentMindset === '') {
      suggestions.push('Select your investment mindset to get tailored recommendations');
    }
    
    if (!profileData.financialStatus || profileData.financialStatus === '') {
      suggestions.push('Indicate your current financial status for better guidance');
    }
    
    if (profileData.emergencyFundMonths === undefined || profileData.emergencyFundMonths === '') {
      suggestions.push('Specify emergency fund months for accurate risk assessment');
    }
    
    return suggestions;
  }

  /**
   * Helper methods for guided path generation
   */
  static assessRiskCapacity(analysis) {
    if (analysis.readinessScore >= 80) return 'high';
    if (analysis.readinessScore >= 60) return 'moderate';
    return 'low';
  }

  static getSuggestedInvestmentProducts(analysis) {
    if (!analysis.canInvest) return [];
    
    if (analysis.readinessScore >= 80) {
      return ['Index Funds', 'ETFs', 'Government Bonds', 'Debt Funds', 'Digital Gold'];
    } else if (analysis.readinessScore >= 60) {
      return ['Index Funds', 'Government Bonds', 'Debt Funds'];
    } else {
      return ['Government Bonds', 'Debt Funds'];
    }
  }

  static estimatePhaseTimeline(readinessScore) {
    if (readinessScore < 40) return '6-12 months';
    if (readinessScore < 60) return '3-6 months';
    if (readinessScore < 80) return '2-4 months';
    return '1-3 months';
  }

  static generateMilestones(analysis, profileData) {
    const milestones = [];
    
    // Emergency fund milestones
    const currentMonths = profileData.emergencyFundMonths || 0;
    if (currentMonths < 6) {
      milestones.push({
        title: 'Build Emergency Fund',
        target: '6 months of expenses',
        current: `${currentMonths} months`,
        progress: Math.min(100, (currentMonths / 6) * 100),
        priority: 'high'
      });
    }
    
    // Savings rate milestones
    const savingsRate = parseFloat(analysis.savingsRate);
    if (savingsRate < 20) {
      milestones.push({
        title: 'Increase Savings Rate',
        target: '20% of income',
        current: `${savingsRate.toFixed(1)}%`,
        progress: Math.min(100, (savingsRate / 20) * 100),
        priority: 'high'
      });
    }
    
    // Investment readiness milestones
    if (analysis.readinessScore < 75) {
      milestones.push({
        title: 'Investment Readiness',
        target: '75/100 score',
        current: `${analysis.readinessScore}/100`,
        progress: (analysis.readinessScore / 75) * 100,
        priority: 'medium'
      });
    }
    
    return milestones;
  }

  static getDataQualityRecommendations(issues, warnings) {
    const recommendations = [];
    
    if (issues.length > 0) {
      recommendations.push('Please review and correct the data inconsistencies highlighted');
    }
    
    if (warnings.length > 0) {
      recommendations.push('Consider updating your financial data for more accurate analysis');
    }
    
    if (issues.length === 0 && warnings.length === 0) {
      recommendations.push('Your profile data looks good and consistent');
    }
    
    return recommendations;
  }

  /**
   * Get current profile from storage (simulated localStorage)
   */
  static getCurrentProfileFromStorage() {
    // In a real implementation, this would fetch from database
    // For now, return null to indicate no stored profile
    return null;
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
