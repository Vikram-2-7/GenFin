import { Home, TrendingUp, Award, BookOpen, User } from 'lucide-react';

type Page = 'home' | 'investments' | 'schemes' | 'education' | 'profile';

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
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-semibold text-gray-900">GenFin</span>
            <span className="ml-2 text-sm text-gray-500">Financial Assistant</span>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="ml-2 text-sm font-medium">{item.label}</span>
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
