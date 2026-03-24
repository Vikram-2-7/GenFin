const axios = require('axios');

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

class OllamaService {
  /**
   * Check if Ollama is available
   */
  static async isAvailable() {
    try {
      const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
        timeout: 3000
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate response for chat - ALWAYS try LLM first
   */
  static async generateResponse(question, context = {}) {
    console.log('🤖 Chatbot processing:', question);
    
    // Try LLM first with better error handling
    try {
      const prompt = `You are GenFin.ai, an expert financial advisor. Provide a clean, professional answer to this question: "${question}"

Keep responses:
- Direct and conversational
- 2-4 sentences max for simple questions
- Use real examples with rupee amounts when relevant
- No emojis or excessive formatting

Question: ${question}
Context: ${JSON.stringify(context)}

Answer:`;

      const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        temperature: 0.7,
        top_p: 0.9
      }, {
        timeout: 20000
      });

      const answer = response.data.response.trim();
      console.log('✅ LLM response generated successfully');
      return answer;
      
    } catch (error) {
      console.error('❌ LLM failed:', error.message);
      
      // Only use fallback for non-finance questions
      const q = question.toLowerCase();
      const financeKeywords = ['debt', 'tax', 'investment', 'sip', 'mutual fund', 'ppf', 'saving', 'budget', 'retirement', 'insurance', 'loan', 'interest', 'government scheme', 'financial', 'money'];
      
      if (financeKeywords.some(keyword => q.includes(keyword))) {
        // Finance question but LLM failed - give basic response
        if (q.includes('debt')) {
          return 'Debt is money you owe to lenders. It includes loans, credit card balances, and mortgages. Good debt (like home loans) can build wealth, while bad debt (like high-interest credit cards) can hurt your finances. Always prioritize paying high-interest debt first.';
        }
        if (q.includes('tax')) {
          return 'Tax is a mandatory charge by government on your income and purchases. In India, you pay income tax on earnings, GST on purchases, and capital gains on investments. Smart tax planning through deductions (80C, 80D) can reduce your tax burden legally.';
        }
        if (q.includes('government scheme')) {
          return 'Indian government schemes include PPF (7.1% tax-free), SSY (8.0% for girls), NSC (7.7%), KVP (7.5%), and SCSS (8.2% for seniors). Each offers different benefits for various financial goals.';
        }
        return 'I can help with personal finance, investments, tax planning, retirement, insurance, and government schemes. Please try your question again or ensure the AI service is available.';
      }
      
      // Non-finance question
      return 'I specialize in financial topics like investments, tax planning, retirement, insurance, and government schemes. How can I help with your financial goals?';
    }
  }

  /**
   * Health check
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
        error: error.message
      };
    }
  }
}

module.exports = OllamaService;
