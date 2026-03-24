Write-Host "=== TESTING ALL FIXES ==="

# Test 1: Chatbot Questions
Write-Host "`n--- Chatbot Tests ---"
$questions = @(
    "what is debt",
    "what is tax", 
    "government schemes",
    "what is SIP",
    "tell me a joke"
)

foreach ($q in $questions) {
    Write-Host "Testing: $q"
    $body = @{ message = $q } | ConvertTo-Json -Compress
    
    try {
        $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/chat' -Method Post -ContentType 'application/json' -Body $body -TimeoutSec 30
        if ($response.success -and $response.reply.Length -gt 50) {
            Write-Host "✅ SUCCESS: Proper response received"
        } elseif ($response.success) {
            Write-Host "✅ SUCCESS: Response received (fallback)"
        } else {
            Write-Host "❌ FAILED: $($response.error)"
        }
    } catch {
        Write-Host "❌ ERROR: $($_.Exception.Message)"
    }
}

# Test 2: Financial Features
Write-Host "`n--- Financial Features Tests ---"

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

$features = @(
    @{ name = "Financial Health Summary"; endpoint = "/api/slm/financial-health-summary" },
    @{ name = "Action Plan"; endpoint = "/api/slm/action-plan" },
    @{ name = "Financial Analysis"; endpoint = "/api/slm/analyze" }
)

foreach ($feature in $features) {
    Write-Host "Testing: $($feature.name)"
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000$($feature.endpoint)" -Method Post -ContentType 'application/json' -Body $profile -TimeoutSec 30
        
        if ($response.success) {
            Write-Host "✅ SUCCESS: $($feature.name) working"
        } else {
            Write-Host "❌ FAILED: $($feature.name) - $($response.error)"
        }
    } catch {
        Write-Host "❌ ERROR: $($feature.name) - $($_.Exception.Message)"
    }
}

Write-Host "`n=== ALL TESTS COMPLETE ==="
