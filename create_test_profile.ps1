# Create a test profile in localStorage simulation
$testProfile = @{
    income = 1200000
    expenses = 800000
    savings = 400000
    debt = 200000
    emergencyFundMonths = 6
    age = 35
    investmentMindset = "moderate"
    financialStatus = "healthy"
    fullName = "Test User"
    email = "test@example.com"
    phone = "1234567890"
} | ConvertTo-Json -Depth 4

# Save to localStorage simulation file
$testProfile | Out-File -FilePath "d:\genfinproj\GenFin v3\project\test_profile.json" -Encoding UTF8

Write-Host "✅ Test profile created!"
Write-Host "Profile data:"
$testProfile | ConvertTo-Json -Depth 4

Write-Host "`nNow refresh GenFin AI tab - it should show dynamic data!"
