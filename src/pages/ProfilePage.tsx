import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, Lock, Bell, HelpCircle, CheckCircle, Zap } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";

function ProfilePage() {
  const analyzeFinancialHealth = (data: {
    income: number;
    expenses: number;
    savings: number;
    debt: number;
    emergencyFundMonths: number;
  }) => {
  // convert inputs to local variables for clarity
  const income = data.income;
  const expenses = data.expenses;
  const savings = data.savings;
  const debt = data.debt;
  const emergencyMonths = data.emergencyFundMonths;

  // basic ratios
  const expenseRatio = income > 0 ? expenses / income : 1; // higher means more of income is eaten
  const savingsRate = income > 0 ? savings / income : 0; // portion saved each month
  const debtRatio = income > 0 ? debt / (income * 12) : 1; // annual debt burden relative to income

  // stability takes into account emergency fund relative to recommended 6 months
  const stabilityScore = Math.min(100, (emergencyMonths / 6) * 100);

  // riskScore penalises large expense ratio and high debt
  // each component is capped at 100; lower expense and debt give a lower risk
  const expenseComponent = Math.min(100, expenseRatio * 200); // 50% expense -> 100 points
  const debtComponent = Math.min(100, debtRatio * 100); // 0.2 debt ratio -> 20 points
  const riskScore = Math.round((expenseComponent + debtComponent) / 2);

  // readiness blends stability, inverse of risk and savings rate
  const readinessScore = Math.round(
    (stabilityScore + (100 - riskScore) + savingsRate * 100) / 3
  );

  // determine descriptive status and recommendation using precise thresholds
  let status = "";
  let recommendation = "";
  let stateCategory = ""; // added for clearer classification
  let canInvest = false;

  if (
    savingsRate >= 0.2 &&
    emergencyMonths >= 6 &&
    expenseRatio <= 0.5 &&
    debtRatio <= 0.2
  ) {
    stateCategory = "healthy";
    status = "Stable & Investing Ready";
    recommendation =
      "Your emergency fund is solid and expenses are well under control. You can start allocating surplus towards diversified investments (index funds, SIPs, etc.).";
    canInvest = true;
  } else if (
    savingsRate >= 0.1 &&
    emergencyMonths >= 3 &&
    expenseRatio <= 0.75
  ) {
    stateCategory = "caution";
    status = "Moderate Health, Improve Before Investing";
    recommendation =
      "You're on the right track but build your emergency buffer and reduce spending/debt before taking on new investment risk.";
  } else {
    stateCategory = "risky";
    status = "Financial Risk Zone";
    recommendation =
      "Focus first on emergency savings and cutting expenses or paying down debt. Avoid investing until your basics are secure.";
  }

  return {
    expenseRatio: (expenseRatio * 100).toFixed(1),
    savingsRate: (savingsRate * 100).toFixed(1),
    debtRatio: (debtRatio * 100).toFixed(1),
    stabilityScore: Math.round(stabilityScore),
    riskScore: Math.round(riskScore),
    readinessScore: Math.round(readinessScore),
    status,
    recommendation,
    stateCategory,
    canInvest
  };
};

  const generateDynamicFeedback = (result: any) => {
    const expRatio = parseFloat(result.expenseRatio);
    const savRate = parseFloat(result.savingsRate);
    const debtRatio = parseFloat(result.debtRatio);
    const stability = result.stabilityScore;
    const risk = result.riskScore;
    const readiness = result.readinessScore;

    const feedbacks = [];

    // SAVINGS FEEDBACK
    if (savRate < 5) {
      feedbacks.push({
        feedbackType: 'warning',
        icon: '⚠️',
        title: 'Savings Rate Critical',
        message: `You're saving only ${savRate}% of income. Aim for at least 10-15% monthly savings to build financial security.`
      });
    } else if (savRate < 10) {
      feedbacks.push({
        feedbackType: 'caution',
        icon: '📊',
        title: 'Increase Your Savings',
        message: `Savings rate is ${savRate}%. Consider cutting non-essential expenses to reach 15-20% savings monthly.`
      });
    } else if (savRate < 20) {
      feedbacks.push({
        feedbackType: 'success',
        icon: '✅',
        title: 'Solid Savings Habit',
        message: `Great! You're saving ${savRate}% monthly. This is a healthy foundation for wealth building.`
      });
    } else {
      feedbacks.push({
        feedbackType: 'success',
        icon: '⭐',
        title: 'Exceptional Savings Rate',
        message: `Outstanding! Saving ${savRate}% monthly puts you ahead of most. You're on track for rapid wealth growth.`
      });
    }

    // EXPENSE FEEDBACK
    if (expRatio > 85) {
      feedbacks.push({
        feedbackType: 'critical',
        icon: '🚨',
        title: 'Overspending Alert',
        message: `Expenses consume ${expRatio}% of income—unsustainable. Cut discretionary spending immediately or risk debt.`
      });
    } else if (expRatio > 70) {
      feedbacks.push({
        feedbackType: 'warning',
        icon: '⚠️',
        title: 'High Expense Burden',
        message: `At ${expRatio}% of income, expenses are too high. Review budget and identify areas to trim 10-15%.`
      });
    } else if (expRatio > 50) {
      feedbacks.push({
        feedbackType: 'caution',
        icon: '📊',
        title: 'Expense Control Needed',
        message: `Expenses at ${expRatio}% are manageable but could be optimized. Aim for 40-50% to boost savings.`
      });
    } else {
      feedbacks.push({
        feedbackType: 'success',
        icon: '✅',
        title: 'Excellent Expense Control',
        message: `Keeping expenses to ${expRatio}% of income shows strong discipline. This leaves room for savings & investments.`
      });
    }

    // DEBT FEEDBACK
    if (debtRatio > 0.8) {
      feedbacks.push({
        feedbackType: 'critical',
        icon: '🚨',
        title: 'Dangerous Debt Level',
        message: `Debt is ${debtRatio}x your annual income—urgent priority. Focus entirely on debt payoff before investing.`
      });
    } else if (debtRatio > 0.5) {
      feedbacks.push({
        feedbackType: 'warning',
        icon: '⚠️',
        title: 'High Debt Burden',
        message: `Debt ratio of ${debtRatio}x annual income is heavy. Make aggressive repayment your priority over investments.`
      });
    } else if (debtRatio > 0.2) {
      feedbacks.push({
        feedbackType: 'caution',
        icon: '📊',
        title: 'Moderate Debt—Manage Carefully',
        message: `Debt at ${debtRatio}x income is manageable. Keep paying down while building emergency fund.`
      });
    } else {
      feedbacks.push({
        feedbackType: 'success',
        icon: '✅',
        title: 'Debt Under Control',
        message: `Excellent! Debt ratio of ${debtRatio}x is low. You're well-positioned to invest in your future.`
      });
    }

    // EMERGENCY FUND FEEDBACK
    if (stability < 25) {
      feedbacks.push({
        feedbackType: 'critical',
        icon: '🚨',
        title: 'Build Emergency Fund Urgently',
        message: `You have less than 1.5 months of expenses saved. Start with 3-6 months coverage before any investing.`
      });
    } else if (stability < 50) {
      feedbacks.push({
        feedbackType: 'warning',
        icon: '⚠️',
        title: 'Emergency Fund Growing',
        message: `Currently ${(Math.round(stability / 100 * 6) || 1)} months of coverage. Build toward 6 months before investing heavily.`
      });
    } else if (stability < 100) {
      feedbacks.push({
        feedbackType: 'success',
        icon: '✅',
        title: 'Solid Emergency Buffer',
        message: `You have ${Math.round(stability / 100 * 6)} months of expenses saved. Good safety net for life's surprises.`
      });
    } else {
      feedbacks.push({
        feedbackType: 'success',
        icon: '⭐',
        title: 'Full Emergency Fund Complete',
        message: `Perfect! 6+ months of expenses saved. Now you can confidently invest the surplus.`
      });
    }

    // INVESTMENT READINESS FEEDBACK
    if (readiness < 40) {
      feedbacks.push({
        feedbackType: 'critical',
        icon: '❌',
        title: 'Not Ready to Invest',
        message: `Readiness score ${readiness}/100 indicates foundational work needed first. Master budgeting & emergency savings.`
      });
    } else if (readiness < 60) {
      feedbacks.push({
        feedbackType: 'caution',
        icon: '⏳',
        title: 'Consider Investment Delay',
        message: `Readiness of ${readiness}/100 suggests you should strengthen fundamentals. Give it 3-6 months, then reassess.`
      });
    } else if (readiness < 75) {
      feedbacks.push({
        feedbackType: 'success',
        icon: '✅',
        title: 'Ready for Conservative Investing',
        message: `With readiness at ${readiness}/100, you can start small investments. Try low-risk options first (debt funds, SIPs).`
      });
    } else {
      feedbacks.push({
        feedbackType: 'success',
        icon: '🚀',
        title: 'Excellent Investment Readiness',
        message: `Readiness score of ${readiness}/100 shows you're well-prepared. Diversify into stocks, index funds, and long-term growth plans.`
      });
    }

    return feedbacks;
  };
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    age: '',
    income: '',
    expenses: '',
    savings: '',
    debt: '',
    emergencyFundMonths: '',
    riskTolerance: '',
    goal: '',
    timeHorizon: ''
  });

  // parent/guardian info for minor users
  const [parentData, setParentData] = useState({
    name: '',
    relation: '',
    phone: '',
    email: ''
  });

  // derived flag indicates entered age is under 18
  const isMinor = Number(formData.age) < 18 && formData.age !== '';

  // toggled when the user hits analyze and age is minor
  const [showParentMode, setShowParentMode] = useState(false);


  const [result, setResult] = useState<{
    expenseRatio: string;
    savingsRate: string;
    debtRatio: string;
    stabilityScore: number;
    riskScore: number;
    readinessScore: number;
    status: string;
    recommendation: string;
    stateCategory: string;
    canInvest: boolean;
    feedbacks: any[];
  } | null>(null);

  const [showAlert, setShowAlert] = useState(false);
  const [mindsetSelected, setMindsetSelected] = useState<string | null>(null);
  const [financialStatus, setFinancialStatus] = useState<string | null>(null);

  const handleSaveProfile = async () => {
    try {
      // prepare data; blanks are fine
      const profileData = {
        // Personal Information
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,

        // Financial Assessment Data
        age: Number(formData.age),
        income: Number(formData.income),
        expenses: Number(formData.expenses),
        savings: Number(formData.savings),
        debt: Number(formData.debt),
        emergencyFundMonths: Number(formData.emergencyFundMonths),

        // Investment Mindset Selection
        investmentMindset: mindsetSelected,

        // Financial Status Selection
        financialStatus: financialStatus,

        // Scores and Analysis Results (may be undefined if not yet calculated)
        stabilityScore: result?.stabilityScore,
        riskScore: result?.riskScore,
        readinessScore: result?.readinessScore,
        expenseRatio: result?.expenseRatio,
        savingsRate: result?.savingsRate,
        debtRatio: result?.debtRatio,
        status: result?.status,
        recommendation: result?.recommendation,
        stateCategory: result?.stateCategory,

        // Dynamic Feedbacks
        feedbacks: result?.feedbacks || []
      };

      const response = await fetch("http://localhost:5000/api/profile/save-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      console.log("save-profile response", response.status, data);

      if (!response.ok) {
        // show any message returned by server or fallback
        alert(data.error || `Failed to save profile (status ${response.status})`);
        return;
      }

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
      alert("Server error while saving profile.");
    }
  };

  const mindsets = [
    {
      id: 'conservative',
      name: 'Conservative',
      emoji: '🛡️',
      description: 'Preserve capital, prefer safety over growth',
      color: 'from-emerald-500/20 to-emerald-600/20',
      borderColor: 'border-emerald-500/50',
    },
    {
      id: 'moderate',
      name: 'Moderate',
      emoji: '⚖️',
      description: 'Balance growth and stability',
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/50',
    },
    {
      id: 'growth',
      name: 'Growth-Focused',
      emoji: '📈',
      description: 'Long-term wealth creation, some volatility OK',
      color: 'from-amber-500/20 to-amber-600/20',
      borderColor: 'border-amber-500/50',
    },
  ];

  const statuses = [
    {
      id: 'surplus',
      name: 'Surplus Funds',
      desc: 'Income exceeds expenses',
      icon: '✅',
    },
    {
      id: 'balanced',
      name: 'Balanced',
      desc: 'Income and expenses aligned',
      icon: '⚖️',
    },
    {
      id: 'deficit',
      name: 'Building Stability',
      desc: 'Focus on expense management first',
      icon: '📊',
    },
  ];
  const chartData = result ? [
  { name: "Stability", value: result.stabilityScore },
  { name: "Risk", value: result.riskScore },
  { name: "Readiness", value: result.readinessScore }
] : [];


 const handleAssessment = () => {
  const ageNum = Number(formData.age);

  // if age qualifies as minor, enable parental mode
  if (ageNum && ageNum < 18) {
    setShowParentMode(true);
  } else {
    setShowParentMode(false);
  }

  const numericData = {
    age: ageNum,
    income: Number(formData.income),
    expenses: Number(formData.expenses),
    savings: Number(formData.savings),
    debt: Number(formData.debt),
    emergencyFundMonths: Number(formData.emergencyFundMonths)
  };

  const analysis = analyzeFinancialHealth(numericData);
  const feedbacks = generateDynamicFeedback(analysis);
  
  setResult({ ...analysis, feedbacks });
};

  const handleParentDataSave = async () => {
    try {
      if (!parentData.name || !parentData.relation || !parentData.phone || !parentData.email) {
        alert("Please fill in all guardian details.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/profile/guardian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          guardianName: parentData.name,
          guardianRelation: parentData.relation,
          guardianPhone: parentData.phone,
          guardianEmail: parentData.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert("Guardian details saved successfully!");
      // Clear parent data after successful save
      setParentData({
        name: '',
        relation: '',
        phone: '',
        email: ''
      });
    } catch (error) {
      alert("Server error while saving guardian details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Your Financial Profile</h1>
          <p className="text-lg text-slate-400">
            Set up your profile and investment mindset for personalized guidance
          </p>
        </div>

        {showAlert && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowAlert(false)}></div>
            
            {/* Modal */}
            <div className="relative bg-gradient-to-br from-emerald-900 to-slate-900 border-2 border-emerald-500 rounded-2xl p-8 shadow-2xl animate-bounce">
              <div className="flex items-center gap-4">
                <CheckCircle className="text-emerald-400 flex-shrink-0" size={40} />
                <div>
                  <p className="text-emerald-300 font-bold text-lg">Success!</p>
                  <p className="text-slate-300 text-sm mt-1">Your profile details have been saved successfully.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8">          {/* Personal Information Section */}  
          {showParentMode && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg transition-transform duration-500 ease-in-out transform scale-105">
              <p className="text-yellow-200 font-medium">
                ⚠️ Parental profiling active. Please enter guardian details below
                and review the results.
              </p>
            </div>
          )
          }          {/* Personal Information Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mr-4">
                <User className="text-blue-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-1">Personal Information</h2>
                <p className="text-slate-400">Your basic account details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>


            </div>
          </div>

          {/* Investment Mindset Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center mr-4">
                <Zap className="text-emerald-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-1">Investment Mindset</h2>
                <p className="text-slate-400">Choose your financial personality</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {mindsets.map((mindset) => (
                <button
                  key={mindset.id}
                  onClick={() => setMindsetSelected(mindset.id)}
                  className={`group relative p-6 rounded-lg transition-all duration-300 transform ${
                    mindsetSelected === mindset.id
                      ? `bg-gradient-to-br ${mindset.color} border-2 ${mindset.borderColor} shadow-lg scale-105`
                      : `bg-slate-700/50 border border-slate-600 hover:bg-slate-700 hover:border-slate-500`
                  }`}
                >
                  <div className="text-3xl mb-3">{mindset.emoji}</div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1">{mindset.name}</h3>
                  <p className="text-sm text-slate-400">{mindset.description}</p>
                  {mindsetSelected === mindset.id && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="text-emerald-400" size={20} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Financial Status Section */}
          <div className={`bg-gradient-to-br rounded-xl p-8 border transition-all duration-700 ease-in-out 
              ${showParentMode ? 'from-white-500 to-purple-500 border-pink-400 scale-105' : 'from-slate-800 to-slate-900 border-slate-700'}`}
          >
            <div className="flex items-start mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg flex items-center justify-center mr-4">
                <Shield className="text-amber-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-1">Financial Status</h2>
                <p className="text-slate-400">Help us guide your investment journey</p>
              </div>
            </div>

            {/* Financial Assessment */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-100 mb-4">
                {showParentMode ? 'Parental Profiling' : 'Financial Assessment'}
              </h3>

              {/* always show financial inputs */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <input
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  type="number"
                  placeholder="Monthly Income"
                  value={formData.income}
                  onChange={(e) => setFormData({...formData, income: e.target.value})}
                  className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  type="number"
                  placeholder="Monthly Expenses"
                  value={formData.expenses}
                  onChange={(e) => setFormData({...formData, expenses: e.target.value})}
                  className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  type="number"
                  placeholder="Monthly Savings"
                  value={formData.savings}
                  onChange={(e) => setFormData({...formData, savings: e.target.value})}
                  className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  type="number"
                  placeholder="Total Debt"
                  value={formData.debt}
                  onChange={(e) => setFormData({...formData, debt: e.target.value})}
                  className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  type="number"
                  placeholder="Emergency Fund (Months)"
                  value={formData.emergencyFundMonths}
                  onChange={(e) => setFormData({...formData, emergencyFundMonths: e.target.value})}
                  className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button
                onClick={handleAssessment}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-blue-500/30"
              >
                Analyze Financial Health
              </button>
              {/* dropdown details for guardian when minor */}
              {showParentMode && (
                <details className="mt-4 bg-pink-900/10 p-3 rounded-lg">
                  <summary className="cursor-pointer text-pink-200 font-semibold">
                    Enter Guardian Details
                  </summary>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <input
                      type="text"
                      placeholder="Parent/Guardian Name"
                      value={parentData.name}
                      onChange={(e) => setParentData({...parentData, name: e.target.value})}
                      className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <input
                      type="text"
                      placeholder="Relation to Minor"
                      value={parentData.relation}
                      onChange={(e) => setParentData({...parentData, relation: e.target.value})}
                      className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <input
                      type="tel"
                      placeholder="Parent Phone"
                      value={parentData.phone}
                      onChange={(e) => setParentData({...parentData, phone: e.target.value})}
                      className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <input
                      type="email"
                      placeholder="Parent Email"
                      value={parentData.email}
                      onChange={(e) => setParentData({...parentData, email: e.target.value})}
                      className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button
                    onClick={handleParentDataSave}
                    className="mt-4 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-pink-500/30"
                  >
                    Save Guardian Details
                  </button>
                </details>
              )}
              {result && (
                <div
                  className={`mt-6 p-6 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border rounded-lg 
                    ${result.stateCategory === 'healthy' ? 'border-green-400' : result.stateCategory === 'caution' ? 'border-yellow-400' : 'border-red-400'}`
                }
                >
                  <h3 className="text-xl font-bold text-slate-100 mb-4">
                    Financial Health Analysis
                  </h3>

                  <p className="text-lg text-blue-300 mb-2">
                    Status: <span className="font-semibold">{result.status}</span>
                  </p>

                  <p className="text-slate-300 mb-6">
                    {result.recommendation}
                  </p>

                  {/* Dynamic Feedback Cards */}
                  {result.feedbacks && result.feedbacks.length > 0 && (
                    <div className="mb-6 space-y-3">
                      {result.feedbacks.map((feedback: any, idx: number) => {
                        const bgColor = 
                          feedback.feedbackType === 'critical' ? 'bg-red-900/30 border-red-500/50' :
                          feedback.feedbackType === 'warning' ? 'bg-orange-900/30 border-orange-500/50' :
                          feedback.feedbackType === 'caution' ? 'bg-yellow-900/30 border-yellow-500/50' :
                          'bg-green-900/30 border-green-500/50';
                        
                        const textColor = 
                          feedback.feedbackType === 'critical' ? 'text-red-300' :
                          feedback.feedbackType === 'warning' ? 'text-orange-300' :
                          feedback.feedbackType === 'caution' ? 'text-yellow-300' :
                          'text-green-300';

                        return (
                          <div key={idx} className={`p-3 border rounded-lg ${bgColor}`}>
                            <p className={`font-semibold ${textColor} mb-1`}>
                              {feedback.icon} {feedback.title}
                            </p>
                            <p className="text-slate-300 text-sm">{feedback.message}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Score"
                          dataKey="value"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                      <p className="text-slate-400 text-sm">Stability</p>
                      <p className="text-3xl text-green-400 font-bold">
                        {result && result.stabilityScore !== undefined ? result.stabilityScore : 0}
                      </p>
                      <p className="text-xs text-slate-500">/100</p>
                    </div>

                    <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                      <p className="text-slate-400 text-sm">Risk</p>
                      <p className="text-3xl text-red-400 font-bold">
                        {result && result.riskScore !== undefined ? result.riskScore : 0}
                      </p>
                      <p className="text-xs text-slate-500">/100</p>
                    </div>

                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                      <p className="text-slate-400 text-sm">Investment Readiness</p>
                      <p className="text-3xl text-blue-400 font-bold">
                        {result && result.readinessScore !== undefined ? result.readinessScore : 0}
                      </p>
                      <p className="text-xs text-slate-500">/100</p>
                    </div>
                  </div>

                  {/* optional further ratio breakdown */}
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-slate-300">
                    <div>Expense ratio: {result.expenseRatio}%</div>
                    <div>Savings rate: {result.savingsRate}%</div>
                    <div>Debt ratio: {result.debtRatio}%</div>
                  </div>

                  {showParentMode && (
                    <div className="mt-4 p-4 bg-pink-900/20 rounded-lg text-pink-200 text-sm">
                      <p className="font-semibold">Guardian Info:</p>
                      <p>Name: {parentData.name || '—'}</p>
                      <p>Relation: {parentData.relation || '—'}</p>
                      <p>Phone: {parentData.phone || '—'}</p>
                      <p>Email: {parentData.email || '—'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {statuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setFinancialStatus(status.id)}
                  className={`group relative p-6 rounded-lg transition-all duration-300 text-left ${
                    financialStatus === status.id
                      ? 'bg-blue-500/20 border-2 border-blue-500/50 shadow-lg'
                      : 'bg-slate-700/50 border border-slate-600 hover:bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="text-2xl mb-3">{status.icon}</div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1">{status.name}</h3>
                  <p className="text-sm text-slate-400">{status.desc}</p>
                  {financialStatus === status.id && (
                    <CheckCircle className="absolute top-3 right-3 text-emerald-400" size={20} />
                  )}
                </button>
              ))}
            </div>

            {financialStatus === 'deficit' && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-amber-300 text-sm">
                  💡 <strong>Pro Tip:</strong> Focus on budgeting and expense management first. Once you have regular surplus, explore investment options. No pressure—we&apos;re here to support your journey.
                </p>
              </div>
            )}

            <button
              onClick={handleSaveProfile}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-emerald-500/30"
            >
              Save Financial Profile
            </button>
          </div>

          {!showParentMode && (
            <>
              {/* Security & Privacy Section */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center mr-4">
                    <Lock className="text-red-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-1">Security & Privacy</h2>
                    <p className="text-slate-400">Manage your account security</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Change Password', desc: 'Update your account password' },
                    { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                    { title: 'Data Privacy', desc: 'Control your data and privacy settings' },
                  ].map((item, idx) => (
                    <button key={idx} className="w-full text-left p-4 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors">
                      <h3 className="font-semibold text-slate-100 mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications Section */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mr-4">
                    <Bell className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-1">Notifications</h2>
                    <p className="text-slate-400">Choose what updates you want</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {['Investment Updates', 'Educational Content', 'Market Alerts'].map((notif, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-slate-600 rounded-lg hover:bg-slate-700/30 transition-colors">
                      <p className="font-semibold text-slate-100">{notif}</p>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={idx < 2} />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support Section */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center mr-4">
                    <HelpCircle className="text-orange-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-1">Support</h2>
                    <p className="text-slate-400">Get help when you need it</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Help Center', desc: 'Browse FAQs and guides' },
                    { title: 'Contact Support', desc: 'Get in touch with our team' },
                    { title: 'Report Issue', desc: 'Let us know if something\'s wrong' },
                  ].map((item, idx) => (
                    <button key={idx} className="w-full text-left p-4 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors">
                      <h3 className="font-semibold text-slate-100 mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
