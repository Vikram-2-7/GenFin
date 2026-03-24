function calculateScores(data) {

  const age = Number(data.age) || 0;

  if (age < 18) {
    throw new Error("User must be 18+ to invest.");
  }

  const income = Number(data.income) || 1;
  const savings = Number(data.savings) || 0;
  const debt = Number(data.debt) || 0;
  const emergencyFundMonths = Number(data.emergencyFundMonths) || 0;

  const savingsRatio = savings / income;
  const debtRatio = debt / (income * 12);

  let riskScore = 0;
  let stabilityScore = 0;

  if (age < 30) riskScore += 30;
  else if (age < 45) riskScore += 20;
  else riskScore += 10;

  if (savingsRatio > 0.3) stabilityScore += 40;
  else if (savingsRatio > 0.15) stabilityScore += 25;
  else stabilityScore += 10;

  if (emergencyFundMonths >= 6) stabilityScore += 30;
  else if (emergencyFundMonths >= 3) stabilityScore += 15;
  else stabilityScore += 5;

  // Stronger debt penalty
  if (debtRatio > 1) {
    stabilityScore -= 30;
  } else if (debtRatio > 0.5) {
    stabilityScore -= 15;
  }

  const readinessScore = stabilityScore - (debtRatio * 20);

  return {
    riskScore: Math.max(0, Math.min(100, riskScore)),
    stabilityScore: Math.max(0, Math.min(100, stabilityScore)),
    readinessScore: Math.max(0, Math.min(100, readinessScore))
  };
}

module.exports = calculateScores;
