import { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export interface FinancialGoal {
  id: string;
  title: string;
  description: string;
  category: 'short-term' | 'medium-term' | 'long-term';
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'on-hold';
}

interface GoalsDashboardProps {
  goals?: FinancialGoal[];
  monthlyCapacity?: number;
  onAddGoal?: (goal: FinancialGoal) => void;
  onUpdateGoal?: (goal: FinancialGoal) => void;
  onDeleteGoal?: (goalId: string) => void;
}

const defaultGoals: FinancialGoal[] = [
  {
    id: '1',
    title: 'Build Emergency Fund',
    description: 'Save 6 months of living expenses',
    category: 'short-term',
    targetAmount: 50000,
    currentAmount: 15000,
    monthlyContribution: 5000,
    targetDate: new Date(2026, 9, 1), // Oct 2026
    priority: 'high',
    status: 'active'
  },
  {
    id: '2',
    title: 'Pay Off Credit Card Debt',
    description: 'Clear all outstanding credit card balances',
    category: 'short-term',
    targetAmount: 25000,
    currentAmount: 10000,
    monthlyContribution: 4000,
    targetDate: new Date(2026, 6, 1), // July 2026
    priority: 'high',
    status: 'active'
  },
  {
    id: '3',
    title: 'Build Investment Portfolio',
    description: 'Start investing for wealth creation',
    category: 'medium-term',
    targetAmount: 200000,
    currentAmount: 0,
    monthlyContribution: 5000,
    targetDate: new Date(2030, 0, 1), // Jan 2030
    priority: 'medium',
    status: 'active'
  },
  {
    id: '4',
    title: 'Save for Wedding',
    description: 'Plan and save for wedding expenses',
    category: 'medium-term',
    targetAmount: 300000,
    currentAmount: 50000,
    monthlyContribution: 3000,
    targetDate: new Date(2033, 11, 1), // Dec 2033
    priority: 'medium',
    status: 'active'
  },
  {
    id: '5',
    title: 'Buy a House',
    description: 'Save for down payment and purchase',
    category: 'long-term',
    targetAmount: 2500000,
    currentAmount: 500000,
    monthlyContribution: 8333,
    targetDate: new Date(2036, 0, 1), // Jan 2036
    priority: 'high',
    status: 'active'
  },
  {
    id: '6',
    title: 'Retirement Corpus',
    description: 'Build corpus for comfortable retirement',
    category: 'long-term',
    targetAmount: 5000000,
    currentAmount: 500000,
    monthlyContribution: 15000,
    targetDate: new Date(2053, 0, 1), // Jan 2053
    priority: 'high',
    status: 'active'
  }
];

export default function FinancialGoalsDashboard({
  goals = defaultGoals,
  monthlyCapacity = 30000,
  onDeleteGoal
}: GoalsDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'short-term' | 'medium-term' | 'long-term'>('all');
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  const filteredGoals = selectedCategory === 'all'
    ? goals
    : goals.filter(g => g.category === selectedCategory);

  const getGoalStatus = (goal: FinancialGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const monthsRemaining = Math.max(0,
      (goal.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
    );
    const onTrack = monthsRemaining > 0 && progress >= (100 - (monthsRemaining / 12) * 10);

    return { progress, monthsRemaining, onTrack };
  };

  const calculateStats = () => {
    const activeGoals = allGoals.filter(g => g.status === 'active');
    const completedGoals = allGoals.filter(g => g.status === 'completed');
    const onTrackGoals = activeGoals.filter(g => getGoalStatus(g).onTrack);
    const needsAttention = activeGoals.filter(g => !getGoalStatus(g).onTrack);

    const totalTarget = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalCurrent = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

    const monthlyNeeded = activeGoals.reduce((sum, g) => sum + g.monthlyContribution, 0);

    return {
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      onTrackGoals: onTrackGoals.length,
      needsAttention: needsAttention.length,
      overallProgress,
      monthlyNeeded,
      canAfford: monthlyNeeded <= monthlyCapacity
    };
  };

  const stats = calculateStats();
  const categoryColors = {
    'short-term': { bg: 'from-emerald-900/30 to-emerald-800/30', border: 'border-emerald-500', text: 'text-emerald-400' },
    'medium-term': { bg: 'from-blue-900/30 to-blue-800/30', border: 'border-blue-500', text: 'text-blue-400' },
    'long-term': { bg: 'from-purple-900/30 to-purple-800/30', border: 'border-purple-500', text: 'text-purple-400' }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'short-term': return '⏱️ Short-term (3-12 months)';
      case 'medium-term': return '📅 Medium-term (1-5 years)';
      case 'long-term': return '🎯 Long-term (5+ years)';
      default: return category;
    }
  };

  return (
    <div className="w-full space-y-6 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-slate-700 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">🎯 Financial Goals Dashboard</h1>
            <p className="text-slate-400">Track your journey to financial freedom</p>
          </div>
          <button
            onClick={() => setShowAddGoal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition-all"
          >
            <Plus size={20} />
            Add Goal
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Overall Progress</p>
            <p className="text-3xl font-bold text-emerald-400">{stats.overallProgress.toFixed(1)}%</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Active Goals</p>
            <p className="text-3xl font-bold text-blue-400">{stats.activeGoals}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">On Track</p>
            <p className="text-3xl font-bold text-emerald-400">{stats.onTrackGoals}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Needs Attention</p>
            <p className="text-3xl font-bold text-amber-400">{stats.needsAttention}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Completed</p>
            <p className="text-3xl font-bold text-purple-400">{stats.completedGoals}</p>
          </div>
        </div>

        {/* Monthly Capacity Warning */}
        {!stats.canAfford && (
          <div className="mt-6 bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
            <p className="flex items-center gap-2 text-amber-200">
              <AlertCircle size={20} />
              Monthly needed (₹{stats.monthlyNeeded.toLocaleString()}) exceeds capacity (₹{monthlyCapacity.toLocaleString()})
            </p>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'short-term', 'medium-term', 'long-term'] as const).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {category === 'all' ? '📊 All Goals' : getCategoryLabel(category)}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.map((goal) => {
          const { progress, monthsRemaining, onTrack } = getGoalStatus(goal);
          const colors = categoryColors[goal.category];
          const isExpanded = expandedGoal === goal.id;

          return (
            <div
              key={goal.id}
              className={`bg-gradient-to-r ${colors.bg} border-2 ${colors.border} rounded-xl overflow-hidden transition-all`}
            >
              {/* Goal Header */}
              <div
                onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                className="p-6 cursor-pointer hover:bg-white/5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{goal.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        goal.priority === 'high' ? 'bg-red-900/50 text-red-300' :
                        goal.priority === 'medium' ? 'bg-amber-900/50 text-amber-300' :
                        'bg-blue-900/50 text-blue-300'
                      }`}>
                        {goal.priority.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        onTrack ? 'bg-emerald-900/50 text-emerald-300' :
                        'bg-amber-900/50 text-amber-300'
                      }`}>
                        {onTrack ? '✅ ON TRACK' : '⚠️ NEEDS ATTENTION'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{goal.description}</p>
                  </div>
                  <span className={`text-3xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-white">
                        ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                      </p>
                      <span className="text-2xl font-bold text-emerald-400">{progress.toFixed(1)}%</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      {monthsRemaining > 0 ? `${Math.round(monthsRemaining)} months remaining` : 'Target date passed'}
                    </p>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${colors.text.replace('text-', 'bg-')}`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm text-slate-400">
                  <p>📅 {goal.targetDate.toLocaleDateString()}</p>
                  <p>💰 ₹{goal.monthlyContribution.toLocaleString()}/month</p>
                  <p>📊 {getCategoryLabel(goal.category)}</p>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-white/10 p-6 bg-black/20 space-y-4">
                  {/* Timeline Breakdown */}
                  <div>
                    <h4 className="font-bold text-white mb-3">Timeline & Breakdown</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <p className="text-slate-400 text-sm">Amount Remaining</p>
                        <p className="text-2xl font-bold text-amber-400">
                          ₹{Math.max(0, goal.targetAmount - goal.currentAmount).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <p className="text-slate-400 text-sm">Monthly Target</p>
                        <p className="text-2xl font-bold text-emerald-400">
                          ₹{goal.monthlyContribution.toLocaleString()}
                        </p>
                        {monthsRemaining > 0 && (
                          <p className="text-xs text-slate-400 mt-1">
                            Required: ₹{(Math.max(0, goal.targetAmount - goal.currentAmount) / monthsRemaining).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <p className="text-slate-400 text-sm">Time Remaining</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {monthsRemaining > 0 ? (
                            <>
                              {Math.floor(monthsRemaining / 12)}y {Math.round(monthsRemaining % 12)}m
                            </>
                          ) : (
                            '⏰ Overdue'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Projection Calculator */}
                  <div>
                    <h4 className="font-bold text-white mb-3">If You Continue Current Contribution</h4>
                    {monthsRemaining > 0 ? (
                      <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-lg p-4">
                        <p className="text-emerald-200">
                          At ₹{goal.monthlyContribution.toLocaleString()}/month, you'll reach your goal in{' '}
                          <strong>
                            {Math.round(Math.max(0, goal.targetAmount - goal.currentAmount) / goal.monthlyContribution)} months
                          </strong>
                        </p>
                        <p className="text-sm text-emerald-300 mt-2">
                          That's {(() => {
                            const months = Math.round(Math.max(0, goal.targetAmount - goal.currentAmount) / goal.monthlyContribution);
                            const years = Math.floor(months / 12);
                            const remainingMonths = months % 12;
                            return years > 0 ? `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : `${months} months`;
                          })()}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
                        <p className="text-purple-200 flex items-center gap-2">
                          <CheckCircle size={20} />
                          🎉 You've completed this goal!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all">
                      <Edit2 size={18} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteGoal && onDeleteGoal(goal.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <p className="text-xl text-slate-400 mb-4">No goals in this category yet</p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold"
          >
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">💡 Tips for Goal Achievement</h3>
        <div className="space-y-3 text-slate-300 text-sm">
          <p>• <strong>Start with short-term goals</strong> - Build momentum and confidence</p>
          <p>• <strong>Break big goals into milestones</strong> - Track progress frequently</p>
          <p>• <strong>Automate contributions</strong> - Set up automatic transfers to stay consistent</p>
          <p>• <strong>Review monthly</strong> - Adjust contributions or timelines as needed</p>
          <p>• <strong>Celebrate wins</strong> - Acknowledge completed goals and use that motivation</p>
          <p>• <strong>Stay realistic</strong> - Make sure goals align with your income and expenses</p>
        </div>
      </div>
    </div>
  );
}
