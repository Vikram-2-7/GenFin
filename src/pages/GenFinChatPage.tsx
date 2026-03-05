import { useState, useEffect } from 'react';
import { Sparkles, Send, Shield, Activity, TrendingUp, AlertCircle, CheckCircle, Target, BarChart3, User, DollarSign, PiggyBank, Target as TargetIcon, Trash2 } from 'lucide-react';

interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'financial-summary' | 'guided-path' | 'statistics' | 'milestones';
  data?: any;
  timestamp?: string;
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
    const response = await fetch('http://localhost:5000/api/profile');
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

  // Load profile and chat history on mount
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🔍 DEBUG: Initializing GenFin Chat Page...');
      
      // Step 1: Load profile from database
      const loadedProfile = await loadProfileFromDatabase();
      console.log('🔍 DEBUG: Profile loaded:', loadedProfile);
      
      if (loadedProfile && loadedProfile.income && loadedProfile.expenses) {
        setProfile(loadedProfile);
        
        // Step 2: Calculate financial metrics from REAL data
        const metrics = calculateFinancialMetrics(loadedProfile);
        console.log('🔍 DEBUG: Financial metrics calculated:', metrics);
        setFinancialMetrics(metrics);
        
        // Step 3: Generate proactive message with REAL readiness score
        const readinessScore = metrics.readinessScore;
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
        // No profile data - show setup message
        setMessages([{
          role: 'assistant',
          content: '**Welcome to GenFin.ai - Your Intelligent Financial Health Assistant!**\n\nI\'m here to provide you with personalized financial guidance, but first I need to understand your financial situation.\n\n**📋 Required Information:**\n• Monthly income & expenses\n• Savings amount\n• Current debt (if any)\n• Emergency fund status\n• Investment preferences\n\n**⚡ Quick Start:**\n1. Click the **Profile** button in the navigation above\n2. Fill in your financial information\n3. Click "Analyze Financial Health"\n4. Save your profile\n5. Come back here for personalized guidance!\n\nYour financial data is stored securely and used only to provide you with better guidance. Let\'s get started on your financial journey! 🌟',
          timestamp: new Date().toISOString()
        }]);
      }
      
      // Step 4: Load chat history from database
      await loadChatHistory();
    };

    initializeApp();
  }, []);

  // Load chat history from database
  const loadChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/history');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.messages && data.messages.length > 0) {
          console.log('� Chat history loaded:', data.messages.length, 'messages');
          setMessages(data.messages);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Save message to database
  const saveMessageToDatabase = async (role: 'user' | 'assistant', content: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const response = await fetch('http://localhost:5000/api/chat/history', {
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

  const generateProactiveSuggestions = (): string[] => {
    if (!profile || !financialMetrics) return [];
    
    const suggestions = [];
    const readinessScore = financialMetrics.readinessScore;
    
    if (readinessScore >= 75) {
      suggestions.push("Show me investment opportunities for my risk level");
      suggestions.push("Create a wealth-building strategy");
      suggestions.push("Optimize my tax-advantaged investments");
    } else if (readinessScore >= 50) {
      suggestions.push("Help me reach investment readiness faster");
      suggestions.push("Show me ways to increase my savings rate");
      suggestions.push("Create a debt reduction plan");
    } else {
      suggestions.push("Build my emergency fund step by step");
      suggestions.push("Help me create a monthly budget");
      suggestions.push("Show me expense optimization tips");
    }
    
    // Add specific suggestions based on profile gaps
    if (profile.emergencyFundMonths && profile.emergencyFundMonths < 3) {
      suggestions.push("Emergency fund building guide");
    }
    
    if (profile.income && profile.expenses && (profile.expenses / profile.income) > 0.7) {
      suggestions.push("Expense reduction strategies");
    }
    
    if (profile.debt && profile.income && (profile.debt / (profile.income * 12)) > 0.3) {
      suggestions.push("Debt payoff acceleration plan");
    }
    
    return suggestions.slice(0, 4); // Return top 4 suggestions
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

      saveMessagesToStorage([...messages, pathMessage]);
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

      saveMessagesToStorage([...messages, statsMessage]);
    } catch (error) {
      console.error('Statistics generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const userMessageLower = userMessage.toLowerCase();
    
    // Save user message to database immediately
    await saveMessageToDatabase('user', userMessage);
    
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userMessage, timestamp: new Date().toISOString() }
    ];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    // Handle special commands for financial analysis
    if (userMessageLower.includes('summary') || userMessageLower.includes('analyze') || userMessageLower.includes('health')) {
      await generateFinancialSummaryMessage();
      return;
    }
    
    if (userMessageLower.includes('path') || userMessageLower.includes('guide') || userMessageLower.includes('journey')) {
      await generateGuidedPathMessage();
      return;
    }
    
    if (userMessageLower.includes('statistics') || userMessageLower.includes('stats') || userMessageLower.includes('numbers')) {
      await generateStatisticsMessage();
      return;
    }

    try {
      // Use current profile data
      const payload = {
        message: userMessage,
        profile: profile ? {
          income: profile.income,
          expenses: profile.expenses,
          savings: profile.savings,
          debt: profile.debt,
          emergencyFundMonths: profile.emergencyFundMonths
        } : undefined
      };

      const res = await fetch('http://localhost:5000/api/slm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      const reply: string = json.reply || 'I could not generate a response right now.';
      
      // Save AI response to database
      await saveMessageToDatabase('assistant', reply);

      setMessages([
        ...nextMessages,
        { role: 'assistant', content: reply, timestamp: new Date().toISOString() }
      ]);
    } catch (e) {
      console.error('GenFin.ai chat error', e);
      const errorMessage = 'I could not reach the GenFin SLM backend. Please ensure the backend and Ollama are running and try again.';
      
      // Save error message to database
      await saveMessageToDatabase('assistant', errorMessage);
      
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date().toISOString()
        }
      ]);
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
          {message.content}
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col h-screen">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.6)]">
                <Sparkles className="text-white" size={22} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  GenFin.ai
                </p>
                <p className="text-lg font-semibold">
                  Intelligent Financial Health Assistant
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Shield size={14} className="text-emerald-400" />
                <span>Low‑risk, regulation‑aligned</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity size={14} className="text-blue-400" />
                <span>Personalized guidance</span>
              </div>
              {profile && (
                <div className="flex items-center gap-1">
                  <User size={14} className="text-purple-400" />
                  <span>Profile loaded</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Quick Action Buttons */}
        {profile && (
          <div className="mb-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={generateFinancialSummaryMessage}
                disabled={loading}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <BarChart3 size={14} />
                Financial Summary
              </button>
              <button
                onClick={generateGuidedPathMessage}
                disabled={loading}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <TargetIcon size={14} />
                Guided Path
              </button>
              <button
                onClick={generateStatisticsMessage}
                disabled={loading}
                className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <TrendingUp size={14} />
                Statistics
              </button>
              <button
                onClick={clearChatHistory}
                disabled={loading}
                className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Clear Chat
              </button>
            </div>
            
            {/* Proactive Suggestions */}
            {generateProactiveSuggestions().length > 0 && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
                  <Sparkles size={12} className="text-yellow-400" />
                  Suggested questions for you:
                </div>
                <div className="flex flex-wrap gap-2">
                  {generateProactiveSuggestions().map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(suggestion)}
                      disabled={loading}
                      className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat area */}
        <main className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m, idx) => renderMessage(m, idx))}
            {loading && (
              <div className="flex justify-start">
                <div className="text-xs text-slate-400 animate-pulse flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span>GenFin.ai is analyzing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-800 bg-slate-900/80 px-4 py-3">
            <div className="text-xs text-slate-500 mb-2">
              💡 Try asking: "analyze my finances", "show my financial path", "what are my statistics", or any financial question
            </div>
            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your financial health, request analysis, get guidance, or discuss safe investment options..."
                className="flex-1 resize-none bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-400"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/40 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

