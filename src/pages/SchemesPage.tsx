import { useState } from 'react';
import { Award, ChevronDown, ChevronUp, Shield, Clock, TrendingUp, Zap, AlertCircle } from 'lucide-react';

interface Scheme {
  id: string;
  name: string;
  shortName: string;
  type: string;
  interest: string;
  tenure: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  taxBenefits: string;
  websiteUrl?: string;
}

interface SchemesPageProps {
  onSchemeDetail: (schemeId: string) => void;
  selectedSchemeId?: string;
}

function SchemesPage({ onSchemeDetail, selectedSchemeId }: SchemesPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const schemes: Scheme[] = [
    {
      id: '1',
      name: 'Public Provident Fund',
      shortName: 'PPF',
      type: 'Long-term Savings',
      interest: '7.1% per annum',
      tenure: '15 years',
      description: 'A government-backed long-term savings scheme offering attractive interest rates with complete tax exemption.',
      eligibility: [
        'Indian residents only',
        'One account per person',
        'Can be opened for minors',
      ],
      benefits: [
        'Completely safe and guaranteed returns',
        'Tax-free interest income',
        'Loan facility after 3 years',
        'Partial withdrawal after 7 years',
      ],
      taxBenefits: 'Tax deduction under Section 80C up to ₹1.5 lakh. Interest earned is tax-free.',
      websiteUrl: 'https://www.postoffice.gov.in'
    },
    {
      id: '2',
      name: 'Sukanya Samriddhi Yojana',
      shortName: 'SSY',
      type: 'Girl Child Savings',
      interest: '8.0% per annum',
      tenure: '21 years',
      description: 'A special savings scheme for girl child with highest interest rate among all government schemes.',
      eligibility: [
        'Girl child below 10 years',
        'Only two accounts per family',
        'Parents or legal guardians can open',
      ],
      benefits: [
        'Highest interest rate among govt schemes',
        'Partial withdrawal for education after 18 years',
        'Complete tax exemption (EEE status)',
        'Account matures after 21 years',
      ],
      taxBenefits: 'Tax deduction under Section 80C. Interest and maturity amount are completely tax-free.',
      websiteUrl: 'https://www.postoffice.gov.in'
    },
    {
      id: '3',
      name: 'National Savings Certificate',
      shortName: 'NSC',
      type: 'Fixed Income',
      interest: '7.7% per annum',
      tenure: '5 years',
      description: 'A fixed-income investment scheme offered by post offices with guaranteed returns.',
      eligibility: [
        'Any Indian resident',
        'Single or joint accounts allowed',
        'Can be used as collateral for loans',
      ],
      benefits: [
        'Guaranteed returns',
        'Safe government backing',
        'Nomination facility available',
        'Can be transferred between post offices',
      ],
      taxBenefits: 'Tax deduction under Section 80C on investment amount. Interest is taxable but deemed reinvested.',
      websiteUrl: 'https://www.postoffice.gov.in'
    },
    {
      id: '4',
      name: 'Kisan Vikas Patra',
      shortName: 'KVP',
      type: 'Doubling Scheme',
      interest: '7.5% per annum',
      tenure: '115 months (9.6 years)',
      description: 'A savings certificate scheme where investment doubles in a fixed period.',
      eligibility: [
        'Any Indian citizen',
        'Can be purchased for minors',
        'Joint accounts allowed',
      ],
      benefits: [
        'Investment doubles in maturity period',
        'Can be pledged as collateral',
        'Transferable between individuals',
        'Premature withdrawal after 2.5 years',
      ],
      taxBenefits: 'No tax deduction on investment. Interest is taxable as per income tax slab.',
      websiteUrl: 'https://www.postoffice.gov.in'
    },
    {
      id: '5',
      name: 'Senior Citizens Savings Scheme',
      shortName: 'SCSS',
      type: 'Retirement Savings',
      interest: '8.2% per annum',
      tenure: '5 years',
      description: 'A special savings scheme for senior citizens offering highest returns with regular income.',
      eligibility: [
        'Age 60 years and above',
        'Retired persons above 55 years',
        'Maximum deposit ₹30 lakh',
      ],
      benefits: [
        'Highest interest rate for senior citizens',
        'Quarterly interest payout',
        'Safe government backing',
        'Extension possible for 3 more years',
      ],
      taxBenefits: 'Tax deduction under Section 80C up to ₹1.5 lakh. Interest is taxable but TDS only if exceeds ₹50,000.',
      websiteUrl: 'https://www.postoffice.gov.in'
    },
    {
      id: '6',
      name: 'Atal Pension Yojana',
      shortName: 'APY',
      type: 'Pension Scheme',
      interest: 'Variable returns',
      tenure: 'Until age 60',
      description: 'A government-backed pension scheme ensuring regular monthly pension after 60 years of age.',
      eligibility: [
        'Age 18-40 years',
        'Indian citizen with savings bank account',
        'Aadhaar card mandatory',
      ],
      benefits: [
        'Guaranteed monthly pension of ₹1,000 to ₹5,000',
        'Government co-contribution for eligible subscribers',
        'Spouse receives pension after subscriber',
        'Return of corpus to nominee',
      ],
      taxBenefits: 'Tax deduction under Section 80CCD(1) up to ₹1.5 lakh.',
      websiteUrl: 'https://www.npslite.gov.in'
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Government Savings Schemes</h1>
          <p className="text-lg text-slate-400">
            Explore safe, government-backed schemes with guaranteed returns and tax benefits.
          </p>
        </div>

        <div className="bg-gradient-to-r from-emerald-900/30 to-slate-800 border border-emerald-800/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="text-emerald-400" size={20} />
            </div>
            <p className="ml-4 text-sm text-emerald-200">
              <strong>100% Government-Backed:</strong> All schemes are backed by the Government of India with guaranteed returns. Ideal for conservative investors seeking long-term security with tax benefits.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer"
            >
              <div
                className="p-6"
                onClick={() => toggleExpand(scheme.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center">
                        <Award className="text-emerald-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-100">{scheme.name}</h3>
                        <span className="text-sm text-slate-400">({scheme.shortName})</span>
                      </div>
                    </div>
                    <span className="inline-block px-3 py-1 bg-slate-700/50 text-slate-300 rounded-md text-xs font-semibold mb-3 border border-slate-600">
                      {scheme.type}
                    </span>
                    <p className="text-slate-300 mb-4 text-sm leading-relaxed">{scheme.description}</p>
                    <div className="flex items-center gap-8 text-sm flex-wrap">
                      <div className="flex items-center">
                        <TrendingUp size={16} className="text-emerald-400 mr-2" />
                        <span className="text-slate-400">Interest: <span className="text-emerald-300 font-bold">{scheme.interest}</span></span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="text-blue-400 mr-2" />
                        <span className="text-slate-400">Tenure: <span className="text-blue-300 font-bold">{scheme.tenure}</span></span>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 p-2 hover:bg-slate-700 rounded-lg transition-colors">
                    {expandedId === scheme.id ? (
                      <ChevronUp size={20} className="text-emerald-400" />
                    ) : (
                      <ChevronDown size={20} className="text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              {expandedId === scheme.id && (
                <div className="px-6 pb-6 border-t border-slate-700 pt-4 bg-slate-900/50">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-bold text-slate-100 mb-3 flex items-center">
                        <Shield size={18} className="text-emerald-400 mr-2" />
                        Eligibility
                      </h4>
                      <ul className="space-y-2.5">
                        {scheme.eligibility.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                            <span className="text-slate-300 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-100 mb-3 flex items-center">
                        <Zap size={18} className="text-amber-400 mr-2" />
                        Key Benefits
                      </h4>
                      <ul className="space-y-2.5">
                        {scheme.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                            <span className="text-slate-300 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4">
                    <h4 className="font-bold text-amber-300 mb-2 flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      Tax Benefits
                    </h4>
                    <p className="text-slate-300 text-sm">{scheme.taxBenefits}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => onSchemeDetail(scheme.id)}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-emerald-500/30"
                    >
                      Get Detailed Information
                    </button>
                    {scheme.websiteUrl && (
                      <button
                        onClick={() => window.open(scheme.websiteUrl, '_blank')}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-blue-500/30"
                      >
                        Visit Official Site
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-emerald-900/20 via-slate-800 to-slate-900 border border-emerald-800/50 rounded-xl p-8 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
            <AlertCircle className="text-emerald-400 mr-2" size={24} />
            How to Invest in Government Schemes
          </h3>
          <div className="space-y-4 text-slate-300">
            <p className="text-slate-400">Government schemes can be accessed through multiple channels:</p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 font-bold">✓</span>
                <span><strong className="text-slate-100">Post Offices:</strong> Most schemes available at your nearest post office nationwide</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 font-bold">✓</span>
                <span><strong className="text-slate-100">Authorized Banks:</strong> Public and private sector banks offer several schemes with easy setup</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 font-bold">✓</span>
                <span><strong className="text-slate-100">Online Platforms:</strong> Some schemes can be accessed through net banking and digital portals</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 font-bold">✓</span>
                <span><strong className="text-slate-100">Required Documents:</strong> Typically need Aadhaar, PAN, address proof, and passport photos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchemesPage;
