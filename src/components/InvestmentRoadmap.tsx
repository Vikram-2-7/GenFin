import { useState } from 'react';
import { AlertCircle, CheckCircle, Zap, Target, BarChart3 } from 'lucide-react';

interface InvestmentPhase {
  phase: number;
  title: string;
  duration: string;
  focus: string;
  allocation: {
    category: string;
    percentage: number;
    description: string;
  }[];
  suggestedProducts: {
    name: string;
    monthlyAmount: number;
    description: string;
  }[];
  expectedReturn: string;
  riskLevel: string;
  riskColor: string;
}

interface RoadmapProps {
  readinessScore: number;
  currentAge: number;
  investmentTimeHorizon: number; // years
  riskTolerance: 'conservative' | 'moderate' | 'growth';
  monthlyInvestmentCapacity: number;
}

export default function InvestmentRoadmap({
  readinessScore = 72,
  currentAge = 28,
  investmentTimeHorizon = 30,
  riskTolerance = 'moderate',
  monthlyInvestmentCapacity = 12000
}: RoadmapProps) {
  const [expandedPhase, setExpandedPhase] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<'allocation' | 'products' | 'timeline'>('allocation');

  // Define investment roadmap based on risk tolerance
  const getRoadmap = (): InvestmentPhase[] => {
    const baseRoadmap = [
      {
        phase: 1,
        title: 'Start Conservative',
        duration: '0-6 months',
        focus: 'Build Foundation & Confidence',
        allocation: [
          { category: 'Large-cap Index Funds', percentage: 40, description: 'Stable growth, low volatility' },
          { category: 'Debt Funds', percentage: 50, description: 'Capital preservation & income' },
          { category: 'Cash/Savings', percentage: 10, description: 'Emergency flexibility' }
        ],
        suggestedProducts: [
          { name: 'Nifty 50 Index Fund SIP', monthlyAmount: 5000, description: 'Core equity exposure' },
          { name: 'Government Bond Fund', monthlyAmount: 6000, description: 'Safe income generation' },
          { name: 'Savings Account', monthlyAmount: 1000, description: 'Liquid emergency buffer' }
        ],
        expectedReturn: '5-7% annually',
        riskLevel: 'LOW',
        riskColor: 'emerald'
      },
      {
        phase: 2,
        title: 'Moderate Growth',
        duration: '6-18 months',
        focus: 'Build Wealth & Diversify',
        allocation: [
          { category: 'Large-cap Equity', percentage: 35, description: 'Stability with growth' },
          { category: 'Mid-cap Equity', percentage: 25, description: 'Growth potential' },
          { category: 'Bonds/Debt', percentage: 30, description: 'Risk management' },
          { category: 'Cash', percentage: 10, description: 'Rebalancing flexibility' }
        ],
        suggestedProducts: [
          { name: 'Balanced Mutual Fund', monthlyAmount: 8000, description: 'All-in-one solution' },
          { name: 'Mid-cap Equity Fund', monthlyAmount: 6000, description: 'Higher growth potential' },
          { name: 'Debt Fund', monthlyAmount: 4000, description: 'Risk mitigation' }
        ],
        expectedReturn: '8-10% annually',
        riskLevel: 'MODERATE',
        riskColor: 'amber'
      },
      {
        phase: 3,
        title: 'Aggressive Growth',
        duration: '18+ months',
        focus: 'Long-term Wealth Creation',
        allocation: [
          { category: 'Large-cap Equity', percentage: 30, description: 'Core holding' },
          { category: 'Mid-cap Equity', percentage: 30, description: 'Growth driver' },
          { category: 'Small-cap Equity', percentage: 15, description: 'High growth opportunity' },
          { category: 'International', percentage: 10, description: 'Global diversification' },
          { category: 'Bonds', percentage: 10, description: 'Safety net' },
          { category: 'REITs/Alternatives', percentage: 5, description: 'Alternative assets' }
        ],
        suggestedProducts: [
          { name: 'Diversified Equity Portfolio', monthlyAmount: 7000, description: 'Multi-cap exposure' },
          { name: 'International Fund', monthlyAmount: 3000, description: 'Currency diversification' },
          { name: 'Small-cap Growth Fund', monthlyAmount: 4000, description: 'High return potential' },
          { name: 'Tax-saving ELSS', monthlyAmount: 5000, description: 'Tax benefit + growth' }
        ],
        expectedReturn: '10-15% annually',
        riskLevel: 'MODERATE-HIGH',
        riskColor: 'orange'
      }
    ];

    // Adjust for risk tolerance
    if (riskTolerance === 'conservative') {
      baseRoadmap[0].allocation[1].percentage = 60;
      baseRoadmap[0].allocation[0].percentage = 30;
      baseRoadmap[1].allocation[1].percentage = 20;
      baseRoadmap[1].allocation[2].percentage = 40;
    } else if (riskTolerance === 'growth' && readinessScore > 75) {
      baseRoadmap[0].allocation[0].percentage = 50;
      baseRoadmap[0].allocation[1].percentage = 40;
    }

    return baseRoadmap;
  };

  const roadmap = getRoadmap();
  const isReadyToInvest = readinessScore >= 60;
  const currentPhase = isReadyToInvest ? (readinessScore >= 75 ? 2 : 1) : 0;

  // Calculate projected portfolio growth
  const getProjectedGrowth = () => {
    const timeline = [];
    const monthlyAmount = monthlyInvestmentCapacity;
    let portfolio = 0;
    let monthCount = 0;
    const returnRate = readinessScore >= 75 ? 0.10 : 0.07; // 10% or 7% annual

    for (let i = 0; i <= 24; i += 3) {
      const monthlyReturnRate = returnRate / 12;
      for (let j = 0; j < 3; j++) {
        portfolio = portfolio * (1 + monthlyReturnRate) + monthlyAmount;
        monthCount++;
      }

      timeline.push({
        month: i,
        portfolio: Math.round(portfolio),
        phase: i < 6 ? 'Phase 1' : i < 18 ? 'Phase 2' : 'Phase 3'
      });
    }

    return timeline;
  };

  const projectedGrowth = getProjectedGrowth();

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'emerald':
        return 'from-emerald-900/30 to-emerald-800/30 border-emerald-500';
      case 'amber':
        return 'from-amber-900/30 to-amber-800/30 border-amber-500';
      case 'orange':
        return 'from-orange-900/30 to-orange-800/30 border-orange-500';
      default:
        return 'from-slate-900 to-slate-800 border-slate-700';
    }
  };

  return (
    <div className="w-full space-y-6 text-white">
      {/* Readiness Status */}
      <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-2 border-blue-500 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">📈 Investment Roadmap</h1>
            <p className="text-slate-300">Your personalized path to wealth building</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 mb-2">Investment Readiness</p>
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-bold text-blue-400">{readinessScore}</p>
              <p className="text-2xl text-slate-400">/100</p>
            </div>
          </div>
        </div>

        {!isReadyToInvest ? (
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
            <p className="flex items-center gap-2 text-amber-200">
              <AlertCircle size={20} />
              You're not quite ready to invest yet. Build your foundation first!
            </p>
          </div>
        ) : (
          <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-lg p-4">
            <p className="flex items-center gap-2 text-emerald-200">
              <CheckCircle size={20} />
              ✅ You're ready to start investing! Follow the phases below.
            </p>
          </div>
        )}
      </div>

      {/* Phase Navigation */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {roadmap.map((phase) => (
          <button
            key={phase.phase}
            onClick={() => setExpandedPhase(phase.phase)}
            className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold transition-all ${
              expandedPhase === phase.phase
                ? `bg-${phase.riskColor}-600 border-2 border-${phase.riskColor}-400`
                : 'bg-slate-700 border-2 border-slate-600 hover:border-slate-500'
            }`}
          >
            Phase {phase.phase}
          </button>
        ))}
      </div>

      {/* Detailed Phase View */}
      {roadmap.map((phase) => (
        <div
          key={phase.phase}
          className={`bg-gradient-to-br ${getRiskColor(phase.riskColor)} border-2 rounded-xl overflow-hidden transition-all ${
            expandedPhase === phase.phase ? 'ring-2 ring-white/20' : 'opacity-75'
          }`}
        >
          <div
            onClick={() => setExpandedPhase(expandedPhase === phase.phase ? -1 : phase.phase)}
            className="p-6 cursor-pointer hover:bg-white/5 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Phase {phase.phase}: {phase.title}
                </h2>
                <div className="flex items-center gap-4 text-slate-400">
                  <p>⏳ {phase.duration}</p>
                  <p>🎯 {phase.focus}</p>
                  <span className={`px-3 py-1 rounded-full bg-${phase.riskColor}-900/50 text-${phase.riskColor}-300 text-sm font-semibold`}>
                    {phase.riskLevel}
                  </span>
                </div>
              </div>
              <span className={`text-3xl transition-transform ${expandedPhase === phase.phase ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
          </div>

          {expandedPhase === phase.phase && (
            <div className="border-t border-white/10 p-6 bg-black/20">
              {/* Tab Selection */}
              <div className="flex gap-2 mb-6 border-b border-slate-700">
                {(['allocation', 'products', 'timeline'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 font-semibold transition-all ${
                      selectedTab === tab
                        ? 'text-white border-b-2 border-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab === 'allocation' && '📊 Asset Allocation'}
                    {tab === 'products' && '💰 Suggested Products'}
                    {tab === 'timeline' && '📈 Timeline'}
                  </button>
                ))}
              </div>

              {/* Asset Allocation */}
              {selectedTab === 'allocation' && (
                <div className="space-y-4">
                  {phase.allocation.map((asset, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <p className="font-semibold">{asset.category}</p>
                        <p className="text-lg font-bold text-blue-400">{asset.percentage}%</p>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          style={{ width: `${asset.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-400">{asset.description}</p>
                    </div>
                  ))}

                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Expected Return</p>
                      <p className="text-2xl font-bold text-emerald-400">{phase.expectedReturn}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Risk Level</p>
                      <p className="text-2xl font-bold text-amber-400">{phase.riskLevel}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Duration</p>
                      <p className="text-2xl font-bold text-blue-400">{phase.duration}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Products */}
              {selectedTab === 'products' && (
                <div className="space-y-4">
                  {phase.suggestedProducts.map((product, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-white">{product.name}</p>
                          <p className="text-sm text-slate-400">{product.description}</p>
                        </div>
                        <p className="text-2xl font-bold text-emerald-400">
                          ₹{product.monthlyAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Monthly SIP / Investment</span>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                    <p className="text-blue-200 font-semibold mb-2">📊 Monthly Investment Required:</p>
                    <p className="text-3xl font-bold text-blue-400">
                      ₹{phase.suggestedProducts.reduce((sum, p) => sum + p.monthlyAmount, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-300 mt-2">
                      You can invest up to ₹{monthlyInvestmentCapacity.toLocaleString()} monthly
                    </p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              {selectedTab === 'timeline' && (
                <div>
                  <div className="relative">
                    {projectedGrowth
                      .filter((item) =>
                        phase.phase === 1
                          ? item.month <= 6
                          : phase.phase === 2
                          ? item.month > 6 && item.month <= 18
                          : item.month > 18
                      )
                      .map((item, idx) => (
                        <div key={idx} className="mb-6 flex gap-4">
                          <div className="w-20 flex-shrink-0">
                            <p className="font-bold text-white">Month {item.month}</p>
                            <p className="text-sm text-slate-400">Milestone</p>
                          </div>
                          <div className="flex-1">
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-white">Total Portfolio Value</p>
                                <p className="text-2xl font-bold text-emerald-400">
                                  ₹{item.portfolio.toLocaleString()}
                                </p>
                              </div>
                              <p className="text-sm text-slate-400">
                                📈 Growth: {((item.portfolio / (monthlyInvestmentCapacity * item.month)) * 100 - 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Key Principles */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Zap size={28} className="text-amber-400" />
          Key Investment Principles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="font-semibold text-white mb-2">✅ Start Early & Stick</p>
            <p className="text-sm text-slate-400">Consistency matters more than amount. Time horizon is your biggest advantage.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="font-semibold text-white mb-2">💰 Regular Investing (SIPs)</p>
            <p className="text-sm text-slate-400">Monthly investments reduce timing risk and benefit from rupee-cost averaging.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="font-semibold text-white mb-2">🎯 Diversification</p>
            <p className="text-sm text-slate-400">Spread investments across asset classes to manage risk and maximize returns.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="font-semibold text-white mb-2">📊 Rebalance Annually</p>
            <p className="text-sm text-slate-400">Review and adjust your portfolio yearly to maintain target allocation.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="font-semibold text-white mb-2">🧠 Stay Disciplined</p>
            <p className="text-sm text-slate-400">Ignore short-term noise. Market volatility is normal. Focus on long-term goals.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="font-semibold text-white mb-2">🎨 Avoid Chasing Returns</p>
            <p className="text-sm text-slate-400">Past performance doesn't guarantee future results. Stick to your plan.</p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 border-2 border-emerald-500 rounded-xl p-6">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Target size={28} className="text-emerald-400" />
          Next Steps
        </h3>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="font-bold text-emerald-400 min-w-[30px]">1.</span>
            <p className="text-slate-200">Open a demat account with a reputable broker</p>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-emerald-400 min-w-[30px]">2.</span>
            <p className="text-slate-200">Set up mutual fund accounts or brokerage for direct stock/ETF investments</p>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-emerald-400 min-w-[30px]">3.</span>
            <p className="text-slate-200">Start with Phase 1 products and invest consistently</p>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-emerald-400 min-w-[30px]">4.</span>
            <p className="text-slate-200">Review your portfolio quarterly and rebalance annually</p>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-emerald-400 min-w-[30px]">5.</span>
            <p className="text-slate-200">Gradually move to next phases as your portfolio grows and comfort increases</p>
          </li>
        </ol>
      </div>
    </div>
  );
}
