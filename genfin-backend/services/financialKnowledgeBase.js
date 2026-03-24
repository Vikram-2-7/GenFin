/**
 * Financial Knowledge Base
 * 
 * Structured domain knowledge for financial analysis
 * Improves decision quality and provides context for natural language generation
 */

const financialKnowledgeBase = {
  // Financial Health Thresholds
  thresholds: {
    savingsRate: {
      critical: { max: 0.05, label: 'Critical', priority: 'urgent' },
      low: { max: 0.10, label: 'Low', priority: 'high' },
      moderate: { max: 0.20, label: 'Moderate', priority: 'medium' },
      good: { max: 0.30, label: 'Good', priority: 'low' },
      excellent: { min: 0.30, label: 'Excellent', priority: 'none' }
    },
    expenseRatio: {
      dangerous: { min: 0.85, label: 'Dangerous', priority: 'critical' },
      high: { max: 0.85, min: 0.70, label: 'High', priority: 'high' },
      moderate: { max: 0.70, min: 0.50, label: 'Moderate', priority: 'medium' },
      healthy: { max: 0.50, label: 'Healthy', priority: 'low' }
    },
    debtRatio: {
      dangerous: { min: 0.8, label: 'Dangerous', priority: 'critical' },
      high: { max: 0.8, min: 0.5, label: 'High', priority: 'high' },
      moderate: { max: 0.5, min: 0.2, label: 'Moderate', priority: 'medium' },
      low: { max: 0.2, label: 'Low', priority: 'none' }
    },
    emergencyFund: {
      insufficient: { max: 1, label: 'Insufficient', priority: 'critical' },
      minimal: { max: 3, min: 1, label: 'Minimal', priority: 'high' },
      adequate: { max: 6, min: 3, label: 'Adequate', priority: 'low' },
      optimal: { min: 6, label: 'Optimal', priority: 'none' }
    }
  },

  // Financial States
  financialStates: {
    healthy: {
      id: 'healthy',
      name: 'Stable & Investment Ready',
      color: 'emerald',
      description: 'Strong financial foundation with healthy metrics across all indicators',
      displayEmoji: '🟢',
      conditions: {
        savingsRate: '≥ 20%',
        emergencyFund: '≥ 6 months',
        expenseRatio: '≤ 50%',
        debtRatio: '≤ 20%'
      },
      priorityActions: [
        'Maximize investment contributions',
        'Build diversified portfolio',
        'Plan for long-term wealth growth',
        'Consider tax optimization strategies'
      ]
    },
    caution: {
      id: 'caution',
      name: 'Moderate Health - Improve Before Investing',
      color: 'amber',
      description: 'On the right track but needs strengthening in key areas',
      displayEmoji: '🟡',
      conditions: {
        savingsRate: '≥ 10%',
        emergencyFund: '≥ 3 months',
        expenseRatio: '≤ 75%'
      },
      priorityActions: [
        'Increase emergency fund to 6 months',
        'Reduce unnecessary expenses',
        'Accelerate debt payoff',
        'Build savings buffer before major investments'
      ]
    },
    risky: {
      id: 'risky',
      name: 'Financial Risk Zone',
      color: 'red',
      description: 'Financial foundation needs immediate attention',
      displayEmoji: '🔴',
      conditions: {
        savingsRate: '< 10%',
        emergencyFund: '< 3 months',
        expenseRatio: '> 75%'
      },
      priorityActions: [
        'Create emergency fund immediately',
        'Cut discretionary spending',
        'Address high-interest debt',
        'Avoid new investments until stabilized'
      ]
    }
  },

  // Investment Readiness Criteria
  investmentReadiness: {
    notReady: {
      scoreRange: [0, 40],
      label: 'Not Ready',
      actions: ['Build emergency fund', 'Reduce debt', 'Save initial capital'],
      recommendedProducts: []
    },
    considerDelay: {
      scoreRange: [40, 60],
      label: 'Consider Delay',
      actions: ['Strengthen fundamentals', 'Save 3-6 months', 'Plan strategy'],
      recommendedProducts: ['High-yield savings', 'Fixed deposits']
    },
    readyConservative: {
      scoreRange: [60, 75],
      label: 'Ready (Conservative)',
      actions: ['Start small', 'Low-risk options', 'Diversify gradually'],
      recommendedProducts: ['Debt funds', 'SIPs in large-cap funds', 'Government securities', 'Corporate bonds']
    },
    readyAggressive: {
      scoreRange: [75, 100],
      label: 'Ready (Aggressive)',
      actions: ['Diversify portfolio', 'Consider growth assets', 'Plan long-term'],
      recommendedProducts: ['Equity funds', 'Index funds', 'Mid-cap funds', 'International diversification', 'REITs']
    }
  },

  // Context-Specific Recommendations
  recommendations: {
    savingsRate: {
      veryLow: {
        trigger: (rate) => rate < 5,
        message: 'Your savings rate is exceptionally low. This means you\'re living paycheck to paycheck.',
        actionItems: [
          'Track all expenses for 2 weeks to identify savings opportunities',
          'Start with a 5% savings target - even small amounts compound over time',
          'Automate transfers to savings on payday'
        ],
        timeline: '1-2 months to see initial improvements'
      },
      low: {
        trigger: (rate) => rate >= 5 && rate < 15,
        message: 'You\'re saving but below recommended levels. Increasing savings will accelerate wealth building.',
        actionItems: [
          'Identify 3-5 discretionary expenses to reduce',
          'Set a realistic 15% savings target',
          'Review subscriptions and recurring costs'
        ],
        timeline: '2-3 months to reach 15% savings'
      },
      moderate: {
        trigger: (rate) => rate >= 15 && rate < 25,
        message: 'Good savings habits! You\'re building wealth at a solid pace.',
        actionItems: [
          'Consider pushing towards 20-25% for accelerated growth',
          'Diversify where your savings are allocated',
          'Review investment options if emergency fund is adequate'
        ],
        timeline: 'Continue and gradually increase'
      },
      excellent: {
        trigger: (rate) => rate >= 25,
        message: 'Exceptional savings rate! You\'re well on track for financial independence.',
        actionItems: [
          'Maximize tax-advantaged investment accounts',
          'Consider diversified investment strategy',
          'Plan for medium to long-term wealth goals'
        ],
        timeline: 'Focus on strategic allocation'
      }
    },
    debtManagement: {
      highDebt: {
        trigger: (ratio) => ratio > 0.5,
        message: 'Your debt burden is significantly impacting financial health.',
        actionItems: [
          'Create aggressive debt payoff plan',
          'Prioritize high-interest debt first (avalanche method)',
          'Negotiate lower interest rates if possible',
          'Consider debt consolidation'
        ],
        timeline: '12-18 months for meaningful reduction'
      },
      moderateDebt: {
        trigger: (ratio) => ratio >= 0.2 && ratio <= 0.5,
        message: 'Debt is manageable but requires attention.',
        actionItems: [
          'Continue regular payments plus extra when possible',
          'Avoid taking on additional debt',
          'Plan payoff timeline'
        ],
        timeline: '6-12 months to reduce further'
      },
      lowDebt: {
        trigger: (ratio) => ratio < 0.2,
        message: 'Your debt is well-managed and not limiting your options.',
        actionItems: [
          'Continue current repayment schedule',
          'Focus on building investment portfolio',
          'Consider whether maintaining low-interest debt makes sense'
        ]
      }
    },
    emergencyFund: {
      nonexistent: {
        trigger: (months) => months < 0.5,
        message: 'You don\'t have a safety net. One unexpected expense could derail your finances.',
        actionItems: [
          'Start with $500-$1000 as initial emergency fund',
          'Build to 1 month of expenses first',
          'Keep in accessible, liquid account',
          'Set automatic transfers'
        ],
        timeline: '2-3 months to reach 1 month'
      },
      insufficient: {
        trigger: (months) => months >= 0.5 && months < 3,
        message: 'You have some safety net, but it\'s not adequate for most situations.',
        actionItems: [
          'Target 3-6 months of living expenses',
          'Increase contributions when possible',
          'Keep separate from regular spending account'
        ],
        timeline: '3-6 months to reach 3 months'
      },
      adequate: {
        trigger: (months) => months >= 3 && months < 6,
        message: 'Good emergency buffer. Continue building to optimal level.',
        actionItems: [
          'Target full 6 months',
          'Review allocation once at 6 months',
          'Can start investing surplus'
        ],
        timeline: '2-3 months to reach 6 months'
      },
      optimal: {
        trigger: (months) => months >= 6,
        message: 'Excellent emergency fund coverage. You have strong financial security.',
        actionItems: [
          'Maintain this level for ongoing security',
          'Invest surplus funds',
          'Feel confident making strategic financial moves'
        ]
      }
    }
  },

  // Investment Principles
  investmentPrinciples: [
    'Don\'t invest money you might need within 5 years',
    'Build emergency fund before investing',
    'Start with low-cost index funds for broad diversification',
    'Invest consistently through SIPs to average out market volatility',
    'Higher risk tolerance should match longer time horizons',
    'Avoid concentrating investments in a single asset',
    'Review and rebalance portfolio annually',
    'Ignore short-term market noise and focus on long-term growth',
    'Tax-efficient investing can significantly boost returns',
    'Diversification across asset classes reduces risk'
  ],

  // Risk Profiles
  riskProfiles: {
    conservative: {
      name: 'Conservative',
      emoji: '🛡️',
      description: 'Prioritize capital preservation over growth',
      assetAllocation: { debt: 70, equity: 20, cash: 10 },
      recommendedProducts: [
        'Government securities',
        'Fixed deposits',
        'Debt mutual funds',
        'High-grade bonds'
      ],
      expectedReturn: '5-7% annually',
      volatility: 'Low'
    },
    moderate: {
      name: 'Moderate',
      emoji: '⚖️',
      description: 'Balance growth potential with downside protection',
      assetAllocation: { debt: 50, equity: 40, cash: 10 },
      recommendedProducts: [
        'Index funds',
        'Balanced funds',
        'Blue-chip stocks',
        'Bonds',
        'REITs'
      ],
      expectedReturn: '8-10% annually',
      volatility: 'Moderate'
    },
    growth: {
      name: 'Growth-Focused',
      emoji: '📈',
      description: 'Maximize long-term wealth through higher risk exposure',
      assetAllocation: { debt: 20, equity: 70, cash: 10 },
      recommendedProducts: [
        'Equity mutual funds',
        'Index funds',
        'Growth stocks',
        'Small-cap funds',
        'Emerging markets'
      ],
      expectedReturn: '10-15% annually',
      volatility: 'High'
    }
  },

  // Life Stage Priorities
  lifeStages: {
    youngAggressive: {
      ageRange: '18-30',
      priority: 'Build wealth, invest for growth',
      considerations: 'Long time horizon, can weather market volatility',
      focus: ['Maximize savings', 'Invest in equities', 'Build skills/education']
    },
    earlyCareer: {
      ageRange: '30-45',
      priority: 'Balance growth with stability',
      considerations: 'Likely earning peak years, major expenses may occur',
      focus: ['Diversify investments', 'Plan major purchases', 'Increase savings']
    },
    preRetirement: {
      ageRange: '45-60',
      priority: 'Preserve wealth, plan retirement',
      considerations: 'Shorter time horizon, risk capacity decreases',
      focus: ['De-risk portfolio', 'Plan retirement income', 'Tax optimization']
    },
    retirement: {
      ageRange: '60+',
      priority: 'Preserve capital, generate income',
      considerations: 'Capital preservation critical',
      focus: ['Income generation', 'Healthcare costs', 'Estate planning']
    }
  },

  // Financial Metrics Context
  metricsContext: {
    expenseRatio: {
      definition: 'Monthly expenses as a percentage of income',
      ideal: '40-50%',
      warning: '> 70%',
      critical: '> 85%',
      implications: 'Shows spending discipline; directly impacts savings capacity'
    },
    savingsRate: {
      definition: 'Percentage of income saved each month',
      ideal: '20%+',
      warning: '< 10%',
      critical: '< 5%',
      implications: 'Primary driver of wealth accumulation; compound growth foundation'
    },
    debtToIncomeRatio: {
      definition: 'Total annual debt relative to annual income',
      ideal: '< 20%',
      warning: '20-50%',
      critical: '> 50%',
      implications: 'Shows debt burden; affects borrowing capacity and financial flexibility'
    },
    emergencyFundMonths: {
      definition: 'Months of living expenses saved in liquid accounts',
      ideal: '6 months',
      minimum: '3 months',
      critical: '< 1 month',
      implications: 'Safety net for job loss, medical emergency, or unexpected costs'
    }
  },

  // Common Financial Mistakes to Avoid
  commonMistakes: [
    {
      mistake: 'Investing without emergency fund',
      impact: 'Forced liquidation during crisis at losses',
      solution: 'Build 3-6 months emergency fund first'
    },
    {
      mistake: 'Chasing high returns',
      impact: 'High risk of losses, poor long-term results',
      solution: 'Focus on consistent, diversified investing'
    },
    {
      mistake: 'Lifestyle inflation',
      impact: 'Savings rate drops as income increases',
      solution: 'Save incremental income increases'
    },
    {
      mistake: 'Ignoring fees and taxes',
      impact: 'Significant wealth leakage over time',
      solution: 'Choose low-cost, tax-efficient investments'
    },
    {
      mistake: 'Over-concentration in single investment',
      impact: 'Vulnerability to sector-specific downturns',
      solution: 'Diversify across asset classes and sectors'
    },
    {
      mistake: 'Panic selling during downturns',
      impact: 'Locks in losses, misses recovery',
      solution: 'Maintain long-term perspective, stick to plan'
    }
  ]
};

module.exports = financialKnowledgeBase;
