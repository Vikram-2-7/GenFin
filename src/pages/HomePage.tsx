import { AlertCircle, Shield, TrendingUp, Award, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import ProgressRoadmap from '../components/ProgressRoadmap';

type Page = 'home' | 'investments' | 'schemes' | 'education' | 'profile';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <header className="max-w-7xl mx-auto px-4 py-8 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">GenFin</p>
              <p className="text-xs text-slate-400">Financial Journey</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-emerald-500/50"
          >
            Start Journey
          </button>
        </div>
      </header>

      <main className="w-full">
        <div className="text-center py-16 px-4 border-b border-slate-700">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-slate-100 via-emerald-300 to-blue-300 bg-clip-text text-transparent leading-tight">
            Your Financial Academy Awaits
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-2 leading-relaxed">
            Master the art of disciplined investing. Learn, grow, and secure your financial future through structured guidance.
          </p>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">Tailored for young Indians aged 18+, following RBI regulations</p>
        </div>

        <ProgressRoadmap currentStage="mindset" onStageClick={onNavigate} />

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800 border border-emerald-800/50 rounded-xl p-8 mb-16 backdrop-blur-sm">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-emerald-400" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-slate-100 mb-2">Your Financial Safety Commitment</h3>
                <p className="text-slate-300 leading-relaxed">
                  GenFin operates under strict compliance with Indian financial regulations. We invest only from your <strong>surplus funds</strong> after all obligations are met. <strong>No profits guaranteed.</strong> However, we maintain your principal and provide accurate, transparent guidance. Your data is encrypted and secure.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div
              onClick={() => onNavigate('investments')}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <TrendingUp className="text-blue-400 group-hover:text-blue-300" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Safe Investments</h3>
              <p className="text-slate-400 mb-4 text-sm">
                Bonds, ETFs, debt funds, and regulated digital gold. Curated for low-risk growth.
              </p>
              <span className="text-blue-400 font-medium inline-flex items-center text-sm">
                Explore <ArrowRight className="ml-1" size={16} />
              </span>
            </div>

            <div
              onClick={() => onNavigate('schemes')}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-emerald-500/10 transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
                <Award className="text-emerald-400 group-hover:text-emerald-300" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Govt Schemes</h3>
              <p className="text-slate-400 mb-4 text-sm">
                PPF, SSY, NSC, and more. Government-backed security with tax benefits.
              </p>
              <span className="text-emerald-400 font-medium inline-flex items-center text-sm">
                Discover <ArrowRight className="ml-1" size={16} />
              </span>
            </div>

            <div
              onClick={() => onNavigate('education')}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-amber-500/10 transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                <BookOpen className="text-amber-400 group-hover:text-amber-300" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Learn Finance</h3>
              <p className="text-slate-400 mb-4 text-sm">
                Master investment principles, risk management, and building wealth step-by-step.
              </p>
              <span className="text-amber-400 font-medium inline-flex items-center text-sm">
                Study <ArrowRight className="ml-1" size={16} />
              </span>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-br from-emerald-900/20 via-slate-800 to-blue-900/20 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
            <div className="flex items-start mb-6">
              <Shield className="text-emerald-400 flex-shrink-0" size={32} />
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">Why GenFin Matters</h2>
                <div className="grid md:grid-cols-2 gap-6 text-slate-300">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <p><span className="text-emerald-300 font-semibold">Specialized Training:</span> AI trained specifically for low-risk, regulatory-compliant investment guidance.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <p><span className="text-blue-300 font-semibold">Bank-Level Security:</span> Military-grade encryption for all personal and financial data.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <p><span className="text-emerald-300 font-semibold">RBI Compliant:</span> All schemes and recommendations follow Indian regulatory standards.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <p><span className="text-blue-300 font-semibold">Principal Accountability:</span> We're committed to maintaining your investment principal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-700 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-slate-500 text-xs">
            GenFin - Financial Journey for Young Adults (18+) | RBI Compliant | Secure & Transparent
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
