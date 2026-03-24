import { useEffect, useState } from 'react';
import SLMAnalysisPage from './SLMAnalysisPage';

interface FastAnalysisResponse {
  timestamp: string;
  metrics: {
    expenseRatio: number;
    savingsRate: number;
    debtRatio: number;
    stabilityScore: number;
    riskScore: number;
    readinessScore: number;
  };
  status: {
    overallStatus: string;
    category: string;
    emoji: string;
    canInvest: boolean;
  };
  analysis: {
    summary: string;
    actionableAdvice: string;
    investmentGuidance: string;
    keyInsights: string[];
  };
  actionPlan: any[];
  riskAssessment: {
    score: number;
    level: string;
    factors: string[];
  };
  qualityScore: number;
  cached: boolean;
}

export default function SLMAnalysisContainer() {
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProfileForSLM = () => {
    try {
      const raw = localStorage.getItem('genfin_profile_for_slm');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const stored = loadProfileForSLM();

      const profile = stored
        ? {
            monthlyIncome: stored.income,
            expenses: stored.expenses, // can be number or breakdown
            savings: stored.savings,
            debts: stored.debt,
            emergencyFundMonths: stored.emergencyFundMonths,
            riskTolerance: stored.investmentMindset || 'moderate'
          }
        : {
            monthlyIncome: 50000,
            expenses: {
              rent: 15000,
              groceries: 8000,
              utilities: 2000,
              entertainment: 3000,
              transport: 2000,
              shopping: 3000
            },
            savings: 10000,
            debts: 100000,
            emergencyFundMonths: 3,
            riskTolerance: 'conservative'
          };

      const res = await fetch('http://localhost:5000/api/slm-fast/analyze-fast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      const data: FastAnalysisResponse = json.data;

      const mapped = {
        timestamp: data.timestamp,
        metrics: data.metrics,
        status: data.status,
        analysis: {
          overview: data.analysis.summary,
          investmentRecommendation: data.analysis.investmentGuidance,
          keyInsights: data.analysis.keyInsights
        },
        actionPlan: data.actionPlan,
        recommendations: [],
        riskAssessment: data.riskAssessment
      };

      setAnalysisData(mapped);
    } catch (e) {
      console.error('Failed to load SLM fast analysis', e);
      setAnalysisData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  return (
    <SLMAnalysisPage
      analysisData={analysisData}
      loading={loading}
      onRefresh={fetchAnalysis}
    />
  );
}

