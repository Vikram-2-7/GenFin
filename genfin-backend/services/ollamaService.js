const Groq = require('groq-sdk');
const liveRates = require('./liveRatesService');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com'
});

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `
You are GenFin, an elite AI financial advisor specializing 
in Indian personal finance. You are NOT a general AI.
Only discuss finance, money, investments, and wealth building.

GREETING RULES:
- If user says hello/hi/hey — greet them warmly as GenFin, ask how you can help with their finances today
- If asked who are you — introduce yourself as GenFin, an AI financial advisor for Indian users, explain what you can help with
- If asked about a person — briefly acknowledge and redirect to finance
- NEVER return the generic fallback text for greetings
- Always be conversational and warm for non-finance small talk before redirecting to financial topics

RESPONSE FORMAT — FOLLOW STRICTLY:
- Start with ONE LINE direct answer immediately
- Short paragraphs, 2-3 lines max each
- Bullet points only for 3+ items
- Bold only key terms and ₹ numbers
- End complex answers with "Bottom line:" summary
- Always use ₹ for Indian currency
- Max 1 emoji per section header, never mid-sentence
- Never say "Great question!" or "Hope that helps!"
- Sound like a knowledgeable friend, not a textbook

COMPLETE SCHEME NAVIGATION GUIDE:

PPF (Public Provident Fund):
- Eligibility: Any Indian citizen, 1 account per person
- Documents: PAN, Aadhaar, passport photo, bank details
- Where to apply: Post office or SBI/nationalized bank branch
- Online: sbi.co.in → Deposits → PPF Account
- Minimum: ₹500/year, Maximum: ₹1.5 lakh/year
- In-app link: /schemes?scheme=ppf
- Official: https://www.indiapost.gov.in

SSY (Sukanya Samriddhi Yojana):
- Eligibility: Girl child below 10 years, max 2 accounts
- Documents: Birth certificate of girl, parent PAN+Aadhaar
- Where to apply: Post office or authorized banks
- Minimum: ₹250/year, Maximum: ₹1.5 lakh/year
- In-app link: /schemes?scheme=ssy
- Official: https://www.indiapost.gov.in

SCSS (Senior Citizens Savings Scheme):
- Eligibility: Age 60+ or 55+ if retired
- Documents: Age proof, PAN, Aadhaar, address proof
- Where to apply: Post office or nationalized banks
- Maximum: ₹30 lakh total across all accounts
- In-app link: /schemes?scheme=scss
- Official: https://www.indiapost.gov.in

NSC (National Savings Certificate):
- Eligibility: Any Indian resident, adults only
- Documents: PAN, Aadhaar, address proof
- Where to apply: Any post office in India
- Minimum: ₹1000, No maximum limit
- In-app link: /schemes?scheme=nsc
- Official: https://www.indiapost.gov.in

NPS (National Pension System):
- Eligibility: Indian citizens aged 18-70 years
- Documents: PAN, Aadhaar, bank account, photo
- Where to apply: eNPS portal or Point of Presence banks
- Minimum: ₹500/contribution, ₹1000/year
- In-app link: /schemes?scheme=nps
- Official: https://www.npscra.nsdl.co.in

KVP (Kisan Vikas Patra):
- Eligibility: Any Indian adult, no income limit
- Documents: PAN (above ₹50k), Aadhaar, address proof
- Where to apply: Post offices and select banks
- Minimum: ₹1000, No maximum
- In-app link: /schemes?scheme=kvp
- Official: https://www.indiapost.gov.in

APY (Atal Pension Yojana):
- Eligibility: Age 18-40, must have bank account
- Documents: Aadhaar, bank account with mobile linked
- Pension: ₹1000-5000/month guaranteed at age 60
- In-app link: /schemes?scheme=apy
- Official: https://www.npscra.nsdl.co.in/scheme-details.php

WHEN USER ASKS ABOUT ANY SCHEME:
1. Explain what it is clearly
2. State eligibility requirements
3. List required documents
4. Give step-by-step application process
5. Share the in-app link AND official website URL
6. Mention the current interest rate with date
7. Compare with similar schemes if relevant

DOMAIN 1 — PERSONAL FINANCE FUNDAMENTALS:
Gross vs net income, active vs passive vs portfolio income,
income diversification, salary negotiation, side income.
Budgeting: 50/30/20 rule, zero-based budgeting, pay yourself 
first, envelope method, anti-budget, cash flow management.
Expense management: needs vs wants, lifestyle inflation trap,
fixed vs variable expenses, expense ratio thresholds,
discretionary spending control, conscious spending philosophy.
Cash flow: surplus/deficit analysis, forecasting,
seasonal expense planning, irregular income handling.

DOMAIN 2 — DEBT MANAGEMENT:
Types: good debt vs bad debt, secured vs unsecured,
home loans, personal loans, credit card debt, education loans,
vehicle loans, business loans.
Metrics: DTI ratio, debt-to-asset ratio, credit utilization,
EMI-to-income ratio, total debt service ratio.
Payoff: avalanche method (highest interest first),
snowball method (smallest balance first), hybrid method,
debt consolidation, balance transfer, loan prepayment math.
Psychology: debt denial, minimum payment trap, debt spiral,
emotional weight of debt.

DOMAIN 3 — EMERGENCY FUND AND RISK PROTECTION:
Emergency fund: 3-6 months expenses (not income),
exact target calculation, liquid instruments,
high yield savings, liquid mutual funds, replenishment strategy.
Insurance: term life, health (individual vs family floater),
critical illness, accidental disability, home, vehicle.
Coverage calculation, claim settlement ratios.
ULIP trap — never mix insurance with investment.

DOMAIN 4 — COMPLETE INVESTMENT UNIVERSE:
Equity: direct stocks, equity mutual funds, index funds ETFs,
large/mid/small cap, sectoral, international funds.
Debt: FD, RD, G-Sec, corporate bonds, debt mutual funds,
PPF, NSC, KVP, NPS.
Hybrid: balanced advantage, aggressive hybrid, multi-asset,
arbitrage funds.
Real Estate: residential, commercial, REITs.
Gold: physical, ETFs, Sovereign Gold Bonds, digital gold.
Alternatives: P2P lending, angel investing, AIF, unlisted shares.
Crypto: high risk only, speculation not investment.

DOMAIN 5 — INVESTMENT PRINCIPLES AND STRATEGIES:
Power of compounding, time in market vs timing the market,
rupee cost averaging, SIP logic, step-up SIP, trigger SIP.
Asset allocation by age, rebalancing portfolios, diversification.
Returns: CAGR, XIRR, real returns after inflation, rolling returns.
Risk: standard deviation, Sharpe ratio, beta, alpha,
maximum drawdown, sequence of returns risk.
Goal-based: retirement corpus, child education, house down payment,
financial independence number, FIRE movement.
SIP vs lump sum math and comparison.

DOMAIN 6 — PSYCHOLOGY OF MONEY:
Behavioral biases: loss aversion (losses hurt 2x more than gains),
anchoring, herd mentality, recency bias, confirmation bias,
overconfidence, sunk cost fallacy, mental accounting,
status quo bias, FOMO investing, endowment effect.
Money mindset: scarcity vs abundance, money scripts,
delayed gratification, hedonic adaptation, defining your enough.
Emotional patterns: emotional spending triggers,
retail therapy psychology, money and self-worth,
financial anxiety management, lifestyle comparison traps.

DOMAIN 7 — WEALTH BUILDING AND POWER OF MONEY:
Wealth stages:
Stage 1 - Financial Survival: no debt, emergency fund
Stage 2 - Financial Stability: positive cash flow
Stage 3 - Financial Security: investments started
Stage 4 - Financial Independence: passive income > expenses
Stage 5 - Financial Freedom: wealth works for you
Wealth principles: pay yourself first, net worth tracking,
income is not wealth — assets are wealth.
FIRE: Lean FIRE, Fat FIRE, Barista FIRE, Coast FIRE.
4% withdrawal rule, safe withdrawal rate calculations.
Passive income: dividends, rental, interest, royalties,
business ownership, digital assets.

DOMAIN 8 — INDIA-SPECIFIC FINANCIAL KNOWLEDGE:
Tax: old vs new regime comparison, income tax slabs 2024-25.
Deductions: 80C (PPF, ELSS, EPF, LIC, NSC) ₹1.5L limit,
80D health insurance ₹25,000 + ₹25,000 parents,
24B home loan interest ₹2L, 80CCD(1B) NPS extra ₹50,000.
LTCG equity 10% above ₹1L after 1 year,
STCG equity 15% within 1 year.
Tax loss harvesting, HRA calculation, TDS, advance tax.
Government schemes with current rates:
PPF 7.1% 15 years EEE, SSY 8.0% girl child EEE,
SCSS 8.2% senior citizens, NSC 7.7% 5 years,
KVP 7.5% doubles in 10.3 years, APY guaranteed pension,
NPS Tier1 Tier2 market-linked retirement.
Regulators: SEBI, RBI, IRDAI, PFRDA, AMFI.
CIBIL score: range, factors, building, repairing credit.

DOMAIN 9 — INVESTMENT READINESS FRAMEWORK:
Pre-investment checklist:
- 6-month emergency fund complete
- High-interest debt cleared
- Adequate insurance cover in place
- Positive monthly cash flow
- Clear financial goals defined
- Basic investment knowledge acquired
Risk profiling: conservative, moderate, aggressive.
Risk capacity vs risk appetite difference.
Portfolio construction by corpus size:
Starter ₹0-₹5L, Growing ₹5L-₹25L, Established ₹25L+.
Three-fund portfolio, core-satellite strategy,
all-weather portfolio, 100-minus-age rule.

DOMAIN 10 — LIFE STAGE FINANCIAL PLANNING:
Student/Early Career 18-25:
First income habits, avoiding lifestyle inflation,
starting SIP at ₹500, building credit history,
education loan management.
Young Professional 25-35:
Aggressive wealth building window, career income max,
marriage planning, buy vs rent analysis,
starting family financial plan.
Mid Career 35-50:
Children education corpus, peak earning and saving phase,
portfolio shift aggressive to moderate,
parent care planning, business considerations.
Pre-Retirement 50-60:
Corpus stress testing, capital preservation shift,
health insurance upgrade, debt-free target by retirement,
estate planning basics.
Retirement 60+:
Decumulation strategy, safe withdrawal planning,
senior citizen tax benefits,
medical expense inflation, legacy and inheritance planning.

MEMORY RULES:
- Remember everything the user shared earlier in this conversation
- Reference previous messages naturally
- If user mentioned income or expenses earlier, use those numbers
- Build on prior context, never start fresh mid-conversation
- Adapt advice based on accumulated user context
`;

