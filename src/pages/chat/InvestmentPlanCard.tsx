import { useNavigate } from 'react-router-dom';

interface PlanProps {
  profile: any;
  metrics?: any;
  onSchemeClick?: (schemeId: string) => void;
}

export function InvestmentPlanCard(
  { profile, metrics, onSchemeClick }: PlanProps) {

  const navigate = useNavigate();

  const income = Number(profile?.income ||
    profile?.monthlyIncome || 0);
  const expenses = Number(profile?.monthlyExpenses ||
    profile?.expenses || 0);
  const monthlySavings = income - expenses;
  const investable = Math.max(0, monthlySavings * 0.7);
  const risk = profile?.riskTolerance || 'moderate';
  const score = metrics?.readinessScore || 0;

  const allocations = risk === 'aggressive'
    ? [
        { label: 'Equity Mutual Funds', pct: 60,
          color: '#6366f1', amount: investable * 0.6 },
        { label: 'Index Fund SIP', pct: 20,
          color: '#8b5cf6', amount: investable * 0.2 },
        { label: 'Government Schemes', pct: 10,
          color: '#10b981', amount: investable * 0.1 },
        { label: 'Emergency Liquid', pct: 10,
          color: '#f59e0b', amount: investable * 0.1 },
      ]
    : risk === 'conservative'
    ? [
        { label: 'Government Schemes', pct: 50,
          color: '#10b981', amount: investable * 0.5 },
        { label: 'Fixed Deposits', pct: 25,
          color: '#f59e0b', amount: investable * 0.25 },
        { label: 'Debt Mutual Funds', pct: 15,
          color: '#6366f1', amount: investable * 0.15 },
        { label: 'Emergency Fund', pct: 10,
          color: '#94a3b8', amount: investable * 0.1 },
      ]
    : [
        { label: 'Equity Mutual Funds', pct: 40,
          color: '#6366f1', amount: investable * 0.4 },
        { label: 'Government Schemes', pct: 30,
          color: '#10b981', amount: investable * 0.3 },
        { label: 'Index Fund SIP', pct: 20,
          color: '#8b5cf6', amount: investable * 0.2 },
        { label: 'Emergency Liquid', pct: 10,
          color: '#f59e0b', amount: investable * 0.1 },
      ];

  const schemes = score < 50
    ? [
        { id: 'ppf', name: 'PPF', rate: '7.1%',
          reason: 'Safe guaranteed returns, tax-free',
          url: 'https://www.indiapost.gov.in',
          color: '#10b981' },
        { id: 'nsc', name: 'NSC', rate: '7.7%',
          reason: '80C tax benefit, 5 year lock-in',
          url: 'https://www.indiapost.gov.in',
          color: '#6366f1' },
      ]
    : [
        { id: 'ppf', name: 'PPF', rate: '7.1%',
          reason: 'Core long-term wealth builder',
          url: 'https://www.indiapost.gov.in',
          color: '#10b981' },
        { id: 'nps', name: 'NPS', rate: '9-12%',
          reason: 'Retirement + extra ₹50k tax deduction',
          url: 'https://www.npscra.nsdl.co.in',
          color: '#6366f1' },
        { id: 'elss', name: 'ELSS', rate: '12-15%',
          reason: 'Tax saving + equity growth, 3yr lock',
          url: 'https://www.amfiindia.com',
          color: '#8b5cf6' },
      ];

  const handleSchemeClick = (id: string) => {
    if (onSchemeClick) {
      onSchemeClick(id);
    } else {
      navigate(`/schemes?scheme=${id}`);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: '16px', padding: '20px',
      margin: '8px 0', maxWidth: '460px'
    }}>
      <div style={{ color: '#6366f1', fontSize: '0.62rem',
        fontFamily: 'monospace', letterSpacing: '0.15em',
        marginBottom: '4px' }}>YOUR INVESTMENT PLAN</div>
      <div style={{ color: '#f1f5f9', fontWeight: 800,
        fontSize: '1.1rem', marginBottom: '2px' }}>
        Monthly Investable: ₹{Math.round(investable)
          .toLocaleString('en-IN')}
      </div>
      <div style={{ color: '#475569', fontSize: '0.75rem',
        marginBottom: '16px' }}>
        Based on ₹{income.toLocaleString('en-IN')} income
        · {risk} risk profile
      </div>

      <div style={{ display: 'flex', height: '10px',
        borderRadius: '99px', overflow: 'hidden',
        marginBottom: '14px' }}>
        {allocations.map((a, i) => (
          <div key={i} style={{
            width: `${a.pct}%`, background: a.color
          }} />
        ))}
      </div>

      {allocations.map((a, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '8px'
        }}>
          <div style={{ display: 'flex',
            alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px',
              borderRadius: '50%', background: a.color,
              flexShrink: 0 }} />
            <span style={{ color: '#94a3b8',
              fontSize: '0.78rem' }}>{a.label}</span>
          </div>
          <div style={{ display: 'flex',
            gap: '10px', alignItems: 'center' }}>
            <span style={{ color: a.color,
              fontSize: '0.72rem', fontWeight: 700 }}>
              {a.pct}%
            </span>
            <span style={{ color: '#e2e8f0',
              fontSize: '0.78rem', fontWeight: 700,
              minWidth: '90px', textAlign: 'right' }}>
              ₹{Math.round(a.amount)
                .toLocaleString('en-IN')}/mo
            </span>
          </div>
        </div>
      ))}

      <div style={{ color: '#475569', fontSize: '0.62rem',
        fontFamily: 'monospace', letterSpacing: '0.1em',
        marginBottom: '10px', marginTop: '16px',
        paddingTop: '14px',
        borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        RECOMMENDED SCHEMES
      </div>

      {schemes.map((scheme, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${scheme.color}20`,
          borderRadius: '12px', padding: '12px',
          marginBottom: '8px', display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex',
              alignItems: 'center', gap: '8px',
              marginBottom: '2px' }}>
              <span style={{ color: scheme.color,
                fontWeight: 800,
                fontSize: '0.9rem' }}>{scheme.name}</span>
              <span style={{ color: scheme.color,
                fontSize: '0.68rem',
                background: `${scheme.color}15`,
                padding: '1px 8px',
                borderRadius: '99px' }}>
                {scheme.rate}
              </span>
            </div>
            <div style={{ color: '#64748b',
              fontSize: '0.7rem' }}>{scheme.reason}</div>
          </div>
          <div style={{ display: 'flex',
            flexDirection: 'column', gap: '4px',
            marginLeft: '10px' }}>
            <button
              onClick={() => handleSchemeClick(scheme.id)}
              style={{
                padding: '4px 10px',
                background: `${scheme.color}20`,
                border: `1px solid ${scheme.color}40`,
                borderRadius: '8px',
                color: scheme.color,
                fontSize: '0.65rem', fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap'
              }}>
              View in App
            </button>
            <a href={scheme.url} target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '4px 10px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px', color: '#475569',
                fontSize: '0.65rem',
                textDecoration: 'none',
                textAlign: 'center', display: 'block'
              }}>
              Official Site
            </a>
          </div>
        </div>
      ))}

      <div style={{ color: '#334155', fontSize: '0.65rem',
        marginTop: '8px', fontStyle: 'italic' }}>
        * Review quarterly. Adjust as income grows.
      </div>
    </div>
  );
}

export default InvestmentPlanCard;
