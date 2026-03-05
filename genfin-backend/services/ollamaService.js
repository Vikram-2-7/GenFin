/**
 * Ollama Integration Service
 * 
 * Manages communication with local Ollama instance
 * Generates natural language explanations using Mistral model
 */

const axios = require('axios');

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

class OllamaService {
  /**
   * Check if Ollama service is available
   */
  static async isAvailable() {
    try {
      const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      console.warn('Ollama service not available:', error.message);
      return false;
    }
  }

  /**
   * Generate financial analysis explanation using Mistral
   * @param {Object} analysisData - Financial analysis results
   * @param {string} analysisType - Type of analysis (detailed, summary, actionable)
   * @returns {Promise<string>} - Generated explanation
   */
  static async generateExplanation(analysisData, analysisType = 'detailed') {
    try {
      const isAvailable = await this.isAvailable();
      
      if (!isAvailable) {
        console.warn('Ollama not available, returning fallback explanation');
        return this.getFallbackExplanation(analysisData, analysisType);
      }

      const prompt = this.buildPrompt(analysisData, analysisType);
      
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        temperature: 0.7,
        top_p: 0.9,
        timeout: 30000
      }, {
        timeout: 30000
      });

      return response.data.response.trim();
    } catch (error) {
      console.error('Ollama generation error:', error.message);
      return this.getFallbackExplanation(analysisData, analysisType);
    }
  }

  /**
   * Build structured prompt for LLM
   */
  static buildPrompt(data, analysisType) {
    const basePrompt = `
You are a financial advisor assistant. Analyze the following financial profile and provide clear, actionable guidance.

FINANCIAL PROFILE:
- Monthly Income: ₹${data.income}
- Monthly Expenses: ₹${data.expenses}
- Monthly Savings: ₹${data.savings}
- Total Debt: ₹${data.debt}
- Emergency Fund Coverage: ${data.emergencyFundMonths} months

CALCULATED METRICS:
- Expense Ratio: ${data.expenseRatio}%
- Savings Rate: ${data.savingsRate}%
- Debt Ratio: ${data.debtRatio}%
- Stability Score: ${data.stabilityScore}/100
- Risk Score: ${data.riskScore}/100
- Readiness Score: ${data.readinessScore}/100
- Financial Status: ${data.status}
- Risk Tolerance: ${data.riskTolerance || 'Not specified'}

USER QUESTION (if provided):
- ${data.userQuestion || 'N/A'}

INSTRUCTIONS:
`;

    switch (analysisType) {
      case 'summary':
        return basePrompt + `
Provide a brief 2-3 sentence summary of this person's financial health.
Be encouraging but honest. Focus on the most important aspect.`;

      case 'actionable':
        return basePrompt + `
List the top 3-5 specific, actionable steps this person should take RIGHT NOW to improve their financial situation.
Format as numbered list. Be practical and specific.`;

      case 'detailed':
        return basePrompt + `
Provide a comprehensive financial analysis covering:
1. Overall financial health assessment (2-3 sentences)
2. Key strengths (2-3 points)
3. Key concerns (2-3 points)
4. Immediate action items (3-5 specific steps)
5. Long-term strategy (2-3 sentences)

Be clear, supportive, and focus on empowering the individual.`;

      case 'investment':
        return basePrompt + `
Based on the readiness score and financial metrics, provide investment guidance:
1. Are they ready to invest? (Yes/No with brief reason)
2. Recommended investment approach
3. Suggested starting point
4. What to avoid

Keep it practical and match their readiness level.`;

      case 'chat':
        return basePrompt + `
The user is having a conversation with you, their financial assistant. They've asked: "${data.userQuestion || 'general financial question'}"

RESPONSE GUIDELINES:
- Be conversational, friendly, and helpful
- Answer their question naturally without strict topic limitations
- You can discuss general financial topics, life goals, education, career advice related to finance
- Keep responses concise (2-4 paragraphs max)
- If they ask about investments, focus on safe, regulated options suitable for Indian investors
- If they ask personal questions, be friendly but gently guide back to financial topics
- Use simple, encouraging language

IMPORTANT: Be helpful and conversational, not restrictive. The goal is to build a helpful relationship with the user while providing sound financial guidance.`;

      default:
        return basePrompt + 'Provide a comprehensive but concise financial analysis.';
    }
  }

  /**
   * Fallback explanation when Ollama is not available
   * Uses rule-based templates
   */
  static getFallbackExplanation(data, analysisType) {
    const { status, readinessScore, status: currentStatus, riskScore, stabilityScore } = data;

    switch (analysisType) {
      case 'summary':
        if (status.includes('Stable')) {
          return `Your financial foundation is strong with good savings habits and controlled expenses. You're well-positioned for investing and long-term wealth building.`;
        } else if (status.includes('Moderate')) {
          return `You're making progress but need to strengthen your financial foundation. Focus on increasing emergency savings and reducing debt before making major investment decisions.`;
        } else {
          return `Your finances need immediate attention. Prioritize building an emergency fund and controlling expenses before considering investments.`;
        }

      case 'actionable':
        const actions = [];
        if (data.savingsRate < 10) actions.push('1. Increase savings rate to at least 10% by reducing non-essential expenses');
        if (data.emergencyFundMonths < 3) actions.push('2. Build emergency fund to cover 3-6 months of living expenses');
        if (data.debtRatio > 0.3) actions.push('3. Create aggressive debt payoff plan');
        if (data.expenseRatio > 70) actions.push('4. Review and optimize large expense categories');
        if (readinessScore >= 60) actions.push('5. Consider starting with conservative investments like index funds');
        
        return actions.length > 0 ? actions.join('\n') : 'Continue building on your strong financial habits. Consider expanding your investment portfolio.';

      case 'detailed':
        let assessment = '';
        if (status.includes('Stable')) {
          assessment = `Your financial profile shows strong health with excellent savings discipline and controlled spending. You have a solid foundation for wealth building.`;
        } else if (status.includes('Moderate')) {
          assessment = `You're on a positive trajectory but have room for improvement. Your financial foundation needs strengthening in key areas like emergency savings or debt reduction.`;
        } else {
          assessment = `Your financial situation requires focused attention. While the situation is manageable, immediate action is needed to build stability.`;
        }

        return `${assessment}\n\nKey strengths:\n- Savings awareness\n- Income generation\n\nKey concerns:\n- ${data.savingsRate < 15 ? 'Below-target savings rate\n- ' : ''}${data.debtRatio > 0.3 ? 'Moderate debt burden\n- ' : ''}${data.emergencyFundMonths < 6 ? 'Insufficient emergency fund ' : ''}\n\nNext steps:\nFocus on the action items listed above and review progress monthly.`;

      case 'investment':
        const ready = readinessScore >= 60;
        return ready 
          ? `You're ready to start investing. Given your readiness score of ${readinessScore}/100, consider starting with low-cost index funds or SIPs. Start conservatively and increase exposure as your confidence grows.`
          : `Focus on building your financial foundation first. Reach a readiness score of 60+ by increasing emergency savings and reducing expenses. You'll be investment-ready soon.`;

      case 'chat': {
        const rawQuestion = (data.userQuestion || '').trim();
        const q = rawQuestion.toLowerCase();

        // 1. Pure greeting / small talk
        if (!q || /^(hi|hello|hey|good\s+morning|good\s+evening)/i.test(rawQuestion)) {
          return `Hi, I’m GenFin.ai — your low‑risk money guide. I don’t know your name, but I can help you understand your income, expenses, savings, and safe investment options.\n\nTell me three things in one line: your monthly income, approximate total monthly expenses, and any goal you care about (for example: “income 40,000, expense 22,000, goal emergency fund and house”). Then I’ll break down your financial health and next steps.`;
        }

        // Helper: describe readiness in words
        const describeReadiness = () => {
          if (typeof readinessScore !== 'number') return '';
          if (readinessScore >= 75) {
            return `Your readiness score of ${readinessScore}/100 suggests a strong position — you can invest as long as you stick to low‑risk, long‑term instruments.`;
          } else if (readinessScore >= 60) {
            return `Your readiness score of ${readinessScore}/100 means you can begin conservative investing, but you should keep strengthening your safety net (especially emergency savings).`;
          } else {
            return `Your readiness score of ${readinessScore}/100 shows you should first focus on basics like building an emergency fund and controlling expenses before investing.`;
          }
        };

        // Helper: summarize metrics if we have them
        const summarizeMetrics = () => {
          const sr = typeof data.savingsRate === 'number' ? data.savingsRate : parseFloat(data.savingsRate || '0');
          const er = typeof data.expenseRatio === 'number' ? data.expenseRatio : parseFloat(data.expenseRatio || '0');
          const dr = typeof data.debtRatio === 'number' ? data.debtRatio : parseFloat(data.debtRatio || '0');
          const ef = typeof data.emergencyFundMonths === 'number'
            ? data.emergencyFundMonths
            : (data.inputData?.emergencyFundMonths ?? 0);

          const parts = [];
          if (!Number.isNaN(er) && er > 0) parts.push(`expenses are about ${er.toFixed(1)}% of income`);
          if (!Number.isNaN(sr) && sr > 0) parts.push(`you save roughly ${sr.toFixed(1)}% each month`);
          if (!Number.isNaN(dr) && dr > 0) parts.push(`your debt load is about ${(dr * 100).toFixed(1)}% of annual income`);
          if (ef > 0) parts.push(`emergency fund covers around ${ef.toFixed(1)} months of expenses`);

          if (!parts.length) {
            return `I don’t yet have your detailed numbers, so I’ll answer in general terms.`;
          }
          return `From your profile I see that ${parts.join(', ')}.`;
        };

        // 2. Non‑financial question (like “what’s my name?”)
        const looksNonFinancial = !/(income|salary|expense|spend|saving|invest|scheme|goal|debt|loan|fund|ppf|etf|bond)/i.test(
          rawQuestion
        );
        if (looksNonFinancial) {
          return `I’m focused only on money topics — budgeting, savings discipline, government schemes, and low‑risk investing. I can’t answer personal questions like your name or non‑financial topics, but I can help you plan your money.\n\nIf you want to start, tell me: “income X, expenses Y, goal Z”, and I’ll explain your financial health and a safe next step.`;
        }

        // 3. Financial question: give a richer, varied answer
        const intro = `You asked: “${rawQuestion}”.`;
        const metricsLine = summarizeMetrics();
        const readinessLine = describeReadiness();

        let stateLine = '';
        if (typeof status === 'string' && status.toLowerCase().includes('stable')) {
          stateLine =
            'Overall, your base looks stable. The priority is to keep expenses under control, protect your emergency fund, and invest only from clear surplus in safe instruments like index ETFs, government bonds, or high‑quality debt funds.';
        } else if (typeof status === 'string' && status.toLowerCase().includes('moderate')) {
          stateLine =
            'You’re on the right path but still in a “build‑up” phase. Focus on taking your emergency fund to at least 3–6 months and tightening any avoidable lifestyle spending before increasing investments.';
        } else if (status) {
          stateLine =
            'Right now your profile leans toward higher risk. Protect yourself first by building a basic emergency fund, reducing high‑interest debt, and strictly avoiding speculative trading, leverage, or crypto.';
        }

        const nextStep =
          'For this month, choose one concrete action: (1) write down a simple budget (income vs fixed vs variable expenses), (2) set an automatic transfer into an emergency‑fund account right after salary credit, or (3) start a very small SIP into a safe, long‑term product like a broad‑market index ETF or a government‑backed scheme once surplus is clear.';

        return `${intro}\n\n${metricsLine}\n\n${readinessLine}\n\n${stateLine}\n\n${nextStep}`;
      }

      default:
        return `Your financial metrics show a ${status.toLowerCase()} state. Review the specific action items to improve your financial health.`;
    }
  }

  /**
   * Generate investment recommendation
   */
  static async generateInvestmentRecommendation(analysisData) {
    return this.generateExplanation(analysisData, 'investment');
  }

  /**
   * Get model health check
   */
  static async healthCheck() {
    try {
      const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
        timeout: 5000
      });
      
      const models = response.data.models || [];
      const hasMistral = models.some(m => m.name && m.name.includes('mistral'));
      
      return {
        status: 'healthy',
        ollamaRunning: true,
        mistralAvailable: hasMistral,
        models: models.map(m => m.name)
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        ollamaRunning: false,
        mistralAvailable: false,
        error: error.message
      };
    }
  }
}

module.exports = OllamaService;