// ─── CONVERSATION MEMORY ───────────────────────────────

class ConversationMemory {
  constructor() {
    this.sessions = new Map();
  }

  getSession(userId) {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, {
        messages: [],
        userProfile: null,
        learnedFacts: [],
        lastActive: Date.now()
      });
    }
    return this.sessions.get(userId);
  }

  addMessage(userId, role, content) {
    const session = this.getSession(userId);
    session.messages.push({ role, content });
    session.lastActive = Date.now();
    if (session.messages.length > 40) {
      session.messages = session.messages.slice(-40);
    }
    if (role === 'user') this.extractFacts(userId, content);
  }

  extractFacts(userId, message) {
    const session = this.getSession(userId);
    const incomeMatch = message.match(/(?:income|earn|salary)[^\d]*₹?([\d,]+)/i);
    const expenseMatch = message.match(/(?:expenses?|spend)[^\d]*₹?([\d,]+)/i);
    const savingsMatch = message.match(/(?:saved?|savings?)[^\d]*₹?([\d,]+)/i);
    const debtMatch = message.match(/(?:debt|loan|emi)[^\d]*₹?([\d,]+)/i);
    if (incomeMatch) session.learnedFacts.push(`income: ₹${incomeMatch[1]}`);
    if (expenseMatch) session.learnedFacts.push(`expenses: ₹${expenseMatch[1]}`);
    if (savingsMatch) session.learnedFacts.push(`savings: ₹${savingsMatch[1]}`);
    if (debtMatch) session.learnedFacts.push(`debt: ₹${debtMatch[1]}`);
    if (session.learnedFacts.length > 15) {
      session.learnedFacts = session.learnedFacts.slice(-15);
    }
  }

  setUserProfile(userId, profile) {
    const session = this.getSession(userId);
    session.userProfile = profile;
  }

  getMessages(userId) {
    return this.getSession(userId).messages;
  }

  getUserContext(userId) {
    const session = this.getSession(userId);
    let ctx = '';
    if (session.userProfile) {
      const p = session.userProfile;
      ctx += `\nUSER PROFILE: Income ₹${p.income || p.monthlyIncome}/month, `;
      ctx += `Expenses ₹${p.monthlyExpenses || p.expenses}/month, `;
      ctx += `Savings ₹${p.savings}, Debt ₹${p.debt}, `;
      ctx += `Emergency Fund ₹${p.emergencyFund}, `;
      ctx += `Risk: ${p.riskTolerance}, Goals: ${p.financialGoals}`;
    }
    if (session.learnedFacts.length > 0) {
      ctx += `\nLEARNED FROM CHAT: ${session.learnedFacts.join(', ')}`;
    }
    return ctx;
  }

  clearSession(userId) {
    this.sessions.delete(userId);
  }

  cleanup() {
    const oneHour = 60 * 60 * 1000;
    const now = Date.now();
    for (const [userId, session] of this.sessions) {
      if (now - session.lastActive > oneHour) {
        this.sessions.delete(userId);
      }
    }
  }
}

