@echo off
echo ========================================
echo         GenFin.ai Stop Script
echo ========================================
echo.

echo Stopping GenFin.ai services...

:: Stop Node.js processes (Frontend and Backend)
echo [1/3] Stopping Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Node.js processes stopped
) else (
    echo [!] No Node.js processes found
)

:: Stop Ollama if running
echo [2/3] Stopping Ollama...
tasklist | findstr "ollama" >nul
if %errorlevel% equ 0 (
    taskkill /F /IM ollama.exe >nul 2>&1
    echo [✓] Ollama stopped
) else (
    echo [!] Ollama not running
)

:: Optional: Stop MongoDB (commented out for safety)
echo [3/3] MongoDB service left running (stop manually if needed)
echo To stop MongoDB: net stop MongoDB

echo.
echo ========================================
echo         GenFin.ai Stopped
echo ========================================
echo.
echo Services stopped:
echo - Frontend (Node.js)
echo - Backend (Node.js)  
echo - Ollama
echo.
echo MongoDB is still running for next startup.
echo.
pause
