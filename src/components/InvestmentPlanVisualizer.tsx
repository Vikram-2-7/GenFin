import React, { useMemo } from 'react';
import { TrendingUp, Shield, Target, Calendar, ExternalLink, Info, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface InvestmentPlan {
  title: string;
  description: string;
  timeline: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturns: string;
  minInvestment: number;
  schemes: GovernmentScheme[];
}

interface GovernmentScheme {
  id: string;
  name: string;
  category: string;
  description: string;
  minInvestment: number;
  expectedReturns: string;
  lockInPeriod: string;
  riskLevel: 'low' | 'medium' | 'high';
  eligibility: string;
  taxBenefits: string;
  url: string;
}

interface InvestmentPlanVisualizerProps {
  profile: any;
  onNavigateToScheme: (schemeId: string) => void;
}

const InvestmentPlanVisualizer: React.FC<InvestmentPlanVisualizerProps> = ({ 
  profile, 
  onNavigateToScheme 
}) => {
  // Government schemes data
  const governmentSchemes: GovernmentScheme[] = [
    {
      id: 'ppf',
      name: 'Public Provident Fund (PPF)',
      category: 'Retirement & Long-term',
      description: 'Government-backed savings scheme with tax benefits under Section 80C',
      minInvestment: 500,
      expectedReturns: '7.1% - 8.0%',
      lockInPeriod: '15 years',
      riskLevel: 'low',
      eligibility: 'Indian residents',
      taxBenefits: 'Section 80C, Exempt on maturity',
      url: '/schemes/ppf'
    },
    {
      id: 'nps',
      name: 'National Pension System (NPS)',
      category: 'Retirement',
      description: 'Voluntary retirement savings scheme regulated by PFRDA',
      minInvestment: 500,
      expectedReturns: '9% - 12%',
      lockInPeriod: 'Until retirement',
      riskLevel: 'medium',
      eligibility: 'All Indian citizens (18-60 years)',
      taxBenefits: 'Section 80CCD, Partial tax-free on withdrawal',
      url: '/schemes/nps'
    },
    {
      id: 'sukanya',
      name: 'Sukanya Samriddhi Yojana',
      category: 'Girl Child Welfare',
      description: 'Savings scheme for girl child education and marriage expenses',
      minInvestment: 250,
      expectedReturns: '8.0%',
      lockInPeriod: '21 years or marriage',
      riskLevel: 'low',
      eligibility: 'Girl child below 10 years',
      taxBenefits: 'Section 80C, Tax-free interest and maturity',
      url: '/schemes/sukanya'
    },
    {
      id: 'kvp',
      name: 'Kisan Vikas Patra',
      category: 'Savings',
      description: 'Small savings certificate with guaranteed returns',
      minInvestment: 1000,
      expectedReturns: '7.5% (compounded annually)',
      lockInPeriod: '124 months (10 years 4 months)',
      riskLevel: 'low',
      eligibility: 'Indian adults',
      taxBenefits: 'No tax benefits',
      url: '/schemes/kvp'
    },
    {
      id: 'nscl',
      name: 'National Savings Certificate',
      category: 'Fixed Income',
      description: 'Fixed income investment with tax benefits',
      minInvestment: 1000,
      expectedReturns: '7.7%',
      lockInPeriod: '5 years',
      riskLevel: 'low',
      eligibility: 'Indian residents',
      taxBenefits: 'Section 80C, Taxable on maturity',
      url: '/schemes/nscl'
    },
    {
      id: 'pmjjby',
      name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana',
      category: 'Insurance',
      description: 'Life insurance scheme with affordable premiums',
      minInvestment: 330,
      expectedReturns: 'Life cover of ₹2 Lakhs',
      lockInPeriod: 'Annual renewal',
      riskLevel: 'low',
      eligibility: '18-50 years bank account holders',
      taxBenefits: 'Section 80C',
      url: '/schemes/pmjjby'
    }
  ];

  // Generate personalized investment plan based on profile
  const generateInvestmentPlan = (): InvestmentPlan[] => {
    const readinessScore = profile?.readinessScore || 0;
    const income = profile?.income || 0;
    const savings = profile?.savings || 0;
    const age = profile?.age || 25;
    const riskTolerance = profile?.investmentMindset || 'moderate';

    const plans: InvestmentPlan[] = [];

    // Emergency Fund Builder (Low Risk)
    if (profile?.emergencyFundMonths < 6) {
      plans.push({
        title: 'Emergency Fund Builder',
        description: 'Build a robust emergency fund covering 6 months of expenses',
        timeline: '3-6 months',
        riskLevel: 'low',
        expectedReturns: '3.5% - 4.0%',
        minInvestment: savings * 0.3,
        schemes: governmentSchemes.filter(s => s.riskLevel === 'low' && s.minInvestment <= savings * 0.3)
      });
    }

    // Conservative Growth (Low-Medium Risk)
    if (readinessScore >= 50) {
      plans.push({
        title: 'Conservative Wealth Builder',
        description: 'Steady growth with government-backed schemes',
        timeline: '2-3 years',
        riskLevel: 'low',
        expectedReturns: '7% - 8%',
        minInvestment: Math.min(savings * 0.4, 5000),
        schemes: governmentSchemes.filter(s => 
          s.riskLevel === 'low' && 
          (s.category.includes('Savings') || s.category.includes('Retirement') || s.category.includes('Long-term')) &&
          s.minInvestment <= Math.min(savings * 0.4, 5000)
        )
      });
    }

    // Balanced Portfolio (Medium Risk)
    if (readinessScore >= 70 && riskTolerance !== 'conservative') {
      plans.push({
        title: 'Balanced Growth Portfolio',
        description: 'Mix of safe investments and moderate growth options',
        timeline: '3-5 years',
        riskLevel: 'medium',
        expectedReturns: '9% - 12%',
        minInvestment: Math.min(savings * 0.5, 10000),
        schemes: governmentSchemes.filter(s => s.riskLevel === 'medium' || s.category === 'Retirement')
      });
    }

    // Long-term Wealth (For higher readiness scores)
    if (readinessScore >= 80 && age < 40) {
      plans.push({
        title: 'Long-term Wealth Creator',
        description: 'Retirement planning and long-term wealth accumulation',
        timeline: '10+ years',
        riskLevel: 'medium',
        expectedReturns: '10% - 14%',
        minInvestment: Math.min(savings * 0.6, 15000),
        schemes: governmentSchemes.filter(s => s.category === 'Retirement' || s.lockInPeriod.includes('years'))
      });
    }

    return plans;
  };

  const investmentPlans = useMemo(() => generateInvestmentPlan(), [profile]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500 bg-green-500/20 border-green-500/50';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50';
      case 'high': return 'text-red-500 bg-red-500/20 border-red-500/50';
      default: return 'text-gray-500 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <Shield size={16} className="text-green-500" />;
      case 'medium': return <AlertCircle size={16} className="text-yellow-500" />;
      case 'high': return <TrendingUp size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-blue-400" size={24} />
          <div>
            <h3 className="text-xl font-bold text-slate-100">Your Personalized Investment Plan</h3>
            <p className="text-sm text-slate-300">Based on your financial profile and goals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">Readiness Score</div>
            <div className="text-lg font-bold text-blue-400">{profile?.readinessScore || 0}/100</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">Monthly Savings</div>
            <div className="text-lg font-bold text-emerald-400">₹{profile?.savings || 0}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">Risk Profile</div>
            <div className="text-lg font-bold text-purple-400 capitalize">{profile?.investmentMindset || 'moderate'}</div>
          </div>
        </div>
      </div>

      {investmentPlans.map((plan, planIndex) => (
        <div key={planIndex} className="bg-slate-800/90 border border-slate-700 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-slate-100 mb-2">{plan.title}</h4>
              <p className="text-sm text-slate-300 mb-3">{plan.description}</p>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-400">{plan.timeline}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getRiskIcon(plan.riskLevel)}
                  <span className={`text-xs px-2 py-1 rounded border ${getRiskColor(plan.riskLevel)}`}>
                    {plan.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-400">{plan.expectedReturns}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-400">Min: ₹{plan.minInvestment}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Shield size={14} className="text-blue-400" />
              Recommended Government Schemes
            </h5>
            
            <div className="grid gap-3">
              {plan.schemes.map((scheme, schemeIndex) => (
                <div key={schemeIndex} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h6 className="font-medium text-slate-100">{scheme.name}</h6>
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                          {scheme.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{scheme.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500">Returns:</span>
                          <span className="text-emerald-400 ml-1">{scheme.expectedReturns}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Lock-in:</span>
                          <span className="text-slate-300 ml-1">{scheme.lockInPeriod}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Min.:</span>
                          <span className="text-slate-300 ml-1">₹{scheme.minInvestment}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Tax:</span>
                          <span className="text-slate-300 ml-1">{scheme.taxBenefits ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onNavigateToScheme(scheme.id)}
                      className="ml-4 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      View Details
                      <ExternalLink size={12} />
                    </button>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-slate-600">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle size={12} className="text-emerald-400" />
                      <span>Eligibility: {scheme.eligibility}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {investmentPlans.length === 0 && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 text-center">
          <AlertCircle className="text-yellow-400 mx-auto mb-3" size={32} />
          <h4 className="text-lg font-semibold text-slate-100 mb-2">Build Your Financial Foundation First</h4>
          <p className="text-sm text-slate-300 mb-4">
            Based on your current financial profile, focus on building an emergency fund and improving your savings rate before starting investment plans.
          </p>
          <div className="bg-slate-700/50 rounded-lg p-3 text-left">
            <h5 className="font-medium text-slate-100 mb-2">Recommended First Steps:</h5>
            <ul className="space-y-1 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-emerald-400 mt-0.5" />
                <span>Build emergency fund to cover 6 months of expenses</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-emerald-400 mt-0.5" />
                <span>Increase savings rate to at least 20% of income</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-emerald-400 mt-0.5" />
                <span>Pay off high-interest debt before investing</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentPlanVisualizer;
