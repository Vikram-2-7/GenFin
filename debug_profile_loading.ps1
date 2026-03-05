Write-Host "=== DEBUGGING PROFILE LOADING ==="

# Check database
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/latest-profile' -Method GET -TimeoutSec 5
    Write-Host "Database Response:"
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Database Error: $($_.Exception.Message)"
}

# Check localStorage simulation (check what's stored)
Write-Host "`n=== Checking localStorage simulation ==="
$profilePath = "d:\genfinproj\GenFin v3\project\test_profile.json"
if (Test-Path $profilePath) {
    $profileData = Get-Content $profilePath | ConvertFrom-Json
    Write-Host "Profile in localStorage simulation:"
    $profileData | ConvertTo-Json -Depth 3
} else {
    Write-Host "No profile found in localStorage simulation"
}

# Test with sample profile data
Write-Host "`n=== Testing with sample profile ==="
$sampleProfile = @{
    income = 1200000
    expenses = 800000
    savings = 400000
    debt = 200000
    emergencyFundMonths = 6
    age = 35
    riskTolerance = "moderate"
} | ConvertTo-Json -Depth 4

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/financial-health-summary' -Method POST -ContentType 'application/json' -Body $sampleProfile -TimeoutSec 10
    Write-Host "Sample Profile Response:"
    $response.data | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Sample Profile Error: $($_.Exception.Message)"
}
