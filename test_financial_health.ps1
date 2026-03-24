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

Write-Host "Testing financial health summary..."
Write-Host "Profile: $profile"

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/financial-health-summary' -Method Post -ContentType 'application/json' -Body $profile -TimeoutSec 30
    Write-Host "Success: $($response.success)"
    if ($response.success) {
        Write-Host "Analysis completed successfully"
    } else {
        Write-Host "Error: $($response.error)"
    }
} catch {
    Write-Host "Request failed: $($_.Exception.Message)"
}
