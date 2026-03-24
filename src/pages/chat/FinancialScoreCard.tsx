interface ScoreCardProps {
  profile: any;
  metrics: any;
}

export function FinancialScoreCard(
  { profile, metrics }: ScoreCardProps) {

  const score = metrics?.readinessScore || 0;
  const color = score >= 75 ? '#10b981'
    : score >= 50 ? '#f59e0b'
    : score >= 25 ? '#f97316' : '#ef4444';
  const label = score >= 75 ? 'Investment Ready'
    : score >= 50 ? 'Almost Ready'
    : score >= 25 ? 'Building Foundation'
    : 'Getting Started';

  const income = Number(profile?.income ||
    profile?.monthlyIncome || 0);
  const expenses = Number(profile?.monthlyExpenses ||
    profile?.expenses || 0);
  const monthlySavings = income - expenses;
  const savingsRate = income > 0
    ? ((monthlySavings / income) * 100).toFixed(1)
    : '0';
  const emergencyFund = Number(profile?.emergencyFund || 0);
  const emergencyCoverage = expenses > 0
    ? (emergencyFund / expenses).toFixed(1)
    : '0';
  const debt = Number(profile?.debt || 0);
  const dti = income > 0
    ? ((debt / (income * 12)) * 100).toFixed(1)
    : '0';

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      border: `1px solid ${color}30`,
      borderRadius: '16px',
      padding: '20px',
      margin: '8px 0',
      maxWidth: '400px'
    }}>
      <div style={{ display: 'flex',
        alignItems: 'center', gap: '16px',
        marginBottom: '16px' }}>
        <div style={{
          width: '72px', height: '72px',
          borderRadius: '50%',
          background: `conic-gradient(${color} ${score * 3.6}deg,
            rgba(255,255,255,0.05) 0deg)`,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
          boxShadow: `0 0 20px ${color}30` 
        }}>
          <div style={{
            width: '56px', height: '56px',
            borderRadius: '50%',
            background: '#0f172a',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color, fontSize: '1.1rem',
              fontWeight: 900 }}>{score}</span>
            <span style={{ color: '#475569',
              fontSize: '0.55rem' }}>/100</span>
          </div>
        </div>
        <div>
          <div style={{ color: '#f1f5f9',
            fontWeight: 700, fontSize: '1rem' }}>
            {label}
          </div>
          <div style={{ color: '#64748b',
            fontSize: '0.75rem', marginTop: '2px' }}>
            Financial Readiness Score
          </div>
        </div>
      </div>

      {[
        { label: 'Savings Rate',
          value: Number(savingsRate), target: 20,
          unit: '%', inverse: false },
        { label: 'Emergency Fund',
          value: Number(emergencyCoverage), target: 6,
          unit: ' months', inverse: false },
        { label: 'Debt-to-Income',
          value: Number(dti), target: 40,
          unit: '%', inverse: true },
      ].map((item, i) => {
        const pct = item.inverse
          ? Math.max(0, 100 - (item.value / item.target * 100))
          : Math.min(100, (item.value / item.target) * 100);
        const barColor = pct >= 75 ? '#10b981'
          : pct >= 50 ? '#f59e0b' : '#ef4444';
        return (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px' }}>
              <span style={{ color: '#94a3b8',
                fontSize: '0.72rem' }}>{item.label}</span>
              <span style={{ color: '#e2e8f0',
                fontSize: '0.72rem', fontWeight: 700 }}>
                {item.value}{item.unit}
              </span>
            </div>
            <div style={{ height: '4px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: barColor,
                borderRadius: '99px',
                transition: 'width 1s ease'
              }} />
            </div>
          </div>
        );
      })}

      <div style={{ display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px', marginTop: '12px' }}>
        {[
          { label: 'Monthly Income',
            value: `₹${income.toLocaleString('en-IN')}` },
          { label: 'Monthly Savings',
            value: `₹${monthlySavings.toLocaleString('en-IN')}` },
        ].map((item, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '10px', padding: '10px'
          }}>
            <div style={{ color: '#475569',
              fontSize: '0.65rem' }}>{item.label}</div>
            <div style={{ color: '#f1f5f9',
              fontSize: '0.9rem', fontWeight: 700,
              marginTop: '2px' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FinancialScoreCard;
