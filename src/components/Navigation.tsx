import { Home, TrendingUp, Award, BookOpen, User, Zap, Target, Settings, Activity } from 'lucide-react';

type Page =
  | 'home'
  | 'investments'
  | 'schemes'
  | 'education'
  | 'profile'
  | 'scheme-detail'
  | 'budget-analysis'
  | 'slm-analysis'
  | 'goals'
  | 'tech-setup'
  | 'performance-test'
  | 'genfin-ai';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home' as Page, label: 'Home', icon: Home },
    { id: 'investments' as Page, label: 'Investments', icon: TrendingUp },
    { id: 'schemes' as Page, label: 'Schemes', icon: Award },
    { id: 'education' as Page, label: 'Learn', icon: BookOpen },
    { id: 'profile' as Page, label: 'Profile', icon: User },
    { id: 'budget-analysis' as Page, label: 'Budget Analysis', icon: Activity },
    { id: 'slm-analysis' as Page, label: 'SLM Analysis', icon: Zap },
    { id: 'goals' as Page, label: 'Financial Goals', icon: Target },
    { id: 'tech-setup' as Page, label: 'System Setup', icon: Settings },
    { id: 'performance-test' as Page, label: 'Performance Test', icon: Activity },
    { id: 'genfin-ai' as Page, label: 'GenFin.ai', icon: Zap }
  ];

  return (
    <nav className="bg-slate-950/95 border-b border-slate-800 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              GenFin
            </span>
            <span className="ml-2 text-xs uppercase tracking-[0.25em] text-slate-400">
              Financial Journey
            </span>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <Icon size={16} />
                  <span className="ml-2">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