const memory = new ConversationMemory();
setInterval(() => memory.cleanup(), 60 * 60 * 1000);

// ─── MAIN RESPONSE FUNCTION ────────────────────────────

const ChatMessage = require('../models/ChatMessage');

async function generateResponse(
  userMessage, userId = 'default', userProfile = null) {

  const message = typeof userMessage === 'string'
    ? userMessage
    : (userMessage?.question ||
       userMessage?.message ||
       String(userMessage));

  if (userProfile) memory.setUserProfile(userId, userProfile);
  
  // Hydrate memory from MongoDB if session is new/empty
  const session = memory.getSession(userId);
  if (session.messages.length === 0) {
    try {
      const dbMessages = await ChatMessage.find({ userId })
        .sort({ timestamp: 1 })
        .limit(40) // same limit as conversation memory
        .lean();
      
      for (const msg of dbMessages) {
        session.messages.push({ role: msg.role, content: msg.content });
        if (msg.role === 'user') memory.extractFacts(userId, msg.content);
      }
      console.log(`Loaded ${dbMessages.length} messages from DB for user ${userId}`);
    } catch (err) {
      console.error('Error hydrating memory from DB:', err.message);
    }
  }

  memory.addMessage(userId, 'user', message);

  // Check if query needs live financial data
  const needsLiveData = /nifty|sensex|market|rate|ppf|ssy|scss|nsc|kvp|repo|rbi|gold|price|nav|return|inflation|usd|inr|rupee|interest|fd|fixed deposit|current|today|live|latest|now|2024|2025|2026/i.test(message);

  let liveContext = '';
  if (needsLiveData) {
    try {
      liveContext = await liveRates.buildLiveContext();
    } catch (err) {
      console.error('Live data fetch error:', err.message);
    }
  }

  const userContext = memory.getUserContext(userId);

  let enhancedSystem = SYSTEM_PROMPT;
  if (userContext) {
    enhancedSystem += '\n\nUSER CONTEXT:\n' + userContext;
  }
  if (liveContext) {
    enhancedSystem += '\n\n' + liveContext;
  }

  const history = memory.getMessages(userId);

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: enhancedSystem },
        ...history.slice(0, -1),
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1024,
      stream: false
    });

    const reply = completion.choices[0]?.message?.content;
    if (reply && reply.trim().length > 0) {
      memory.addMessage(userId, 'assistant', reply.trim());
      return reply.trim();
    }
    throw new Error('Empty response from Groq');

  } catch (error) {
    console.error('Groq error:', error.message);
    const fallback = getFallbackResponse(message);
    memory.addMessage(userId, 'assistant', fallback);
    return fallback;
  }
}

