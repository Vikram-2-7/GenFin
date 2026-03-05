$body = @{
    message = "what is debt"
} | ConvertTo-Json -Compress

$response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/chat' -Method Post -ContentType 'application/json' -Body $body
Write-Host "Response:"
Write-Host $response.reply
