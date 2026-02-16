import { useState } from 'react';
import { User, Mail, Phone, Calendar, Shield, Lock, Bell, HelpCircle, CheckCircle, Zap } from 'lucide-react';

function ProfilePage() {
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

  const [result, setResult] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [mindsetSelected, setMindsetSelected] = useState(null);
  const [financialStatus, setFinancialStatus] = useState(null);

  const handleSaveProfile = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
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

  const handleAssessment = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          income: Number(formData.income),
          expenses: Number(formData.expenses),
          savings: Number(formData.savings),
          debt: Number(formData.debt),
          emergencyFundMonths: Number(formData.emergencyFundMonths)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        setResult(null);
        return;
      }

      setResult(data);
    } catch (error) {
      alert("Server not reachable. Please try again.");
      console.error("Frontend error:", error);
    }
  };

  const handlePersonalSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile/personal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert("Personal details saved successfully!");
    } catch (error) {
      alert("Server error.");
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
          <div className="mb-6 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/50 rounded-lg p-4 animate-pulse">
            <div className="flex items-center">
              <CheckCircle className="text-emerald-400 mr-3" size={20} />
              <p className="text-emerald-300 font-medium">Profile updated successfully! Your preferences are saved.</p>
            </div>
          </div>
        )}

        <div className="grid gap-8">
          {/* Personal Information Section */}
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

              <button
                onClick={handlePersonalSave}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-blue-500/30"
              >
                Save Personal Details
              </button>
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
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
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
              <h3 className="text-2xl font-bold text-slate-100 mb-4">Financial Assessment</h3>
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
              {result && (
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/50 rounded-lg">
                  <h3 className="text-xl font-bold text-slate-100 mb-4">Your Financial Scores</h3>
                  <div className="space-y-2 text-slate-200">
                    <p>Risk Score: {result.riskScore || 'N/A'}</p>
                    <p>Stability Score: {result.stabilityScore || 'N/A'}</p>
                    <p>Investment Readiness: {result.readinessScore || 'N/A'}</p>
                  </div>
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
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
