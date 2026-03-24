Write-Host "=== TESTING GENFIN AI FUNCTIONALITY ==="

# Test 1: Check if frontend loads
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5175' -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend accessible: $($response.StatusCode)"
} catch {
    Write-Host "❌ Frontend not accessible: $($_.Exception.Message)"
}

# Test 2: Check if backend is accessible
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -Method GET -TimeoutSec 5
    Write-Host "✅ Backend health: $($response.StatusCode)"
} catch {
    Write-Host "❌ Backend not accessible: $($_.Exception.Message)"
}

# Test 3: Test financial summary with profile data
$testProfile = @{
    income = 1200000
    expenses = 800000
    savings = 400000
    debt = 200000
    emergencyFundMonths = 6
    age = 35
    investmentMindset = "moderate"
} | ConvertTo-Json -Depth 4

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/financial-health-summary' -Method POST -ContentType 'application/json' -Body $testProfile -TimeoutSec 10
    Write-Host "`n=== FINANCIAL SUMMARY RESULTS ==="
    Write-Host "Readiness Score: $($response.data.analysis.readinessScore)"
    Write-Host "Savings Rate: $($response.data.analysis.savingsRate)%"
    Write-Host "Emergency Fund: $($response.data.statistics.emergencyFund.currentMonths) months"
    Write-Host "Monthly Income: ₹$($response.data.statistics.cashFlow.monthlyIncome)"
    Write-Host "Monthly Expenses: ₹$($response.data.statistics.cashFlow.monthlyExpenses)"
    Write-Host "Monthly Savings: ₹$($response.data.statistics.cashFlow.monthlySavings)"
    Write-Host "Investment Ready: $($response.data.investmentReadiness.isReady)"
    Write-Host "Recommended Amount: ₹$($response.data.investmentReadiness.recommendation.amount)"
} catch {
    Write-Host "❌ Financial summary error: $($_.Exception.Message)"
}

Write-Host "`n=== TEST COMPLETE ==="
