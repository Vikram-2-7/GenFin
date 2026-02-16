import { BookOpen, Target, AlertTriangle, TrendingUp, DollarSign, PieChart } from 'lucide-react';

function EducationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Education</h1>
          <p className="text-lg text-gray-600">
            Build a strong foundation in financial literacy and investment principles.
          </p>
        </div>

        <div className="grid gap-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Target className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Understanding Your Financial Goals</h2>
                <p className="text-gray-600">Setting clear objectives is the first step to financial success.</p>
              </div>
            </div>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">Short-term Goals (1-3 years)</h3>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Emergency fund creation (3-6 months expenses)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Vacation or gadget purchase</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Building initial savings habit</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Medium-term Goals (3-10 years)</h3>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Down payment for vehicle or home</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Higher education funding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Career advancement investments</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Long-term Goals (10+ years)</h3>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Retirement planning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Wealth creation and financial independence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Children's education and marriage</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <AlertTriangle className="text-yellow-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Understanding Risk</h2>
                <p className="text-gray-600">Learn how to evaluate and manage investment risks effectively.</p>
              </div>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Low Risk</h3>
                  <p className="text-sm text-gray-700">Government bonds, FDs, savings schemes. Suitable for conservative investors.</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Moderate Risk</h3>
                  <p className="text-sm text-gray-700">Debt funds, index ETFs, balanced funds. For steady growth seekers.</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">High Risk (Avoid)</h3>
                  <p className="text-sm text-gray-700">Individual stocks, derivatives, crypto. Not recommended for beginners.</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Risk Management Principles:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">1.</span>
                    <span>Never invest money you cannot afford to lose</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">2.</span>
                    <span>Diversify across different asset classes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">3.</span>
                    <span>Start with low-risk instruments and gradually progress</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">4.</span>
                    <span>Have an emergency fund before investing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <PieChart className="text-purple-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Power of Diversification</h2>
                <p className="text-gray-600">Spread your investments to minimize risk and maximize stability.</p>
              </div>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Diversification means not putting all your eggs in one basket. Here's a sample portfolio allocation for young investors:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Liquid Funds (Emergency)</span>
                      <span className="text-sm font-semibold">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Index ETFs</span>
                      <span className="text-sm font-semibold">30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Government Bonds</span>
                      <span className="text-sm font-semibold">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Debt Funds</span>
                      <span className="text-sm font-semibold">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Digital Gold</span>
                      <span className="text-sm font-semibold">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Why This Works:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>20% liquid for emergencies and peace of mind</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>55% in growth assets (ETFs, bonds, debt funds)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>25% in ultra-safe government instruments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>10% in gold as inflation hedge</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Power of Compounding</h2>
                <p className="text-gray-600">Understand how small, consistent investments grow exponentially over time.</p>
              </div>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Compounding is when your earnings generate their own earnings. The earlier you start, the more time your money has to grow.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Example: Monthly Investment of ₹3,000 at 10% annual return</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1">₹5.5 Lakhs</div>
                    <div className="text-sm text-gray-600">After 10 years</div>
                    <div className="text-xs text-gray-500 mt-1">Invested: ₹3.6L</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1">₹22.6 Lakhs</div>
                    <div className="text-sm text-gray-600">After 20 years</div>
                    <div className="text-xs text-gray-500 mt-1">Invested: ₹7.2L</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1">₹67.8 Lakhs</div>
                    <div className="text-sm text-gray-600">After 30 years</div>
                    <div className="text-xs text-gray-500 mt-1">Invested: ₹10.8L</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Note: This is an illustrative example. Actual returns may vary based on market conditions and chosen instruments.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <DollarSign className="text-orange-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Building Healthy Money Habits</h2>
                <p className="text-gray-600">Simple practices that lead to long-term financial wellness.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Do's:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Track your expenses monthly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Save before you spend (pay yourself first)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Automate your investments through SIPs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Review your portfolio quarterly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Educate yourself continuously</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Have adequate insurance coverage</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Don'ts:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Don't invest borrowed money</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Don't chase quick returns or hot tips</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Don't invest without understanding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Don't panic during market corrections</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Don't ignore tax planning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Don't compare with others' portfolios</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Principles for Success</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Patience</h3>
                <p className="text-sm text-gray-700">Wealth is built over years, not days. Stay committed to your plan.</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Discipline</h3>
                <p className="text-sm text-gray-700">Consistent small investments beat irregular large ones.</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Knowledge</h3>
                <p className="text-sm text-gray-700">Keep learning about finances, markets, and new opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EducationPage;
