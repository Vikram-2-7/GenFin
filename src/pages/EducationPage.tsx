import { BookOpen, Target, AlertTriangle, TrendingUp, DollarSign, PieChart, Zap, Award } from 'lucide-react';

function EducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Financial Education & Mastery</h1>
          <p className="text-lg text-slate-400">
            Build a strong foundation in financial literacy, investment principles, and wealth creation strategies.
          </p>
        </div>

        <div className="grid gap-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mr-4">
                <Target className="text-blue-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Understanding Your Financial Goals</h2>
                <p className="text-slate-400">Setting clear objectives is the first step to financial success.</p>
              </div>
            </div>
            <div className="space-y-4 text-slate-300">
              <div>
                <h3 className="font-bold text-slate-100 mb-2 flex items-center"><span className="text-blue-400 mr-2">●</span>Short-term Goals (1-3 years)</h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">→</span>
                    <span>Emergency fund creation (3-6 months expenses)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">→</span>
                    <span>Vacation or gadget purchase</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">→</span>
                    <span>Building initial savings habit</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-100 mb-2 flex items-center"><span className="text-emerald-400 mr-2">●</span>Medium-term Goals (3-10 years)</h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">→</span>
                    <span>Down payment for vehicle or home</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">→</span>
                    <span>Higher education funding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">→</span>
                    <span>Career advancement investments</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-100 mb-2 flex items-center"><span className="text-amber-400 mr-2">●</span>Long-term Goals (10+ years)</h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">→</span>
                    <span>Retirement planning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">→</span>
                    <span>Wealth creation and financial independence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">→</span>
                    <span>Children's education and marriage</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg flex items-center justify-center mr-4">
                <AlertTriangle className="text-amber-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Understanding Risk</h2>
                <p className="text-slate-400">Learn how to evaluate and manage investment risks effectively.</p>
              </div>
            </div>
            <div className="space-y-6 text-slate-300">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-lg">
                  <h3 className="font-bold text-emerald-300 mb-2">Low Risk</h3>
                  <p className="text-sm text-slate-300">Government bonds, FDs, savings schemes. Suitable for conservative investors.</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg">
                  <h3 className="font-bold text-blue-300 mb-2">Moderate Risk</h3>
                  <p className="text-sm text-slate-300">Debt funds, index ETFs, balanced funds. For steady growth seekers.</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-lg">
                  <h3 className="font-bold text-red-300 mb-2">High Risk (Avoid)</h3>
                  <p className="text-sm text-slate-300">Individual stocks, derivatives, crypto. Not recommended for beginners.</p>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-r from-blue-900/30 to-slate-800 border border-blue-800/50 rounded-lg">
                <h3 className="font-bold text-slate-100 mb-4 flex items-center">
                  <Award size={20} className="text-blue-400 mr-2" />
                  Risk Management Principles
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-400 font-bold mr-3">1.</span>
                    <span>Never invest money you cannot afford to lose</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 font-bold mr-3">2.</span>
                    <span>Diversify across different asset classes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 font-bold mr-3">3.</span>
                    <span>Start with low-risk instruments and gradually progress</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 font-bold mr-3">4.</span>
                    <span>Have an emergency fund before investing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mr-4">
                <PieChart className="text-purple-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Power of Diversification</h2>
                <p className="text-slate-400">Spread your investments to minimize risk and maximize stability.</p>
              </div>
            </div>
            <div className="space-y-4 text-slate-300">
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

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="text-emerald-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Power of Compounding</h2>
                <p className="text-slate-400">Understand how small, consistent investments grow exponentially over time.</p>
              </div>
            </div>
            <div className="space-y-4 text-slate-300">
              <p>Compounding is when your earnings generate their own earnings. The earlier you start, the more time your money has to grow.</p>
              <div className="bg-gradient-to-r from-blue-900/30 to-slate-800 border border-blue-800/50 rounded-lg p-4">
                <h3 className="font-bold text-slate-100 mb-3">Example: Monthly Investment of ₹3,000 at 10% annual return</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-300 mb-1">₹5.5 Lakhs</div>
                    <div className="text-sm text-slate-400">After 10 years</div>
                    <div className="text-xs text-slate-500 mt-1">Invested: ₹3.6L</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-300 mb-1">₹22.6 Lakhs</div>
                    <div className="text-sm text-slate-400">After 20 years</div>
                    <div className="text-xs text-slate-500 mt-1">Invested: ₹7.2L</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-300 mb-1">₹67.8 Lakhs</div>
                    <div className="text-sm text-slate-400">After 30 years</div>
                    <div className="text-xs text-slate-500 mt-1">Invested: ₹10.8L</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Note: This is an illustrative example. Actual returns may vary based on market conditions and chosen instruments.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center mr-4">
                <DollarSign className="text-orange-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Building Healthy Money Habits</h2>
                <p className="text-slate-400">Simple practices that lead to long-term financial wellness.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-slate-100 mb-3 flex items-center"><Zap size={18} className="text-emerald-400 mr-2" />Do's:</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2 font-bold">✓</span>
                    <span>Track your expenses monthly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2 font-bold">✓</span>
                    <span>Save before you spend (pay yourself first)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2 font-bold">✓</span>
                    <span>Automate your investments through SIPs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2 font-bold">✓</span>
                    <span>Review your portfolio quarterly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2 font-bold">✓</span>
                    <span>Educate yourself continuously</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2 font-bold">✓</span>
                    <span>Have adequate insurance coverage</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-100 mb-3 flex items-center"><AlertTriangle size={18} className="text-red-400 mr-2" />Don'ts:</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2 font-bold">✗</span>
                    <span>Don't invest borrowed money</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2 font-bold">✗</span>
                    <span>Don't chase quick returns or hot tips</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2 font-bold">✗</span>
                    <span>Don't invest without understanding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2 font-bold">✗</span>
                    <span>Don't panic during market corrections</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2 font-bold">✗</span>
                    <span>Don't ignore tax planning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2 font-bold">✗</span>
                    <span>Don't compare with others' portfolios</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-900/20 via-slate-800 to-blue-900/20 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Key Principles for Success</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-lg">
                <h3 className="font-bold text-slate-100 mb-2 flex items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                  Patience
                </h3>
                <p className="text-sm text-slate-400">Wealth is built over years, not days. Stay committed to your plan.</p>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-lg">
                <h3 className="font-bold text-slate-100 mb-2 flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  Discipline
                </h3>
                <p className="text-sm text-slate-400">Consistent small investments beat irregular large ones.</p>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-lg">
                <h3 className="font-bold text-slate-100 mb-2 flex items-center">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                  Knowledge
                </h3>
                <p className="text-sm text-slate-400">Keep learning about finances, markets, and new opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EducationPage;
