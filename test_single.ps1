$body = @{
    message = "what is tax"
} | ConvertTo-Json -Compress

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/chat' -Method Post -ContentType 'application/json' -Body $body -TimeoutSec 60
    Write-Host "Response received:"
    Write-Host $response.reply
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
