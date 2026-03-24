$profile = @{
    income = 1200000
    expenses = 800000
    savings = 400000
    debt = 200000
    emergencyFundMonths = 6
    age = 35
    riskTolerance = "moderate"
    financialGoals = "Retirement planning"
    timeHorizon = "10 years"
} | ConvertTo-Json -Depth 4

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/financial-health-summary' -Method POST -ContentType 'application/json' -Body $profile -TimeoutSec 30
    Write-Host "Full response structure:"
    $response.data | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
