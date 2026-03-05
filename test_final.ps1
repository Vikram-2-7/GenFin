$questions = @(
    "what is debt",
    "tax planning",
    "government schemes",
    "what is SIP"
)

Write-Host "=== TESTING CHATBOT FIXES ==="

foreach ($q in $questions) {
    Write-Host ""
    Write-Host "Question: $q"
    Write-Host "---"
    
    $body = @{ message = $q } | ConvertTo-Json -Compress
    
    try {
        $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/chat' -Method Post -ContentType 'application/json' -Body $body -TimeoutSec 30
        Write-Host "✅ Success: $($response.reply.Substring(0, [Math]::Min(100, $response.reply.Length)))..."
        if ($response.reply.Length -gt 100) {
            Write-Host "   (truncated - full response received)"
        }
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "=== CHATBOT TESTING COMPLETE ==="
