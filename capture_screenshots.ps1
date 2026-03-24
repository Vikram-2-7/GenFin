# Script to capture screenshots of the working GenFin application
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Take-Screenshot {
    param(
        [string]$Path,
        [int]$Delay = 2
    )
    
    Start-Sleep -Seconds $Delay
    
    $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap $bounds.width, $bounds.height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.size)
    
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

Write-Host "📸 Capturing screenshots of GenFin application..."

# Take initial screenshot
Take-Screenshot -Path "d:\genfinproj\GenFin v3\project\proof_backend_running.png" -Delay 1

Write-Host "✅ Backend running screenshot captured"

# Open browser to capture frontend
Start-Process "http://localhost:5173"
Take-Screenshot -Path "d:\genfinproj\GenFin v3\project\proof_frontend_loaded.png" -Delay 3

Write-Host "✅ Frontend loaded screenshot captured"

Write-Host "🎉 Screenshots captured successfully!"
Write-Host "Files saved:"
Write-Host "- proof_backend_running.png"
Write-Host "- proof_frontend_loaded.png""
