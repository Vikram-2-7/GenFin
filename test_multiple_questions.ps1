$questions = @(
    "what is tax",
    "government schemes", 
    "what is SIP",
    "tell me a joke"
)

foreach ($q in $questions) {
    Write-Host "=== Question: $q ==="
    $body = @{ message = $q } | ConvertTo-Json -Compress
    
    try {
        $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/chat' -Method Post -ContentType 'application/json' -Body $body -TimeoutSec 15
        Write-Host "Response: $($response.reply)"
        Write-Host ""
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}
