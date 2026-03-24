const axios = require('axios');

class LiveRatesService {
  constructor() {
    this.cache = {};
    this.cacheExpiry = 6 * 60 * 60 * 1000; // refresh every 6 hours
  }

  isCacheValid(key) {
    if (!this.cache[key]) return false;
    return (Date.now() - this.cache[key].timestamp) < this.cacheExpiry;
  }

  async getNifty() {
    if (this.isCacheValid('nifty')) return this.cache['nifty'].data;
    try {
      const res = await axios.get(
        'https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI',
        { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const r = res.data?.chart?.result?.[0];
      const data = {
        price: r?.meta?.regularMarketPrice?.toLocaleString('en-IN') || 'N/A',
        change: r?.meta?.regularMarketChangePercent?.toFixed(2) || 'N/A',
        high: r?.meta?.regularMarketDayHigh?.toLocaleString('en-IN') || 'N/A',
        low: r?.meta?.regularMarketDayLow?.toLocaleString('en-IN') || 'N/A',
        fetchedAt: new Date().toLocaleString('en-IN')
      };
      this.cache['nifty'] = { data, timestamp: Date.now() };
      return data;
    } catch {
      return { price: 'unavailable', change: 'N/A',
        fetchedAt: 'fetch failed - check nseindia.com' };
    }
  }

  async getSensex() {
    if (this.isCacheValid('sensex')) return this.cache['sensex'].data;
    try {
      const res = await axios.get(
        'https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN',
        { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const r = res.data?.chart?.result?.[0];
      const data = {
        price: r?.meta?.regularMarketPrice?.toLocaleString('en-IN') || 'N/A',
        change: r?.meta?.regularMarketChangePercent?.toFixed(2) || 'N/A',
        fetchedAt: new Date().toLocaleString('en-IN')
      };
      this.cache['sensex'] = { data, timestamp: Date.now() };
      return data;
    } catch {
      return { price: 'unavailable', change: 'N/A',
        fetchedAt: 'fetch failed - check bseindia.com' };
    }
  }

  async getUSDINR() {
    if (this.isCacheValid('usdinr')) return this.cache['usdinr'].data;
    try {
      const res = await axios.get(
        'https://api.exchangerate-api.com/v4/latest/USD',
        { timeout: 8000 }
      );
      const data = {
        rate: res.data?.rates?.INR?.toFixed(2) || 'N/A',
        fetchedAt: new Date().toLocaleString('en-IN')
      };
      this.cache['usdinr'] = { data, timestamp: Date.now() };
      return data;
    } catch {
      return { rate: '83-86 approx', fetchedAt: 'fetch failed' };
    }
  }

  async getTopFundNAV() {
    if (this.isCacheValid('nav')) return this.cache['nav'].data;
    try {
      const res = await axios.get(
        'https://api.mfapi.in/mf/100033',
        { timeout: 8000 }
      );
      const latest = res.data?.data?.[0];
      const data = {
        name: res.data?.meta?.scheme_name || 'HDFC Nifty 50 Index Fund',
        nav: latest?.nav || 'N/A',
        date: latest?.date || 'N/A'
      };
      this.cache['nav'] = { data, timestamp: Date.now() };
      return data;
    } catch {
      return { name: 'Nifty 50 Index Fund',
        nav: 'unavailable', date: 'N/A' };
    }
  }

  async getGoldPrice() {
    if (this.isCacheValid('gold')) return this.cache['gold'].data;
    try {
      const res = await axios.get(
        'https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF',
        { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const r = res.data?.chart?.result?.[0];
      const usdPrice = r?.meta?.regularMarketPrice;
      const usdInr = await this.getUSDINR();
      const inrRate = parseFloat(usdInr.rate) || 84;
      const inrPer10g = usdPrice
        ? ((usdPrice * inrRate) / 31.1 * 10).toLocaleString('en-IN')
        : 'N/A';
      const data = {
        per10g: inrPer10g,
        fetchedAt: new Date().toLocaleString('en-IN')
      };
      this.cache['gold'] = { data, timestamp: Date.now() };
      return data;
    } catch {
      return { per10g: 'unavailable',
        fetchedAt: 'check mcxindia.com' };
    }
  }

  getGovernmentRates() {
    return {
      ppf: '7.1%', ssy: '8.2%', scss: '8.2%',
      nsc: '7.7%', kvp: '7.5%', mis: '7.4%',
      pofd_1yr: '6.9%', pofd_2yr: '7.0%',
      pofd_3yr: '7.1%', pofd_5yr: '7.5%',
      rd: '6.7%',
      lastUpdated: 'Q4 FY2025-26'
    };
  }

  getRBIRates() {
    return {
      repo: '6.25%',
      reverseRepo: '3.35%',
      crr: '4.0%',
      slr: '18.0%',
      bankRate: '6.50%',
      lastUpdated: 'February 2025 MPC'
    };
  }

  async buildLiveContext() {
    const [nifty, sensex, usdInr, nav, gold] = await Promise.all([
      this.getNifty(),
      this.getSensex(),
      this.getUSDINR(),
      this.getTopFundNAV(),
      this.getGoldPrice()
    ]);

    const gov = this.getGovernmentRates();
    const rbi = this.getRBIRates();
    const now = new Date().toLocaleDateString('en-IN');

    return `
LIVE FINANCIAL DATA AS OF ${now}:

INDIAN MARKET:
Nifty 50: ${nifty.price} (${nifty.change}% | H:${nifty.high} L:${nifty.low})
BSE Sensex: ${sensex.price} (${sensex.change}%)
Gold (per 10g): ₹${gold.per10g}
USD/INR: ₹${usdInr.rate}
${nav.name} NAV: ₹${nav.nav} (${nav.date})
Market Hours: 9:15 AM to 3:30 PM IST weekdays

RBI POLICY RATES (${rbi.lastUpdated}):
Repo Rate: ${rbi.repo}
Reverse Repo: ${rbi.reverseRepo}
CRR: ${rbi.crr} | SLR: ${rbi.slr}
Impact: Higher repo = higher loan EMIs and FD rates

GOVERNMENT SCHEME RATES (${gov.lastUpdated}):
PPF: ${gov.ppf} | SSY: ${gov.ssy} | SCSS: ${gov.scss}
NSC: ${gov.nsc} | KVP: ${gov.kvp} | MIS: ${gov.mis}
Post Office FD: 1yr ${gov.pofd_1yr} 2yr ${gov.pofd_2yr}
  3yr ${gov.pofd_3yr} 5yr ${gov.pofd_5yr}
Post Office RD: ${gov.rd}

INSTRUCTIONS FOR AI:
- Always cite this live data when answering rate questions
- Say "as of ${now}" when quoting rates
- If market data shows unavailable tell user to check
  nseindia.com or bseindia.com for live prices
- Government rates are updated quarterly by Ministry of Finance
- Always compare returns against current inflation (~5%)
`;
  }

  getCacheStatus() {
    return {
      nifty: this.isCacheValid('nifty') ? 'fresh' : 'stale',
      sensex: this.isCacheValid('sensex') ? 'fresh' : 'stale',
      gold: this.isCacheValid('gold') ? 'fresh' : 'stale',
      usdInr: this.isCacheValid('usdinr') ? 'fresh' : 'stale',
      nav: this.isCacheValid('nav') ? 'fresh' : 'stale',
      lastBuild: this.cache['lastBuild']?.timestamp
        ? new Date(this.cache['lastBuild'].timestamp)
            .toLocaleString('en-IN')
        : 'never'
    };
  }
}

module.exports = new LiveRatesService();
