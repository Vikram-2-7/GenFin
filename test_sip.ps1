$body = @{
    message = "what is SIP"
} | ConvertTo-Json -Compress

$response = Invoke-RestMethod -Uri 'http://localhost:5000/api/slm/chat' -Method Post -ContentType 'application/json' -Body $body
Write-Host $response
Write-Host "Response length:"
$response.Length