// ─── FINANCIAL PROFILE ANALYSIS ───────────────────────

async function generateExplanation(questionOrData, type, userId = 'default') {
  if (typeof questionOrData === 'string') {
    return generateResponse(questionOrData, userId);
  }
  const p = questionOrData;
  const income = Number(p?.income || p?.monthlyIncome || 0);
  const expenses = Number(p?.monthlyExpenses || p?.expenses || 0);
  const savings = Number(p?.savings || 0);
  const debt = Number(p?.debt || 0);
  const emergency = Number(p?.emergencyFund || 0);
  const savingsRate = income > 0
    ? (((income - expenses) / income) * 100).toFixed(1)
    : 0;
  const emergencyCoverage = expenses > 0
    ? (emergency / expenses).toFixed(1)
    : 0;
  const dti = income > 0
    ? ((debt / (income * 12)) * 100).toFixed(1)
    : 0;

  const prompt = `Analyze this user's actual financial profile and give 
specific personalized advice using their exact numbers:

Monthly Income: ₹${income}
Monthly Expenses: ₹${expenses}
Monthly Savings: ₹${income - expenses}
Savings Rate: ${savingsRate}%
Current Savings/Investments: ₹${savings}
Total Debt: ₹${debt}
Emergency Fund: ₹${emergency} (${emergencyCoverage} months coverage)
DTI Ratio: ${dti}%
Risk Tolerance: ${p?.riskTolerance || 'moderate'}
Financial Goals: ${p?.financialGoals || 'not specified'}
Time Horizon: ${p?.timeHorizon || 'not specified'}

Analysis type: ${type || 'comprehensive financial health analysis'}

Give actionable, specific advice. Reference their exact ₹ amounts.
Do NOT give generic advice. Be direct and honest.`;

  return generateResponse(prompt, userId, p);
}

// ─── INTELLIGENT FALLBACK ─────────────────────────────

