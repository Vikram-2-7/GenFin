import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { API_BASE } from '../config/api';
import { FinancialScoreCard } from './chat/FinancialScoreCard';
import { InvestmentPlanCard } from './chat/InvestmentPlanCard';
import { Sparkles, Send, Shield, Activity, TrendingUp, AlertCircle, CheckCircle, Target, BarChart3, User, DollarSign, PiggyBank, Target as TargetIcon, Trash2 } from 'lucide-react';

interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'financial-summary' | 'guided-path' | 'statistics' | 'milestones';
  data?: any;
  timestamp?: string;
  guiType?: 'SCORE_CARD' | 'INVESTMENT_PLAN' | null;
  showButton?: { label: string; route: string } | null;
  showButtons?: { label: string; route: string }[] | null;
}

interface FinancialProfile {
  income?: number;
  expenses?: number;
  savings?: number;
  debt?: number;
  emergencyFundMonths?: number;
  age?: number;
  investmentMindset?: string;
  financialStatus?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  financialGoals?: string;
  timeHorizon?: string;
}

interface FinancialSummary {
  analysis: any;
  statistics: any;
  guidedPath: any;
  actionPlan: any[];
  investmentReadiness: any;
  profileHealth: any;
}

// Load profile from database
async function loadProfileFromDatabase(): Promise<FinancialProfile | null> {
  try {
    const response = await fetch(`${API_BASE}/api/profile`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.profile) {
        console.log('✅ Profile loaded from database:', data.profile);
        return data.profile;
      }
    }
  } catch (error) {
    console.error('Error loading profile from database:', error);
  }
  return null;
}

