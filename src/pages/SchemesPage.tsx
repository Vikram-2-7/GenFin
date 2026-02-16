import { useState } from 'react';
import { Award, ChevronDown, ChevronUp, Shield, Clock } from 'lucide-react';

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
}

interface SchemesPageProps {
  onSchemeDetail: (schemeId: string) => void;
}

function SchemesPage({ onSchemeDetail }: SchemesPageProps) {
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
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Government Savings Schemes</h1>
          <p className="text-lg text-gray-600">
            Explore safe, government-backed schemes with guaranteed returns and tax benefits.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Shield className="text-green-600 mt-1 flex-shrink-0" size={20} />
            <p className="ml-3 text-sm text-gray-700">
              <strong>100% Safe:</strong> All schemes listed here are backed by the Government of India with guaranteed returns. These are ideal for risk-averse investors and long-term financial planning.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => toggleExpand(scheme.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="text-green-600" size={24} />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{scheme.name}</h3>
                        <span className="text-sm text-gray-500">({scheme.shortName})</span>
                      </div>
                    </div>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium mb-3">
                      {scheme.type}
                    </span>
                    <p className="text-gray-600 mb-3">{scheme.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        <span className="text-gray-700">Interest: <strong>{scheme.interest}</strong></span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="text-gray-600 mr-1" />
                        <span className="text-gray-700">Tenure: <strong>{scheme.tenure}</strong></span>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    {expandedId === scheme.id ? (
                      <ChevronUp size={20} className="text-gray-600" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {expandedId === scheme.id && (
                <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Eligibility:</h4>
                      <ul className="space-y-2">
                        {scheme.eligibility.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {scheme.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Tax Benefits:</h4>
                    <p className="text-gray-700">{scheme.taxBenefits}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => onSchemeDetail(scheme.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Get Detailed Information
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Invest in Government Schemes</h3>
          <div className="space-y-3 text-gray-700">
            <p>Government schemes can be accessed through:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Post Offices:</strong> Most schemes available at your nearest post office</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Authorized Banks:</strong> Public and private sector banks offer several schemes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Online Platforms:</strong> Some schemes can be accessed through net banking</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Required Documents:</strong> Typically need Aadhaar, PAN, address proof, and photos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchemesPage;
