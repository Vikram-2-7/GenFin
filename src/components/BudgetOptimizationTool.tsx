import { useState, useMemo } from 'react';
import { TrendingDown, AlertCircle, CheckCircle, Target } from 'lucide-react';

interface BudgetItem {
  category: string;
  amount: number;
  recommended: number;
  priority: 'low' | 'medium' | 'high';
}

interface BudgetOptimizationProps {
  income: number;
  expenses: {
    housing?: number;
    food?: number;
    transport?: number;
    entertainment?: number;
    utilities?: number;
    other?: number;
  };
  onOptimizationSave?: (optimizedBudget: any) => void;
}

export default function BudgetOptimizationTool({ 
  income = 50000, 
  expenses = {},
  onOptimizationSave 
}: BudgetOptimizationProps) {
  const defaultExpenses = {
    housing: expenses.housing || 15000,
    food: expenses.food || 8000,
    transport: expenses.transport || 5000,
    entertainment: expenses.entertainment || 3000,
    utilities: expenses.utilities || 2000,
    other: expenses.other || 17000
  };

  const [budgetItems, setBudgetItems] = useState<Record<string, BudgetItem>>({
    housing: {
      category: 'Housing',
      amount: defaultExpenses.housing,
      recommended: Math.min(defaultExpenses.housing * 1.1, income * 0.3),
      priority: 'low'
    },
    food: {
      category: 'Food & Groceries',
      amount: defaultExpenses.food,
      recommended: income * 0.15,
      priority: 'medium'
    },
    transport: {
      category: 'Transportation',
      amount: defaultExpenses.transport,
      recommended: income * 0.1,
      priority: 'medium'
    },
    entertainment: {
      category: 'Entertainment',
      amount: defaultExpenses.entertainment,
      recommended: income * 0.05,
      priority: 'high'
    },
    utilities: {
      category: 'Utilities & Bills',
      amount: defaultExpenses.utilities,
      recommended: income * 0.05,
      priority: 'low'
    },
    other: {
      category: 'Other',
      amount: defaultExpenses.other,
      recommended: income * 0.1,
      priority: 'high'
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate totals
  const totalExpenses = useMemo(
    () => Object.values(budgetItems).reduce((sum, item) => sum + item.amount, 0),
    [budgetItems]
  );

  const targetSavingsRate = 0.2; // 20% savings target
  const targetSavings = income * targetSavingsRate;
  const currentSavings = Math.max(0, income - totalExpenses);

  // Calculate optimization savings
  const optimizationSavings = useMemo(() => {
    return Object.entries(budgetItems).map(([key, item]) => {
      const overage = Math.max(0, item.amount - item.recommended);
      return {
        category: item.category,
        key,
        currentAmount: item.amount,
        recommended: item.recommended,
        potential: overage,
        priority: item.priority
      };
    });
  }, [budgetItems]);

  const totalPotentialSavings = optimizationSavings.reduce((sum, item) => sum + item.potential, 0);
  const optimizedSavings = currentSavings + totalPotentialSavings;

  // Get recommendations
  const recommendations = optimizationSavings
    .filter(item => item.potential > 0)
    .sort((a, b) => b.potential - a.potential)
    .slice(0, 5);

  const handleAmountChange = (category: string, newAmount: number) => {
    setBudgetItems(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        amount: Math.max(0, newAmount)
      }
    }));
  };

  const handleOptimize = () => {
    const optimizedBudget = Object.entries(budgetItems).reduce(
      (acc, [key, item]) => ({
        ...acc,
        [key]: Math.max(item.recommended, item.amount * 0.9) // At least 90% of current
      }),
      {}
    );

    setBudgetItems(prev =>
      Object.entries(prev).reduce((acc, [key, item]) => ({
        ...acc,
        [key]: {
          ...item,
          amount: optimizedBudget[key]
        }
      }), {})
    );

    if (onOptimizationSave) {
      onOptimizationSave(optimizedBudget);
    }
  };

  const getProgressColor = (ratio: number) => {
    if (ratio <= 0.4) return 'bg-emerald-500';
    if (ratio <= 0.6) return 'bg-blue-500';
    if (ratio <= 0.8) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (category: string) => {
    const item = budgetItems[category];
    if (item.amount <= item.recommended) return '✅';
    if (item.amount > item.recommended * 1.2) return '⚠️';
    return '📊';
  };

  const expenseRatio = (totalExpenses / income) * 100;
  const savingsRate = (currentSavings / income) * 100;
  const optimizedSavingsRate = (optimizedSavings / income) * 100;

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">💰 Budget Optimization</h2>
        <p className="text-slate-400">Optimize spending and maximize savings potential</p>
      </div>

      {/* Income Overview */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-slate-400 text-sm">Monthly Income</p>
            <p className="text-2xl font-bold text-emerald-400">₹{income.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Current Savings</p>
            <p className={`text-2xl font-bold ${currentSavings > 0 ? 'text-blue-400' : 'text-red-400'}`}>
              ₹{currentSavings.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-1">{savingsRate.toFixed(1)}% of income</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Optimized Potential</p>
            <p className="text-2xl font-bold text-amber-400">
              ₹{optimizedSavings.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-1">{optimizedSavingsRate.toFixed(1)}% of income</p>
          </div>
        </div>
      </div>

      {/* Expense Categories */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingDown size={24} />
          Expense Breakdown
        </h3>

        <div className="space-y-4">
          {Object.entries(budgetItems).map(([key, item]) => {
            const ratio = item.amount / income;
            const recommended = item.recommended / income;
            const overage = Math.max(0, item.amount - item.recommended);

            return (
              <div
                key={key}
                onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                className={`bg-slate-800/50 border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedCategory === key
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getStatusIcon(key)}</span>
                    <div>
                      <p className="font-semibold">{item.category}</p>
                      <p className="text-xs text-slate-400">
                        Current: ₹{item.amount.toLocaleString()} ({(ratio * 100).toFixed(1)}%) | 
                        Target: ₹{item.recommended.toLocaleString()} ({(recommended * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                  {overage > 0 && (
                    <div className="text-right">
                      <p className="text-amber-400 font-semibold">+₹{overage.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">can reduce</p>
                    </div>
                  )}
                </div>

                {/* Progress Bars */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {/* Current Spending */}
                    <div className="flex-1">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(ratio)}`}
                          style={{ width: `${Math.min(100, ratio * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Current</p>
                    </div>

                    {/* Recommended */}
                    <div className="flex-1">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${Math.min(100, recommended * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Target</p>
                    </div>
                  </div>
                </div>

                {/* Expandable Details */}
                {selectedCategory === key && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-slate-400 block mb-2">
                          Adjust Current Amount:
                        </label>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleAmountChange(key, parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                        />
                      </div>
                      {overage > 0 && (
                        <div className="bg-amber-900/30 border border-amber-500/50 rounded p-3">
                          <p className="text-sm text-amber-200">
                            💡 Consider reducing by ₹{overage.toLocaleString()} to reach target
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Total Expenses */}
        <div className="mt-6 bg-slate-700/50 border border-slate-600 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400">Total Monthly Expenses</p>
              <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${expenseRatio > 80 ? 'text-red-400' : 'text-blue-400'}`}>
                {expenseRatio.toFixed(1)}%
              </p>
              <p className="text-xs text-slate-400">of income</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={24} />
            Top Optimization Opportunities
          </h3>

          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={rec.key} className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl font-bold text-amber-400 min-w-[40px]">#{idx + 1}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-200">{rec.category}</p>
                    <p className="text-sm text-amber-300">
                      Current: ₹{rec.currentAmount.toLocaleString()} → Target: ₹{rec.recommended.toLocaleString()}
                    </p>
                    <p className="text-sm text-amber-400 font-semibold mt-1">
                      💰 Save ₹{rec.potential.toLocaleString()}/month
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
            <p className="text-green-200 font-semibold mb-2">
              Total Potential Savings: ₹{totalPotentialSavings.toLocaleString()}/month
            </p>
            <p className="text-green-300 text-sm">
              From {savingsRate.toFixed(1)}% to {optimizedSavingsRate.toFixed(1)}% savings rate
            </p>
          </div>
        </div>
      )}

      {/* Savings Progress */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target size={24} />
          Savings Target Progress
        </h3>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="space-y-4">
            {/* Current Savings */}
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-slate-300">Current Monthly Savings</p>
                <p className={`font-bold ${currentSavings > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  ₹{currentSavings.toLocaleString()} ({savingsRate.toFixed(1)}%)
                </p>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${Math.min(100, (currentSavings / targetSavings) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* After Optimization */}
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-slate-300">After Optimization</p>
                <p className="font-bold text-emerald-400">
                  ₹{optimizedSavings.toLocaleString()} ({optimizedSavingsRate.toFixed(1)}%)
                </p>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${Math.min(100, (optimizedSavings / targetSavings) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Target (20%) */}
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-slate-300">Target Savings (20%)</p>
                <p className="font-bold text-amber-400">₹{targetSavings.toLocaleString()}</p>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-6">
            {optimizedSavingsRate >= 20 ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle size={20} />
                <p className="font-semibold">
                  ✅ You can reach 20% savings rate with optimization!
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-400">
                <AlertCircle size={20} />
                <p className="font-semibold">
                  ⏳ {((targetSavings - optimizedSavings) / totalPotentialSavings * 12).toFixed(0)} months to target with discipline
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleOptimize}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all"
        >
          ✨ Apply Optimization
        </button>
        <button
          onClick={() => setBudgetItems({ ...budgetItems })}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-all"
        >
          📊 Reset
        </button>
      </div>
    </div>
  );
}
