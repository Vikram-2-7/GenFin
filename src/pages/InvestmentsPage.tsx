import { useState } from 'react';
import { TrendingUp, Shield, AlertCircle, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface Investment {
  id: string;
  name: string;
  category: string;
  risk: 'Very Low' | 'Low';
  returns: string;
  description: string;
  features: string[];
  minimumAmount: string;
}

function InvestmentsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const investments: Investment[] = [
    {
      id: '1',
      name: 'Government Bonds',
      category: 'Bonds',
      risk: 'Very Low',
      returns: '6-8% annually',
      description: 'Debt securities issued by the Government of India, offering fixed returns with sovereign guarantee.',
      features: [
        'Backed by Government of India',
        'Fixed interest payments',
        'No default risk',
        'Tradable on exchanges',
      ],
      minimumAmount: '₹1,000',
    },
    {
      id: '2',
      name: 'Index ETFs',
      category: 'ETFs',
      risk: 'Low',
      returns: '10-12% annually',
      description: 'Exchange-traded funds that track major market indices like Nifty 50 or Sensex, providing diversified exposure.',
      features: [
        'Diversified portfolio',
        'Low expense ratio',
        'Easy to buy and sell',
        'Transparent holdings',
      ],
      minimumAmount: '₹500',
    },
    {
      id: '3',
      name: 'Debt Mutual Funds',
      category: 'Mutual Funds',
      risk: 'Low',
      returns: '7-9% annually',
      description: 'Funds that invest in fixed-income securities like corporate bonds and government securities.',
      features: [
        'Professional management',
        'Better than FD returns',
        'High liquidity',
        'Tax efficient after 3 years',
      ],
      minimumAmount: '₹1,000',
    },
    {
      id: '4',
      name: 'Digital Gold',
      category: 'Commodities',
      risk: 'Low',
      returns: '8-10% annually',
      description: 'Invest in 24K gold digitally through regulated platforms, backed by physical gold in insured vaults.',
      features: [
        '100% pure 24K gold',
        'No making charges',
        'Insured storage',
        'Can convert to physical gold',
      ],
      minimumAmount: '₹100',
    },
    {
      id: '5',
      name: 'Corporate Bonds (AAA Rated)',
      category: 'Bonds',
      risk: 'Low',
      returns: '8-10% annually',
      description: 'High-quality debt securities issued by top-rated companies with strong credit ratings.',
      features: [
        'Higher returns than government bonds',
        'AAA credit rating',
        'Regular interest payments',
        'Listed on exchanges',
      ],
      minimumAmount: '₹10,000',
    },
    {
      id: '6',
      name: 'Liquid Funds',
      category: 'Mutual Funds',
      risk: 'Very Low',
      returns: '5-7% annually',
      description: 'Short-term debt funds ideal for parking surplus money with high liquidity and safety.',
      features: [
        'Instant redemption',
        'Better than savings account',
        'Very low risk',
        'No lock-in period',
      ],
      minimumAmount: '₹500',
    },
  ];

  const categories = ['all', 'Bonds', 'ETFs', 'Mutual Funds', 'Commodities'];

  const filteredInvestments = selectedCategory === 'all'
    ? investments
    : investments.filter(inv => inv.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getRiskColor = (risk: string) => {
    return risk === 'Very Low'
      ? { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300' }
      : { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', badge: 'bg-yellow-500/20 text-yellow-300' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Safe Investment Options</h1>
          <p className="text-lg text-slate-400">
            Curated, low-risk instruments for steady, long-term wealth building
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-900/30 to-emerald-900/30 border border-blue-800/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-start">
            <AlertCircle className="text-blue-400 mt-1 flex-shrink-0" size={20} />
            <p className="ml-3 text-sm text-blue-200">
              <strong>Golden Rule:</strong> Only invest surplus funds after meeting all essential expenses. These options prioritize safety and steady growth, ideal for patient and disciplined investors.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-lg transition-all duration-300 font-semibold ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:border-slate-500'
              }`}
            >
              {category === 'all' ? 'All Options' : category}
            </button>
          ))}
        </div>

        <div className="grid gap-6">
          {filteredInvestments.map((investment) => {
            const riskColor = getRiskColor(investment.risk);
            const isExpanded = expandedId === investment.id;

            return (
              <div
                key={investment.id}
                className={`bg-gradient-to-br from-slate-800 to-slate-900 border transition-all duration-300 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 ${
                  isExpanded ? 'border-blue-500/50' : riskColor.border
                }`}
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleExpand(investment.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-slate-100">{investment.name}</h3>
                        <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-md text-xs font-semibold border border-slate-600">
                          {investment.category}
                        </span>
                        <span className={`px-3 py-1 rounded-md text-xs font-semibold ${riskColor.badge}`}>
                          {investment.risk} Risk
                        </span>
                      </div>
                      <p className="text-slate-300 mb-4 text-sm leading-relaxed">{investment.description}</p>
                      <div className="flex items-center gap-8 text-sm flex-wrap">
                        <div className="flex items-center">
                          <TrendingUp size={16} className="text-emerald-400 mr-2" />
                          <span className="text-slate-400">Expected: <span className="text-emerald-300 font-bold">{investment.returns}</span></span>
                        </div>
                        <div className="flex items-center">
                          <Shield size={16} className="text-blue-400 mr-2" />
                          <span className="text-slate-400">Min: <span className="text-blue-300 font-bold">{investment.minimumAmount}</span></span>
                        </div>
                      </div>
                    </div>
                    <button className="ml-4 p-2 hover:bg-slate-700 rounded-lg transition-colors">
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-blue-400" />
                      ) : (
                        <ChevronDown size={20} className="text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-slate-700 pt-4 bg-slate-900/50">
                    <div className="mb-6">
                      <h4 className="font-bold text-slate-100 mb-3 flex items-center">
                        <Zap size={18} className="text-amber-400 mr-2" />
                        Key Features
                      </h4>
                      <ul className="space-y-2.5">
                        {investment.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                            <span className="text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                      <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-emerald-500/30">
                        Learn More
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-br from-red-900/20 to-slate-800 border border-red-800/50 rounded-xl p-8 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
            <AlertCircle className="text-red-400 mr-2" size={24} />
            What We Exclude (High Risk)
          </h3>
          <p className="text-slate-300 mb-4">
            To protect your financial well-being and follow our low-risk mandate, GenFin does not recommend:
          </p>
          <ul className="space-y-2.5 text-slate-300">
            <li className="flex items-start">
              <span className="text-red-400 mr-3 font-bold">✗</span>
              Intraday trading and speculative trading
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3 font-bold">✗</span>
              Derivatives, futures, and options
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3 font-bold">✗</span>
              Cryptocurrency and unregulated digital assets
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3 font-bold">✗</span>
              Penny stocks and unlisted securities
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InvestmentsPage;
