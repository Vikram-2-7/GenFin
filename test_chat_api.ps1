Write-Host "=== TESTING CHAT API DIRECTLY ==="

# Test 1: Check if chat routes are registered
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -Method GET -TimeoutSec 5
    Write-Host "✅ Backend health: OK"
} catch {
    Write-Host "❌ Backend not accessible"
    exit
}

# Test 2: Test chat history endpoint
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/chat/history' -Method GET -TimeoutSec 5
    Write-Host "✅ Chat history endpoint working"
    Write-Host "Messages: $($response.messages.length)"
} catch {
    Write-Host "❌ Chat history error: $($_.Exception.Message)"
}

# Test 3: Test save message endpoint
$testMessage = @{
    role = 'user'
    content = 'Test message for persistence'
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/chat/message' -Method POST -ContentType 'application/json' -Body $testMessage -TimeoutSec 5
    Write-Host "✅ Save message working"
    Write-Host "Message ID: $($response.message._id)"
} catch {
    Write-Host "❌ Save message error: $($_.Exception.Message)"
}

# Test 4: Test clear chat endpoint
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/chat/history' -Method DELETE -TimeoutSec 5
    Write-Host "✅ Clear chat working"
    Write-Host "Deleted: $($response.deletedCount) messages"
} catch {
    Write-Host "❌ Clear chat error: $($_.Exception.Message)"
}

Write-Host "`n=== CHAT API TEST COMPLETE ==="
