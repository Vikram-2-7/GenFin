@echo off
echo ========================================
echo         GenFin.ai Status Check
echo ========================================
echo.

:: Check Node.js
echo [1/6] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [✓] Node.js installed: %NODE_VERSION%
) else (
    echo [✗] Node.js not found
)

:: Check MongoDB
echo [2/6] Checking MongoDB...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] MongoDB service installed
    sc query MongoDB | findstr "RUNNING" >nul
    if %errorlevel% equ 0 (
        echo [✓] MongoDB service running
    ) else (
        echo [!] MongoDB service not running
    )
) else (
    echo [!] MongoDB service not found
)

:: Check Ollama
echo [3/6] Checking Ollama...
ollama --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('ollama --version') do set OLLAMA_VERSION=%%i
    echo [✓] Ollama installed: %OLLAMA_VERSION%
    
    ollama list | findstr "mistral" >nul
    if %errorlevel% equ 0 (
        echo [✓] Mistral model available
    ) else (
        echo [!] Mistral model not found
    )
) else (
    echo [✗] Ollama not found
)

:: Check Backend Port
echo [4/6] Checking Backend (Port 5000)...
netstat -an | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo [✓] Backend running on port 5000
    
    :: Test backend health
    curl -s http://localhost:5000/api/health >nul 2>&1
    if %errorlevel% equ 0 (
        echo [✓] Backend API responding
    ) else (
        echo [!] Backend API not responding
    )
) else (
    echo [!] Backend not running on port 5000
)

:: Check Frontend Port
echo [5/6] Checking Frontend (Port 5173)...
netstat -an | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo [✓] Frontend running on port 5173
) else (
    echo [!] Frontend not running on port 5173
)

:: Check Ollama Port
echo [6/6] Checking Ollama (Port 11434)...
netstat -an | findstr :11434 >nul
if %errorlevel% equ 0 (
    echo [✓] Ollama running on port 11434
    
    :: Test Ollama API
    curl -s http://localhost:11434/api/tags >nul 2>&1
    if %errorlevel% equ 0 (
        echo [✓] Ollama API responding
    ) else (
        echo [!] Ollama API not responding
    )
) else (
    echo [!] Ollama not running on port 11434
)

echo.
echo ========================================
echo         Status Check Complete
echo ========================================
echo.
echo Access URLs:
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:5000
echo - Ollama:   http://localhost:11434
echo.
pause
