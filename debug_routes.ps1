Write-Host "=== DEBUGGING ROUTE REGISTRATION ==="

# Test all known endpoints
$endpoints = @(
    "http://localhost:5000/api/health",
    "http://localhost:5000/api/profile",
    "http://localhost:5000/api/slm/analyze",
    "http://localhost:5000/api/chat/history"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-RestMethod -Uri $endpoint -Method GET -TimeoutSec 3
        Write-Host "✅ $endpoint - Working"
    } catch {
        Write-Host "❌ $endpoint - $($_.Exception.Message)"
    }
}

Write-Host "`n=== ROUTE DEBUG COMPLETE ==="
