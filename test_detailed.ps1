$body = @{
    message = "what is debt"
} | ConvertTo-Json -Compress

Write-Host "Sending request to API..."
Write-Host "Request body: $body"

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/chat' -Method Post -ContentType 'application/json' -Body $body -TimeoutSec 30
    Write-Host "Response received:"
    Write-Host "Success: $($response.success)"
    Write-Host "Reply: $($response.reply)"
} catch {
    Write-Host "Error occurred: $($_.Exception.Message)"
    Write-Host "Status code: $($_.Exception.Response.StatusCode)"
}
