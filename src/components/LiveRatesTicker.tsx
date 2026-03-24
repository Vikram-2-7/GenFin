import { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

interface LiveData {
  market: {
    nifty: { price: string; change: string };
    sensex: { price: string; change: string };
    gold: { per10g: string };
    usdInr: { rate: string };
  };
  governmentRates: Record<string, string>;
  rbiRates: Record<string, string>;
  timestamp: string;
}

export default function LiveRatesTicker() {
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/rates/live`);
        const json = await res.json();
        if (json.success) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    };

    fetchRates();
    // Refresh every 30 minutes
    const interval = setInterval(fetchRates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="live-ticker loading">
      <span className="pulse-dot"></span>
      <span>Fetching live rates...</span>
    </div>
  );

  if (!data) return null;

  const isPositive = (val: string) =>
    val && !val.includes('-') && val !== 'N/A';

  return (
    <div className="live-ticker">
      <div className="ticker-label">
        <span className="pulse-dot"></span>
        LIVE
      </div>
      <div className="ticker-scroll">
        <div className="ticker-items">

          <div className="ticker-item">
            <span className="ticker-name">NIFTY 50</span>
            <span className="ticker-value">
              {data.market.nifty.price}
            </span>
            <span className={`ticker-change ${
              isPositive(data.market.nifty.change)
                ? 'positive' : 'negative'}`}>
              {data.market.nifty.change !== 'N/A'
                ? `${isPositive(data.market.nifty.change)
                    ? '+' : ''}${data.market.nifty.change}%`
                : ''}
            </span>
          </div>

          <div className="ticker-item">
            <span className="ticker-name">SENSEX</span>
            <span className="ticker-value">
              {data.market.sensex.price}
            </span>
            <span className={`ticker-change ${
              isPositive(data.market.sensex.change)
                ? 'positive' : 'negative'}`}>
              {data.market.sensex.change !== 'N/A'
                ? `${isPositive(data.market.sensex.change)
                    ? '+' : ''}${data.market.sensex.change}%`
                : ''}
            </span>
          </div>

          <div className="ticker-item">
            <span className="ticker-name">GOLD/10g</span>
            <span className="ticker-value">
              ₹{data.market.gold.per10g}
            </span>
          </div>

          <div className="ticker-item">
            <span className="ticker-name">USD/INR</span>
            <span className="ticker-value">
              ₹{data.market.usdInr.rate}
            </span>
          </div>

          <div className="ticker-item">
            <span className="ticker-name">PPF</span>
            <span className="ticker-value">
              {data.governmentRates.ppf}
            </span>
          </div>

          <div className="ticker-item">
            <span className="ticker-name">REPO RATE</span>
            <span className="ticker-value">
              {data.rbiRates.repo}
            </span>
          </div>

          <div className="ticker-item">
            <span className="ticker-name">SSY</span>
            <span className="ticker-value">
              {data.governmentRates.ssy}
            </span>
          </div>

          <div className="ticker-item">
            <span className="ticker-name">SCSS</span>
            <span className="ticker-value">
              {data.governmentRates.scss}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
