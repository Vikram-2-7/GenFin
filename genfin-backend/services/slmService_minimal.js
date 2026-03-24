/**
 * Minimal SLM Service - Fixed version for broken features
 */

const financialKnowledgeBase = require('./financialKnowledgeBase');

class SLMService {
  /**
   * Get comprehensive financial health summary with statistics and guided path
   */
  static async getComprehensiveFinancialSummary(profileData) {
    try {
      console.log('📊 DEBUG: getComprehensiveFinancialSummary called');
      
      // Basic analysis
      const analysis = this.performRuleBasedAnalysis(profileData);
      
      // Enhanced statistics
      const statistics = this.generateFinancialStatistics(profileData, analysis);
      
      // Guided path recommendations
      const guidedPath = this.generateGuidedPath(analysis, profileData);
      
      // Risk assessment
      const riskAssessment = this.assessRisk(analysis, profileData);
      
      // Key insights
      const insights = this.extractKeyInsights(analysis);
      
      // Action plan
      const actionPlan = this.generateActionPlan(analysis);
      
      // Investment readiness (rule-based)
      const investmentReadiness = this.generateRuleBasedInvestmentReadiness(analysis);

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

  static performRuleBasedAnalysis(profileData) {
    const income = profileData.income || 0;
    const expenses = profileData.expenses || 0;
    const savings = profileData.savings || 0;
    const debt = profileData.debt || 0;
    
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;
    const expenseRatio = income > 0 ? ((expenses / income) * 100).toFixed(1) : 0;
    const debtRatio = income > 0 ? ((debt / income) * 100).toFixed(1) : 0;
    const emergencyFundMonths = profileData.emergencyFundMonths || 0;
    
    const canInvest = savingsRate >= 10 && emergencyFundMonths >= 3 && debtRatio < 40;
    const readinessScore = Math.min(100, 
      (savingsRate >= 20 ? 30 : 0) +
      (emergencyFundMonths >= 6 ? 25 : 0) +
      (debtRatio <= 20 ? 25 : 0) +
      (income > 50000 ? 20 : 0)
    );

    return {
      income,
      expenses,
      savings,
      debt,
      savingsRate: parseFloat(savingsRate),
      expenseRatio: parseFloat(expenseRatio),
      debtRatio: parseFloat(debtRatio),
      emergencyFundMonths,
      canInvest,
      readinessScore,
      riskTolerance: profileData.riskTolerance || 'moderate',
      suggestedInvestmentAmount: Math.max(0, (income * 0.15)),
      recommendedTimeframe: '5-10 years'
    };
  }

  static generateFinancialStatistics(profileData, analysis) {
    return {
      cashFlow: {
        monthlyIncome: profileData.income || 0,
        monthlyExpenses: profileData.expenses || 0,
        monthlySavings: profileData.savings || 0,
        netCashFlow: (profileData.income || 0) - (profileData.expenses || 0) - (profileData.savings || 0),
        savingsRate: analysis.savingsRate,
        expenseRatio: analysis.expenseRatio
      },
      emergencyFund: {
        currentMonths: profileData.emergencyFundMonths || 0,
        targetMonths: 6,
        adequacyScore: Math.min(100, ((profileData.emergencyFundMonths || 0) / 6) * 100),
        recommendedAmount: (profileData.expenses || 0) * 6,
        currentAmount: (profileData.savings || 0) * (profileData.emergencyFundMonths || 0),
        gap: Math.max(0, ((profileData.expenses || 0) * 6) - ((profileData.savings || 0) * (profileData.emergencyFundMonths || 0)))
      }
    };
  }

  static generateGuidedPath(analysis, profileData) {
    return {
      currentStage: analysis.canInvest ? 'Ready to Invest' : 'Building Foundation',
      nextSteps: analysis.canInvest ? 
        ['Start with SIP in index funds', 'Diversify across categories', 'Review quarterly'] :
        ['Build emergency fund', 'Pay down high-interest debt', 'Increase savings rate'],
      timeline: '6-12 months',
      priorityActions: analysis.canInvest ?
        ['Open demat account', 'Complete KYC', 'Set up SIP'] :
        ['Save 6 months expenses', 'Negotiate lower interest rates', 'Automate savings']
    };
  }

  static assessRisk(analysis, profileData) {
    const debtRatio = analysis.debtRatio;
    const emergencyFundMonths = profileData.emergencyFundMonths || 0;
    
    return {
      overallRisk: debtRatio > 40 ? 'High' : 
                 debtRatio > 20 ? 'Medium' : 'Low',
      riskFactors: [
        {
          factor: 'Debt-to-Income Ratio',
          level: debtRatio > 40 ? 'High' : debtRatio > 20 ? 'Medium' : 'Low',
          impact: 'Affects borrowing capacity and investment ability'
        },
        {
          factor: 'Emergency Fund',
          level: emergencyFundMonths >= 6 ? 'Adequate' : 'Inadequate',
          impact: 'Financial security during emergencies'
        }
      ],
      recommendations: debtRatio > 30 ? 
        ['Prioritize debt repayment', 'Avoid new loans', 'Consider debt consolidation'] :
        ['Build emergency fund', 'Increase savings rate', 'Start conservative investing']
    };
  }

  static extractKeyInsights(analysis) {
    const insights = [];
    
    if (analysis.savingsRate < 10) {
      insights.push({
        type: 'concern',
        message: 'Savings rate is below recommended 10% of income'
      });
    }
    
    if (analysis.debtRatio > 30) {
      insights.push({
        type: 'warning',
        message: 'High debt-to-income ratio may limit financial flexibility'
      });
    }
    
    if (analysis.canInvest) {
      insights.push({
        type: 'positive',
        message: 'Good financial position to start investing'
      });
    }
    
    return insights;
  }

  static generateActionPlan(analysis) {
    return {
      immediate: analysis.debtRatio > 30 ? 
        ['Pay high-interest debt first', 'Create debt repayment plan'] :
        ['Build emergency fund', 'Set up automatic savings'],
      shortTerm: analysis.canInvest ?
        ['Start SIP in index funds', 'Open demat account'] :
        ['Save 3 months expenses', 'Reduce discretionary spending'],
      longTerm: [
        'Diversify investments', 'Increase investment amount gradually',
        'Review and rebalance portfolio annually'
      ]
    };
  }

  static generateRuleBasedInvestmentReadiness(analysis) {
    const readinessScore = analysis.readinessScore;
    
    const readinessLevel = readinessScore >= 80 ? 'Ready' :
                        readinessScore >= 60 ? 'Almost Ready' :
                        readinessScore >= 40 ? 'Getting Started' : 'Not Ready';

    return {
      isReady: analysis.canInvest,
      readinessScore: readinessScore,
      readinessLevel: readinessLevel,
      recommendation: {
        investmentType: analysis.riskTolerance === 'conservative' ? 'Debt Funds' : 
                       analysis.riskTolerance === 'moderate' ? 'Hybrid Funds' : 'Equity Funds',
        amount: analysis.suggestedInvestmentAmount,
        timeframe: analysis.recommendedTimeframe,
        expectedReturns: analysis.riskTolerance === 'conservative' ? '6-8%' : 
                       analysis.riskTolerance === 'moderate' ? '8-12%' : '12-15%',
        riskLevel: analysis.riskTolerance
      }
    };
  }

  static calculateProfileCompleteness(profileData) {
    const fields = ['income', 'expenses', 'savings', 'debt', 'riskTolerance'];
    const completedFields = fields.filter(field => profileData[field] && profileData[field] !== 0);
    return Math.round((completedFields.length / fields.length) * 100);
  }

  static assessDataQuality(profileData) {
    let score = 100;
    
    if (profileData.income && profileData.income < 1000) score -= 20;
    if (profileData.expenses && profileData.expenses > profileData.income * 1.5) score -= 20;
    if (profileData.savings && profileData.savings > profileData.income) score -= 15;
    
    return Math.max(0, score);
  }

  static getProfileImprovementSuggestions(profileData) {
    const suggestions = [];
    
    if (!profileData.income) suggestions.push('Add income information');
    if (!profileData.expenses) suggestions.push('Track monthly expenses');
    if (!profileData.savings) suggestions.push('Set savings goals');
    if (!profileData.riskTolerance) suggestions.push('Define risk tolerance');
    
    return suggestions;
  }
}

module.exports = SLMService;