// Calculate financial metrics from real profile data
function calculateFinancialMetrics(profile: FinancialProfile) {
  if (!profile || !profile.income || !profile.expenses) {
    return {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      monthlySavings: 0,
      netCashFlow: 0,
      savingsRate: 0,
      emergencyFundMonths: 0,
      emergencyFundAdequacy: 0,
      readinessScore: 0,
      canInvest: false,
      recommendedInvestmentAmount: 0
    };
  }

  const monthlyIncome = profile.income;
  const monthlyExpenses = profile.expenses;
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const netCashFlow = monthlySavings;
  const savingsRate = (monthlySavings / monthlyIncome) * 100;
  const emergencyFundMonths = profile.emergencyFundMonths || 0;
  const emergencyFundAdequacy = Math.min(100, (emergencyFundMonths / 6) * 100);
  
  // Calculate readiness score
  let readinessScore = 0;
  
  // Savings rate points
  if (savingsRate > 20) readinessScore += 25;
  else if (savingsRate >= 10) readinessScore += 15;
  
  // Emergency fund points
  if (emergencyFundMonths >= 6) readinessScore += 25;
  else if (emergencyFundMonths >= 3) readinessScore += 15;
  
  // DTI points
  const dti = profile.debt && profile.income ? (profile.debt / (profile.income * 12)) * 100 : 0;
  if (dti < 30) readinessScore += 25;
  else if (dti <= 40) readinessScore += 15;
  
  // Financial goals points
  if (profile.financialGoals || profile.investmentMindset) readinessScore += 25;
  
  const canInvest = readinessScore >= 50;
  const recommendedInvestmentAmount = canInvest ? monthlySavings * 0.3 : 0;
  
  return {
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    netCashFlow,
    savingsRate,
    emergencyFundMonths,
    emergencyFundAdequacy,
    readinessScore,
    canInvest,
    recommendedInvestmentAmount
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function getHealthColor(score: number): string {
  if (score >= 75) return 'text-emerald-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

function getHealthBgColor(score: number): string {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export default function GenFinChatPage() {
  // State management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [financialMetrics, setFinancialMetrics] = useState<any>(null);
  const [proactiveSuggestions, setProactiveSuggestions] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load profile and chat history on mount
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🔍 DEBUG: Initializing GenFin Chat Page...');
      
      // THREE checks simultaneously
      const [profileData, chatHistory, isLoggedIn] = await Promise.all([
        loadProfileFromDatabase(),
        loadChatHistory(),
        Promise.resolve(!!localStorage.getItem('token'))
      ]);
      
      console.log('🔍 DEBUG: Profile:', profileData);
      console.log('🔍 DEBUG: Chat History:', chatHistory);
      console.log('🔍 DEBUG: Logged In:', isLoggedIn);
      
      // SCENARIO A: Not logged in
      if (!isLoggedIn) {
        setMessages([{
          role: 'assistant',
          content: `Welcome to GenFin.ai! 👋

I'm your personal AI financial advisor for India.
I can help you with investments, tax planning,
debt management, and wealth building.

To get **personalized advice** based on your
actual financial situation, please:
1. Sign in to your account
2. Complete your financial profile

➡️ [Sign In] [Create Account]

You can still ask me general finance questions
without signing in!`,
          timestamp: new Date().toISOString(),
          showButtons: [
            { label: 'Sign In', route: '/login' },
            { label: 'Create Account', route: '/signup' }
          ]
        }]);
        return;
      }
      
      // SCENARIO B: Logged in, profile NOT filled
      if (!profileData || !profileData.income) {
        const firstName = profileData?.fullName?.split(' ')[0] || 'there';
        setMessages([{
          role: 'assistant',
          content: `Welcome back, ${firstName}! 

I'm ready to help with your finances. I notice
your financial profile isn't complete yet.

**Without profile:** I can answer all general
finance questions, explain concepts, and give
general guidance.

**With profile:** I'll give you personalized
investment plans, analyze your specific situation,
and track your financial health automatically.

➡️ [Complete Profile Now] ← button to /profile

What would you like to know today?`,
          timestamp: new Date().toISOString(),
          showButtons: [
            { label: 'Complete Profile Now', route: '/profile' }
          ]
        }]);
        return;
      }
      
      // SCENARIO C: Logged in, profile IS filled
      if (profileData && profileData.income) {
        setProfile(profileData);
        const metrics = calculateFinancialMetrics(profileData);
        setFinancialMetrics(metrics);
        
        const firstName = profileData.fullName?.split(' ')[0] || 'there';
        const score = metrics.readinessScore;
        const scoreColor = score >= 75 ? '🟢' : score >= 50 ? '🟡' : score >= 25 ? '🟠' : '🔴';
        
        let statusMessage = '';
        if (score >= 75) {
          statusMessage = "You're investment-ready! Let's grow your wealth.";
        } else if (score >= 50) {
          statusMessage = "Good progress! A few steps to investment-ready.";
        } else if (score >= 25) {
          statusMessage = "Building foundation. I'll guide you step by step.";
        } else {
          statusMessage = "Let's start from basics. I'm here to help.";
        }
        
        const welcomeMessage = `Welcome back, ${firstName}! 

Here's your financial snapshot:

📊 Readiness Score: ${score}/100  ${scoreColor}
💰 Monthly Savings: ₹${metrics.monthlySavings.toLocaleString('en-IN')}
🛡️ Emergency Fund: ${metrics.emergencyFundMonths} months coverage
📈 Savings Rate: ${metrics.savingsRate}%

${statusMessage}

Ask me anything or try:
- 'Show my investment plan'
- 'Analyze my finances'  
- 'Which government schemes suit me?'`;
        
        // SCENARIO D: Check for returning user with chat history
        const finalMessages = chatHistory && chatHistory.length > 0 ? [
          {
            role: 'system',
            content: '── Previous conversation ──',
            timestamp: new Date().toISOString()
          },
          {
            role: 'assistant',
            content: `Welcome back ${firstName}! 
Continuing our conversation.`,
            timestamp: new Date().toISOString()
          },
          ...chatHistory,
          {
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date().toISOString(),
            guiType: 'SCORE_CARD'
          }
        ] : [
          {
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date().toISOString(),
            guiType: 'SCORE_CARD'
          }
        ];
        
        setMessages(finalMessages);
        return;
      }
    };

    initializeApp();
  }, []);

  // Autonomous suggestions based on profile data
  useEffect(() => {
    if (!profile?.income || !financialMetrics) return;

    const suggestions = [];
    const score = financialMetrics.readinessScore;
    const coverage = parseFloat(financialMetrics.emergencyCoverage || '0');
    const dti = parseFloat(financialMetrics.dti || '0');
    const savingsRate = parseFloat(financialMetrics.savingsRate || '0');

    // Autonomous suggestions based on data
    if (coverage < 3) {
      suggestions.push({
        type: 'WARNING',
        icon: '🚨',
        message: 'Your emergency fund covers only ' +
          coverage + ' months. Aim for 6 months.',
        action: 'How do I build my emergency fund?'
      });
    }

    if (dti > 40) {
      suggestions.push({
        type: 'WARNING',
        icon: '⚠️',
        message: 'Your debt-to-income ratio is ' +
          dti + '%. This is above the safe 40% threshold.',
        action: 'Help me reduce my debt'
      });
    }

    if (savingsRate < 10 && savingsRate >= 0) {
      suggestions.push({
        type: 'IMPROVE',
        icon: '💡',
        message: 'Your savings rate is ' + savingsRate +
          '%. Increasing to 20% will accelerate wealth building.',
        action: 'How can I increase my savings rate?'
      });
    }

    if (score >= 50 && score < 75) {
      suggestions.push({
        type: 'OPPORTUNITY',
        icon: '📈',
        message: 'You are close to investment-ready! ' +
          'A few improvements and you can start investing.',
        action: 'Show me my investment plan'
      });
    }

    if (score >= 75) {
      suggestions.push({
        type: 'SUCCESS',
        icon: '🎯',
        message: 'You are investment-ready with a score of ' +
          score + '/100! Time to grow your wealth.',
        action: 'Create my investment plan'
      });
    }

    setProactiveSuggestions(suggestions);
  }, [financialMetrics, profile]);

  // Load chat history from database
  const loadChatHistory = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'default';
      const response = await fetch(`${API_BASE}/api/chat/history?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.messages) {
          console.log('✅ Chat history loaded:', data.messages);
          return data.messages;
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    return [];
  };

  // Save message to database
  const saveMessageToDatabase = async (role: 'user' | 'assistant', content: string) => {
    try {
      const userId = localStorage.getItem('userId') || 'default';
      const response = await fetch(`${API_BASE}/api/chat/message`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ role, content })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('💬 Message saved to database:', data.message._id);
          return data.message;
        }
      }
    } catch (error) {
      console.error('Error saving message to database:', error);
    }
    return null;
  };

  // Clear chat history
  const clearChatHistory = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'default';
      const response = await fetch(`${API_BASE}/api/chat/history?userId=${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('� Chat history cleared:', data.deletedCount, 'messages');
          
          // Reset to welcome message
          if (profile && financialMetrics) {
            const readinessScore = financialMetrics.readinessScore;
            let proactiveMessage = '';
            
            if (readinessScore >= 75) {
              proactiveMessage = `Perfect! I can see you have a solid financial foundation! Your readiness score is ${readinessScore}/100. I'm now ready to provide you with comprehensive AI-powered financial guidance. Ask me anything about your finances!`;
            } else if (readinessScore >= 50) {
              proactiveMessage = `Great! I can see you're making good progress! Your readiness score is ${readinessScore}/100. I'm now ready to analyze your financial situation and provide personalized guidance. What would you like to explore?`;
            } else {
              proactiveMessage = `Welcome back! I can see you're in the early stages of your financial journey. Your readiness score is ${readinessScore}/100. Don't worry - I'm here to help you build a strong foundation. What would you like to work on first?`;
            }
            
            setMessages([{
              role: 'assistant',
              content: proactiveMessage,
              timestamp: new Date().toISOString()
            }]);
          } else {
            setMessages([{
              role: 'assistant',
              content: '**Welcome to GenFin.ai - Your Intelligent Financial Health Assistant!**\n\nI\'m here to provide you with personalized financial guidance, but first I need to understand your financial situation.\n\n**📋 Required Information:**\n• Monthly income & expenses\n• Savings amount\n• Current debt (if any)\n• Emergency fund status\n• Investment preferences\n\n**⚡ Quick Start:**\n1. Click the **Profile** button in the navigation above\n2. Fill in your financial information\n3. Click "Analyze Financial Health"\n4. Save your profile\n5. Come back here for personalized guidance!\n\nYour financial data is stored securely and used only to provide you with better guidance. Let\'s get started on your financial journey! 🌟',
              timestamp: new Date().toISOString()
            }]);
          }
        }
      }
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  const fetchFinancialSummary = async () => {
    if (!profile) return null;
    
    try {
      const response = await fetch('http://localhost:5000/api/slm/financial-health-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Financial summary error:', error);
      return null;
    }
  };

  const generateFinancialSummaryMessage = async () => {
    if (!profile) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I need your financial profile to provide personalized analysis. Please complete your profile first.',
        type: 'text'
      }]);
      return;
    }

    setLoading(true);
    
    try {
      const summary = await fetchFinancialSummary();
      
      if (!summary) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I encountered an error while analyzing your financial data. Please try again.',
          type: 'text'
        }]);
        return;
      }

      const summaryMessage: ChatMessage = {
        role: 'assistant',
        content: 'Here\'s your comprehensive financial health analysis:',
        type: 'financial-summary',
        data: summary
      };

      setMessages([...messages, summaryMessage]);
    } catch (error) {
      console.error('Summary generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateGuidedPathMessage = async () => {
    if (!profile) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I need your financial profile to create a guided path. Please complete your profile first.',
        type: 'text'
      }]);
      return;
    }

    setLoading(true);
    
    try {
      const summary = await fetchFinancialSummary();
      
      if (!summary) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I encountered an error while creating your guided path. Please try again.',
          type: 'text'
        }]);
        return;
      }

      const pathMessage: ChatMessage = {
        role: 'assistant',
        content: 'Here\'s your personalized financial journey path:',
        type: 'guided-path',
        data: summary.guidedPath
      };

      setMessages(prev => [...prev, pathMessage]);
      // Attempt to save to db
      saveMessageToDatabase('assistant', 'Here is your personalized financial journey path: (Guided Path)');
    } catch (error) {
      console.error('Guided path generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateStatisticsMessage = async () => {
    if (!profile) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I need your financial profile to show statistics. Please complete your profile first.',
        type: 'text'
      }]);
      return;
    }

    setLoading(true);
    
    try {
      const summary = await fetchFinancialSummary();
      
      if (!summary) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I encountered an error while generating statistics. Please try again.',
          type: 'text'
        }]);
        return;
      }

      const statsMessage: ChatMessage = {
        role: 'assistant',
        content: 'Your financial statistics at a glance:',
        type: 'statistics',
        data: summary.statistics
      };

      setMessages(prev => [...prev, statsMessage]);
      saveMessageToDatabase('assistant', 'Here are your financial statistics.');
    } catch (error) {
      console.error('Statistics generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (userMessage?: string) => {
    const message = userMessage || input.trim();
    if (!message || loading) return;

    // Add user message to chat
    const userMsg: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId') || 'default';

      const response = await fetch(
        `${API_BASE}/api/slm/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message,
            userId,
            userProfile: profile,
            isProfileFilled: !!profile?.income
          })
        }
      );

      const data = await response.json();

      // Determine if GUI should be shown
      let guiType: 'SCORE_CARD' | 'INVESTMENT_PLAN' | null = null;
      const msgLower = message.toLowerCase();

      if (profile?.income) {
        if (msgLower.includes('score') ||
            msgLower.includes('analyze') ||
            msgLower.includes('my finances') ||
            msgLower.includes('health')) {
          guiType = 'SCORE_CARD';
        }
        if (msgLower.includes('plan') ||
            msgLower.includes('invest') ||
            msgLower.includes('scheme') ||
            msgLower.includes('portfolio') ||
            msgLower.includes('allocat')) {
          guiType = 'INVESTMENT_PLAN';
        }
      }

      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        guiType,
        showButton: data.showButton || null
      };

      setMessages(prev => [...prev, aiMsg]);

      // Save to DB
      await saveMessageToDatabase('user', message);
      await saveMessageToDatabase('assistant', data.reply);

    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        id: Date.now() + 1
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = (message: ChatMessage, idx: number) => {
    // Handle GUI components
    if (message.guiType === 'SCORE_CARD') {
      return (
        <div key={idx} className="flex justify-start">
          <div className="max-w-[80%]">
            <p style={{ color: '#94a3b8', fontSize: '0.85rem',
              marginBottom: '8px' }}>
              {message.content}
            </p>
            <FinancialScoreCard
              profile={profile}
              metrics={financialMetrics}
            />
          </div>
        </div>
      );
    }

    if (message.guiType === 'INVESTMENT_PLAN') {
      return (
        <div key={idx} className="flex justify-start">
          <div className="max-w-[80%]">
            <p style={{ color: '#94a3b8', fontSize: '0.85rem',
              marginBottom: '8px' }}>
              {message.content}
            </p>
            <InvestmentPlanCard
              profile={profile}
              metrics={financialMetrics}
              onSchemeClick={(id) => window.location.href = `/schemes?scheme=${id}`}
            />
          </div>
        </div>
      );
    }

    if (message.showButton) {
      return (
        <div key={idx} className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-slate-800/80 border border-slate-700 text-slate-100">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            <button
              onClick={() => window.location.href = message.showButton!.route}
              style={{
                marginTop: '12px',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', borderRadius: '10px',
                color: 'white', fontWeight: 700,
                fontSize: '0.85rem', cursor: 'pointer'
              }}>
              {message.showButton.label}
            </button>
          </div>
        </div>
      );
    }

    if (message.showButtons && message.showButtons.length > 0) {
      return (
        <div key={idx} className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-slate-800/80 border border-slate-700 text-slate-100">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {message.showButtons.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => window.location.href = btn.route}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none', borderRadius: '8px',
                    color: 'white', fontWeight: 600,
                    fontSize: '0.8rem', cursor: 'pointer'
                  }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (message.type === 'financial-summary') {
      return <FinancialSummaryMessage key={idx} data={message.data} />;
    }
    
    if (message.type === 'guided-path') {
      return <GuidedPathMessage key={idx} data={message.data} />;
    }
    
    if (message.type === 'statistics') {
      return <StatisticsMessage key={idx} data={message.data} />;
    }
    
    return (
      <div
        key={idx}
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            message.role === 'user'
              ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white'
              : message.role === 'system'
              ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
              : 'bg-slate-800/80 border border-slate-700 text-slate-100'
          }`}
        >
          <div className="ai-message-content">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };

  const FinancialSummaryMessage = ({ data }: { data: FinancialSummary }) => (
    <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="text-cyan-400" size={20} />
        <h3 className="text-lg font-semibold text-slate-100">Financial Health Analysis</h3>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Readiness Score</div>
          <div className={`text-xl font-bold ${getHealthColor(data.analysis.readinessScore)}`}>
            {data.analysis.readinessScore}/100
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Savings Rate</div>
          <div className="text-xl font-bold text-emerald-400">
            {data.analysis.savingsRate}%
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Emergency Fund</div>
          <div className="text-xl font-bold text-blue-400">
            {data.statistics.emergencyFund.currentMonths} months
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Risk Level</div>
          <div className={`text-xl font-bold ${getHealthColor(100 - data.analysis.riskScore)}`}>
            {data.analysis.riskScore > 60 ? 'High' : data.analysis.riskScore > 30 ? 'Medium' : 'Low'}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className={`p-3 rounded-lg border ${
        data.analysis.stateCategory === 'healthy' ? 'bg-emerald-500/20 border-emerald-500/50' :
        data.analysis.stateCategory === 'caution' ? 'bg-yellow-500/20 border-yellow-500/50' :
        'bg-red-500/20 border-red-500/50'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {data.analysis.stateCategory === 'healthy' ? <CheckCircle className="text-emerald-400" size={16} /> :
           data.analysis.stateCategory === 'caution' ? <AlertCircle className="text-yellow-400" size={16} /> :
           <AlertCircle className="text-red-400" size={16} />}
          <span className="font-semibold text-slate-100">{data.analysis.status}</span>
        </div>
        <p className="text-sm text-slate-300">{data.analysis.recommendation}</p>
      </div>

      {/* Top Actions */}
      {data.actionPlan.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
            <Target size={16} className="text-cyan-400" />
            Immediate Actions
          </h4>
          <div className="space-y-2">
            {data.actionPlan.slice(0, 3).map((action, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-700/30 rounded-lg p-2">
                <span className="text-cyan-400 font-semibold text-sm">{i + 1}.</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-100">{action.task}</div>
                  <div className="text-xs text-slate-400">{action.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const GuidedPathMessage = ({ data }: { data: any }) => (
    <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <TargetIcon className="text-purple-400" size={20} />
        <h3 className="text-lg font-semibold text-slate-100">Your Financial Journey Path</h3>
      </div>

      {/* Current Phase */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-slate-100">Current Stage: {data?.currentStage || 'Getting Started'}</h4>
          <span className="text-sm text-purple-300">{data?.timeline || '6-12 months'}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${100}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-300 mt-2">Next Steps</p>
        <p className="text-xs text-slate-400 mt-1">Estimated Timeline: {data?.timeline || '6-12 months'}</p>
      </div>

      {/* Immediate Actions */}
      <div>
        <h4 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-400" />
          Immediate Actions
        </h4>
        <div className="space-y-2">
          {(data?.priorityActions || []).map((action: string, i: number) => (
            <div key={i} className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2">
              <CheckCircle className="text-emerald-400 mt-0.5" size={14} />
              <span className="text-sm text-slate-200">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      {data.milestones && data.milestones.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
            <TrendingUp size={16} className="text-cyan-400" />
            Key Milestones
          </h4>
          <div className="space-y-2">
            {data.milestones.map((milestone: any, i: number) => (
              <div key={i} className="bg-slate-700/30 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-100">{milestone.title}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    milestone.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                    milestone.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {milestone.priority}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Target: {milestone.target}</span>
                  <span>Current: {milestone.current}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-1.5">
                  <div 
                    className={`${getHealthBgColor(milestone.progress)} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const StatisticsMessage = ({ data }: { data: any }) => (
    <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="text-green-400" size={20} />
        <h3 className="text-lg font-semibold text-slate-100">Financial Statistics</h3>
      </div>

      {/* Cash Flow */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
            <DollarSign size={16} className="text-green-400" />
            Cash Flow
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Monthly Income</span>
              <span className="text-sm font-medium text-slate-100">{formatCurrency(data.cashFlow.monthlyIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Monthly Expenses</span>
              <span className="text-sm font-medium text-slate-100">{formatCurrency(data.cashFlow.monthlyExpenses)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Monthly Savings</span>
              <span className="text-sm font-medium text-emerald-400">{formatCurrency(data.cashFlow.monthlySavings)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-600">
              <span className="text-sm text-slate-400">Net Cash Flow</span>
              <span className={`text-sm font-medium ${data.cashFlow.netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(data.cashFlow.netCashFlow)}
              </span>
            </div>
          </div>
        </div>

        {/* Emergency Fund */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
            <PiggyBank size={16} className="text-blue-400" />
            Emergency Fund
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Current Coverage</span>
              <span className="text-sm font-medium text-slate-100">{data.emergencyFund.currentMonths} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Target Coverage</span>
              <span className="text-sm font-medium text-slate-100">{data.emergencyFund.targetMonths} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Adequacy Score</span>
              <span className={`text-sm font-medium ${getHealthColor(data.emergencyFund.adequacyScore)}`}>
                {data.emergencyFund.adequacyScore.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
              <div 
                className={`${getHealthBgColor(data.emergencyFund.adequacyScore)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${data.emergencyFund.adequacyScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Capacity */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-purple-400" />
          Investment Readiness
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <span className="text-xs text-slate-400">Readiness Score</span>
            <div className={`text-lg font-bold ${getHealthColor(data?.investmentReadiness?.readinessScore || 0)}`}>
              {data?.investmentReadiness?.readinessScore || 0}/100
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400">Can Invest</span>
            <div className={`text-lg font-bold ${data?.investmentReadiness?.isReady ? 'text-emerald-400' : 'text-red-400'}`}>
              {data?.investmentReadiness?.isReady ? 'Yes' : 'No'}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400">Recommended Amount</span>
            <div className="text-lg font-bold text-purple-400">
              {formatCurrency(data?.investmentReadiness?.recommendation?.amount || 0)}
            </div>
          </div>
        </div>
        {data?.investmentReadiness?.recommendation?.products && data.investmentReadiness.recommendation.products.length > 0 && (
          <div className="mt-3">
            <span className="text-xs text-slate-400">Suggested Products</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.investmentReadiness.recommendation.products.map((product: string, i: number) => (
                <span key={i} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  {product}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-50 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide">GenFin.ai</h1>
            <p className="text-xs text-slate-400 hidden sm:block">Intelligent Financial Health Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {profile && (
            <>
              <button onClick={generateFinancialSummaryMessage} disabled={loading} className="hidden md:flex p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors" title="Financial Summary"><BarChart3 size={18} /></button>
              <button onClick={generateGuidedPathMessage} disabled={loading} className="hidden md:flex p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-purple-400 transition-colors" title="Guided Path"><TargetIcon size={18} /></button>
              <button onClick={generateStatisticsMessage} disabled={loading} className="hidden md:flex p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-green-400 transition-colors" title="Statistics"><TrendingUp size={18} /></button>
              <button onClick={clearChatHistory} disabled={loading} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Clear Chat"><Trash2 size={18} /></button>
            </>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {messages.map((m, idx) => renderMessage(m, idx))}
          {loading && (
            <div className="flex justify-start">
              <div className="text-xs text-slate-400 animate-pulse flex items-center gap-2 p-4 bg-slate-800/50 rounded-2xl rounded-tl-sm w-fit border border-slate-700/50">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="ml-2">GenFin.ai is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-slate-950 w-full relative z-20">
        <div className="max-w-4xl mx-auto px-4 pb-4 pt-2">
          {/* Quick Action Chips */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-1 snap-x" style={{ scrollbarWidth: 'none' }}>
            {proactiveSuggestions.map((s, i) => (
              <button
                key={`ps-${i}`}
                onClick={() => sendMessage(s.action)}
                disabled={loading}
                className="snap-start shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600 transition-all flex items-center gap-2"
              >
                <span>{s.icon}</span> {s.message}
              </button>
            ))}
            {(profile?.income ? [
              'Show my investment plan', 'Analyze my finances', 'Which schemes suit me?', 'Show my score card', 'How to reduce my debt', 'Best SIP for me'
            ] : [
              'What is SIP?', 'Best government schemes', 'How to start investing', 'What is PPF?', 'Tax saving tips', 'How much to save?'
            ]).map((action, i) => (
              <button
                key={`chip-${i}`}
                onClick={() => sendMessage(action)}
                disabled={loading}
                className="snap-start shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full border border-cyan-500/20 text-cyan-400 tracking-wide hover:bg-cyan-500/10 transition-colors"
                title={action}
              >
                {action}
              </button>
            ))}
          </div>

          <div className="relative group flex items-end">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your finances..."
              className="w-full resize-none bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-2xl pl-5 pr-14 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-700 transition-all shadow-xl"
              style={{ minHeight: '52px', maxHeight: '120px' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-11 -translate-y-1/2 w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center disabled:opacity-30 disabled:bg-slate-800 disabled:text-slate-500 transition-all hover:scale-105 active:scale-95 z-10"
            >
              <Send size={16} className={input.trim() && !loading ? "-translate-x-0.5" : "-translate-x-0.5"} />
            </button>
          </div>
          <div className="text-center mt-2 hidden sm:block">
            <p className="text-[10px] text-slate-500">GenFin AI can make mistakes. Consider verifying important financial information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

