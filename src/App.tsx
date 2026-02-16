import { useState } from 'react';
import HomePage from './pages/HomePage';
import InvestmentsPage from './pages/InvestmentsPage';
import SchemesPage from './pages/SchemesPage';
import EducationPage from './pages/EducationPage';
import ProfilePage from './pages/ProfilePage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import Navigation from './components/Navigation';

type Page = 'home' | 'investments' | 'schemes' | 'education' | 'profile' | 'scheme-detail';

interface AppState {
  page: Page;
  selectedSchemeId?: string;
}

function App() {
  const [state, setState] = useState<AppState>({ page: 'home' });

  const navigate = (page: Page, selectedSchemeId?: string) => {
    setState({ page, selectedSchemeId });
  };

  const renderPage = () => {
    switch (state.page) {
      case 'home':
        return <HomePage onNavigate={(p) => navigate(p)} />;
      case 'investments':
        return <InvestmentsPage />;
      case 'schemes':
        return <SchemesPage onSchemeDetail={(id) => navigate('scheme-detail', id)} />;
      case 'education':
        return <EducationPage />;
      case 'profile':
        return <ProfilePage />;
      case 'scheme-detail':
        return (
          <SchemeDetailPage
            schemeId={state.selectedSchemeId || ''}
            onBack={() => navigate('schemes')}
          />
        );
      default:
        return <HomePage onNavigate={(p) => navigate(p)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {state.page !== 'home' && (
        <Navigation
          currentPage={state.page as 'investments' | 'schemes' | 'education' | 'profile'}
          onNavigate={(p) => navigate(p)}
        />
      )}
      {renderPage()}
    </div>
  );
}

export default App;
