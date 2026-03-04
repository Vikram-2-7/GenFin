import { useState } from 'react';
import HomePage from './pages/HomePage';
import InvestmentsPage from './pages/InvestmentsPage';
import SchemesPage from './pages/SchemesPage';
import EducationPage from './pages/EducationPage';
import ProfilePage from './pages/ProfilePage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import Navigation from './components/Navigation';
import BudgetOptimizationTool from './components/BudgetOptimizationTool';
import SLMAnalysisPage from './components/SLMAnalysisPage';
import FinancialGoalsDashboard from './components/FinancialGoalsDashboard';
import OllamaSetupValidator from './components/OllamaSetupValidator';
import SLMPerformanceBenchmark from './components/SLMPerformanceBenchmark';

type Page = 'home' | 'investments' | 'schemes' | 'education' | 'profile' | 'scheme-detail' | 'budget-analysis' | 'slm-analysis' | 'goals' | 'tech-setup' | 'performance-test';

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
      case 'budget-analysis':
        return <BudgetOptimizationTool />;
      case 'slm-analysis':
        return <SLMAnalysisPage />;
      case 'goals':
        return <FinancialGoalsDashboard />;
      case 'tech-setup':
        return <OllamaSetupValidator />;
      case 'performance-test':
        return <SLMPerformanceBenchmark />;
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
