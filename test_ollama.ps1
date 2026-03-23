# Test Ollama API
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    model = "mistral:latest"
    prompt = "Hello"
    stream = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/generate" -Method Post -Headers $headers -Body $body -TimeoutSec 10
    Write-Host "✅ Ollama is working!"
    Write-Host "Response: $($response.response)"
} catch {
    Write-Host "❌ Ollama test failed: $($_.Exception.Message)"
}