function getFallbackResponse(message) {
  const msg = (message || '').toLowerCase();

  // DEBUG: Let me see what messages reach fallback
  console.log('🔍 DEBUG: Fallback called for message:', message);

  const nonFinance = ['joke', 'weather', 'sports', 'movie',
    'food', 'recipe', 'game', 'music', 'chatgpt', 'openai',
    'cricket', 'bollywood', 'cooking'];
  if (nonFinance.some(w => msg.includes(w))) {
    return 'I specialize in personal finance and investments for ' +
      'Indian users. Ask me about budgeting, investing, ' +
      'tax planning, or wealth building.';
  }

  if (msg.includes('sip') || msg.includes('systematic investment')) {
    return `A SIP lets you invest a fixed amount monthly into mutual funds automatically.

**Why it works:** You buy more units when markets fall, fewer when they rise, averaging your cost over time — called **Rupee Cost Averaging.**

- No need to time the market
- Works from as little as ₹500/month
- Compounds powerfully over 10-15 years

**Example:** ₹5,000/month at 12% returns over 10 years = ₹11.6 lakhs on just ₹6 lakh invested.

Bottom line: Start a Nifty 50 Index Fund SIP today. Increase by 10% every year as income grows.`;
  }

  if (msg.includes('saving') || msg.includes('save more')) {
    return `Increase savings by attacking from both sides — earn more and spend less.

**Immediate actions:**
- Automate savings on salary day before spending anything
- Audit and cancel unused subscriptions
- Apply 48-hour rule before non-essential purchases
- Target savings rate of 20%+ for investment readiness

Bottom line: Set up an auto-transfer of ₹X to a separate savings account on the day salary arrives. You spend what's left.`;
  }

  if (msg.includes('debt') || msg.includes('loan') || msg.includes('emi')) {
    return `Clear high-interest debt before investing — no market return beats 36% credit card interest.

**Avalanche method:** List all debts by interest rate. Attack the highest rate first while paying minimums on others.

**Key metric:** Keep DTI (total EMIs ÷ monthly income) below 40%.

Bottom line: Clear credit card debt → personal loans → vehicle loans → home loan. Never invest while carrying high-interest debt.`;
  }

  if (msg.includes('tax') || msg.includes('80c') || msg.includes('itr')) {
    return `Reduce tax bill legally using these deductions:

- **80C** — ₹1.5 lakh (PPF, ELSS, EPF, LIC, NSC)
- **80D** — ₹25,000 health insurance + ₹25,000 parents
- **80CCD(1B)** — Extra ₹50,000 via NPS
- **24B** — Home loan interest up to ₹2 lakh

**Old vs New regime:** If total deductions exceed ₹3.5 lakh, old regime saves more.

Bottom line: Max out 80C first — saves ₹46,800 tax at 30% bracket with zero risk.`;
  }

  if (msg.includes('government scheme') || msg.includes('ppf')
    || msg.includes('nps') || msg.includes('ssy')) {
    return `Best Indian government schemes:

| Scheme | Rate | Tenure | Tax |
|--------|------|--------|-----|
| PPF | 7.1% | 15 yrs | EEE |
| SSY | 8.0% | 21 yrs | EEE |
| SCSS | 8.2% | 5 yrs | 80C |
| NSC | 7.7% | 5 yrs | 80C |
| NPS | 9-12% | Till 60 | 80CCD |

Bottom line: PPF + NPS is the strongest combination for salaried Indians — tax savings plus long-term compounding.`;
  }

  if (msg.includes('mutual fund') || msg.includes('index fund')) {
    return `A mutual fund pools money from many investors and invests in stocks, bonds, or both — managed by a fund manager.

**By risk level:**
- **Equity funds** — 10-15% returns, high risk, 7+ years
- **Debt funds** — 6-9% returns, low risk, 1-3 years
- **Index funds** — Track Nifty/Sensex, lowest cost, best for beginners

Bottom line: Start with a Nifty 50 Index Fund via monthly SIP. Expense ratio must be below 0.5%.`;
  }

  return `Ask me anything about personal finance, investing, tax planning,
debt management, government schemes, insurance, or wealth building.
I'm trained across all major financial domains for Indian users.`;
}

// ─── EXPORTS ──────────────────────────────────────────

function clearUserMemory(userId) {
  memory.clearSession(userId);
}

function setUserProfile(userId, profile) {
  memory.setUserProfile(userId, profile);
}

async function isAvailable() {
  return !!(process.env.GROQ_API_KEY);
}

module.exports = {
  generateResponse,
  generateExplanation,
  getFallbackExplanation: getFallbackResponse,
  clearUserMemory,
  setUserProfile,
  isAvailable
};
