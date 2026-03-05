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
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/financial-health-summary' -Method Post -ContentType 'application/json' -Body $profile -TimeoutSec 30
    Write-Host "Response structure:"
    Write-Host "Success: $($response.success)"
    Write-Host "Data keys: $($response.data | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name)"
    
    if ($response.data.statistics) {
        Write-Host "Statistics keys: $($response.data.statistics | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name)"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
