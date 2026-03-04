import { useState } from 'react';
import { AlertCircle, TrendingUp, Target, BarChart3, Zap, RefreshCw } from 'lucide-react';

interface SLMAnalysisData {
  timestamp?: string;
  metrics: {
    expenseRatio: number;
    savingsRate: number;
    debtRatio: number;
    stabilityScore: number;
    riskScore: number;
    readinessScore: number;
  };
  status: {
    overallStatus: string;
    category: string;
    emoji: string;
    canInvest: boolean;
  };
  analysis: {
    overview: string;
    investmentRecommendation: string;
    keyInsights: string[];
  };
  actionPlan?: any[];
  recommendations?: any[];
  riskAssessment?: {
    score: number;
    level: string;
    assessment: string;
    factors: string[];
  };
}

interface SLMAnalysisPageProps {
  analysisData: SLMAnalysisData | null;
  loading?: boolean;
  onRefresh?: () => void;
}

export default function SLMAnalysisPage({
  analysisData,
  loading = false,
  onRefresh
}: SLMAnalysisPageProps) {
  const [expandedSection, setExpandedSection] = useState<string>('metrics');
  const [showFullReport, setShowFullReport] = useState(false);

  if (!analysisData && !loading) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-8">
        <div className="text-center py-12">
          <BarChart3 size={48} className="mx-auto mb-4 text-slate-400" />
          <p className="text-xl text-slate-400">No analysis data available</p>
          <p className="text-sm text-slate-500 mt-2">Complete your profile to generate financial analysis</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-8">
        <div className="text-center py-12">
          <div className="animate-spin inline-block">
            <BarChart3 size={48} className="text-blue-400" />
          </div>
          <p className="text-xl text-slate-300 mt-4">Analyzing your financial profile...</p>
          <p className="text-sm text-slate-500 mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  const data = analysisData!;
  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    healthy: { bg: 'from-emerald-900/30 to-emerald-800/30', text: 'text-emerald-300', border: 'border-emerald-500' },
    caution: { bg: 'from-amber-900/30 to-amber-800/30', text: 'text-amber-300', border: 'border-amber-500' },
    risky: { bg: 'from-red-900/30 to-red-800/30', text: 'text-red-300', border: 'border-red-500' }
  };

  const colors = categoryColors[data.status.category] || categoryColors.caution;

  const getMetricStatus = (metric: string, value: number) => {
    switch (metric) {
      case 'expenseRatio':
        return value <= 50 ? '✅' : value <= 75 ? '⚠️' : '🚨';
      case 'savingsRate':
        return value >= 20 ? '✅' : value >= 10 ? '⚠️' : '🚨';
      case 'debtRatio':
        return value <= 20 ? '✅' : value <= 50 ? '⚠️' : '🚨';
      case 'readinessScore':
        return value >= 60 ? '✅' : value >= 40 ? '⚠️' : '🚨';
      default:
        return '📊';
    }
  };

  const getMetricDescription = (metric: string) => {
    const descriptions: Record<string, string> = {
      expenseRatio: 'Target: 40-50%',
      savingsRate: 'Target: 20%+',
      debtRatio: 'Target: < 20%',
      stabilityScore: 'Target: 6 months',
      readinessScore: '60+ = Ready to Invest',
      riskScore: 'Lower is better'
    };
    return descriptions[metric] || '';
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with Status */}
      <div className={`bg-gradient-to-r ${colors.bg} border-2 ${colors.border} rounded-xl p-8`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-slate-400 mb-2">Your Financial Status</p>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-5xl mr-3">{data.status.emoji}</span>
              {data.status.overallStatus}
            </h1>
            <p className={`text-lg ${colors.text}`}>
              Investment Readiness: {data.metrics.readinessScore}/100
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Analysis Timestamp</p>
            <p className="text-white font-semibold">
              {new Date(data.timestamp || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Financial State</p>
            <p className="text-white font-semibold capitalize">{data.status.category}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Investment Ready</p>
            <p className={`font-semibold text-lg ${data.status.canInvest ? 'text-emerald-400' : 'text-amber-400'}`}>
              {data.status.canInvest ? '✅ Yes' : '⏳ Not Yet'}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics - Collapsible */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'metrics' ? '' : 'metrics')}
          className="w-full p-6 flex items-center justify-between hover:bg-slate-700/50 transition-all"
        >
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 size={28} className="text-blue-400" />
            Key Financial Metrics
          </h2>
          <span className={`text-2xl transition-transform ${expandedSection === 'metrics' ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSection === 'metrics' && (
          <div className="border-t border-slate-700 p-6 bg-slate-900/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Expense Ratio */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 font-semibold">Expense Ratio</p>
                  <span className="text-2xl">{getMetricStatus('expenseRatio', data.metrics.expenseRatio)}</span>
                </div>
                <p className="text-3xl font-bold text-blue-400">{data.metrics.expenseRatio.toFixed(1)}%</p>
                <p className="text-xs text-slate-400 mt-2">{getMetricDescription('expenseRatio')}</p>
              </div>

              {/* Savings Rate */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 font-semibold">Savings Rate</p>
                  <span className="text-2xl">{getMetricStatus('savingsRate', data.metrics.savingsRate)}</span>
                </div>
                <p className="text-3xl font-bold text-emerald-400">{data.metrics.savingsRate.toFixed(1)}%</p>
                <p className="text-xs text-slate-400 mt-2">{getMetricDescription('savingsRate')}</p>
              </div>

              {/* Debt Ratio */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 font-semibold">Debt Ratio</p>
                  <span className="text-2xl">{getMetricStatus('debtRatio', data.metrics.debtRatio)}</span>
                </div>
                <p className="text-3xl font-bold text-amber-400">{data.metrics.debtRatio.toFixed(1)}%</p>
                <p className="text-xs text-slate-400 mt-2">{getMetricDescription('debtRatio')}</p>
              </div>

              {/* Stability Score */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 font-semibold">Stability Score</p>
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-3xl font-bold text-blue-400">{data.metrics.stabilityScore}/100</p>
                <p className="text-xs text-slate-400 mt-2">{getMetricDescription('stabilityScore')}</p>
              </div>

              {/* Risk Score */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 font-semibold">Risk Score</p>
                  <span className="text-2xl">{data.metrics.riskScore > 50 ? '⚠️' : '✅'}</span>
                </div>
                <p className="text-3xl font-bold text-red-400">{data.metrics.riskScore}/100</p>
                <p className="text-xs text-slate-400 mt-2">{getMetricDescription('riskScore')}</p>
              </div>

              {/* Readiness Score */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 font-semibold">Readiness Score</p>
                  <span className="text-2xl">{getMetricStatus('readinessScore', data.metrics.readinessScore)}</span>
                </div>
                <p className="text-3xl font-bold text-emerald-400">{data.metrics.readinessScore}/100</p>
                <p className="text-xs text-slate-400 mt-2">{getMetricDescription('readinessScore')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Zap size={28} className="text-amber-400" />
          Key Insights
        </h2>
        <div className="space-y-3">
          {data.analysis.keyInsights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-slate-700/50 p-4 rounded-lg">
              <span className="text-xl flex-shrink-0">{insight.substring(0, 1)}</span>
              <p className="text-slate-200">{insight.substring(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Overview */}
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-500/50 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <BarChart3 size={28} className="text-blue-400" />
          Financial Analysis Overview
        </h2>
        <p className="text-slate-200 leading-relaxed">{data.analysis.overview}</p>
      </div>

      {/* Investment Recommendation */}
      <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border border-emerald-500/50 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <TrendingUp size={28} className="text-emerald-400" />
          Investment Recommendation
        </h2>
        <p className="text-slate-200 leading-relaxed">{data.analysis.investmentRecommendation}</p>
      </div>

      {/* Action Plan */}
      {data.actionPlan && data.actionPlan.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'actions' ? '' : 'actions')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-700/50 transition-all"
          >
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Target size={28} className="text-amber-400" />
              Action Plan
            </h2>
            <span className={`text-2xl transition-transform ${expandedSection === 'actions' ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSection === 'actions' && (
            <div className="border-t border-slate-700 p-6 bg-slate-900/30 space-y-4">
              {data.actionPlan.map((action, idx) => (
                <div key={idx} className="bg-slate-800/50 border-l-4 border-amber-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl font-bold text-amber-400 flex-shrink-0 w-8">
                      {action.priority}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-white">{action.task}</p>
                      <p className="text-sm text-slate-400 mt-1">{action.reason}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        Target: {action.target} | Timeline: {action.timeline}
                      </p>
                      {action.suggestedMonthlyAmount && (
                        <p className="text-sm text-emerald-400 font-semibold mt-2">
                          💰 ₹{action.suggestedMonthlyAmount.toLocaleString()}/month
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Risk Assessment */}
      {data.riskAssessment && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <AlertCircle size={28} className="text-red-400" />
            Risk Assessment
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-slate-300">Overall Risk Level</p>
                <span className={`font-bold text-lg ${
                  data.riskAssessment.level === 'Low' ? 'text-emerald-400' :
                  data.riskAssessment.level === 'Moderate' ? 'text-amber-400' :
                  'text-red-400'
                }`}>
                  {data.riskAssessment.level}
                </span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    data.riskAssessment.level === 'Low' ? 'bg-emerald-500' :
                    data.riskAssessment.level === 'Moderate' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${(data.riskAssessment.score / 100) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-slate-300 text-sm">{data.riskAssessment.assessment}</p>
            <div>
              <p className="text-slate-400 text-sm font-semibold mb-2">Contributing Factors:</p>
              <div className="space-y-2">
                {data.riskAssessment.factors.map((factor, idx) => (
                  <p key={idx} className="text-sm text-slate-400 flex items-center gap-2">
                    <span className="text-slate-500">•</span> {factor}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Report Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowFullReport(!showFullReport)}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all"
        >
          {showFullReport ? '📄 Hide Full Report' : '📄 View Full Report'}
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-400">
        <p>
          💡 <strong>Disclaimer:</strong> This analysis is based on your financial profile and general financial principles. 
          For personalized investment advice, consult with a certified financial advisor.
        </p>
      </div>
    </div>
  );
}
