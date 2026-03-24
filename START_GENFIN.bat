@echo off
title GenFin.ai - One Click Startup
color 0A
cls

echo.
echo  ================================================
echo   GENFIN.AI - Intelligent Financial Assistant
echo  ================================================
echo.

:: ── CHECK NODE.JS ──
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: Node.js not installed!
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)
for /f %%i in ('node --version') do echo OK - Node.js %%i
echo.

:: ── CHECK GROQ API KEY ──
echo [2/5] Checking Groq API Key...
set BACKEND_DIR=genfin-backend
findstr /i "GROQ_API_KEY=y" "%BACKEND_DIR%\.env" >nul 2>&1
if %errorlevel% equ 0 (
    color 0E
    echo WARNING: Groq API Key looks like placeholder!
    echo Please edit %BACKEND_DIR%\.env and set real key.
    echo Get free key at: https://console.groq.com
    echo.
    echo Press any key to continue anyway...
    pause >nul
) else (
    echo OK - Groq API Key found
)
echo.

:: ── INSTALL BACKEND DEPS ──
echo [3/5] Checking backend dependencies...
cd /d "%~dp0%BACKEND_DIR%"
call npm install --silent 2>nul
echo OK - Backend dependencies ready
cd /d "%~dp0"
echo.

:: ── INSTALL FRONTEND DEPS ──
echo [4/5] Checking frontend dependencies...
call npm install --silent 2>nul
echo OK - Frontend dependencies ready
echo.

:: ── LAUNCH EVERYTHING ──
echo [5/5] Launching GenFin.ai...
echo.
echo  Backend  → http://localhost:5000
echo  Frontend → http://localhost:5173
echo.
echo  Two terminal windows will open.
echo  Keep them running while using the app.
echo.
echo  ================================================
echo   Opening browser in 5 seconds...
echo  ================================================
echo.

:: Start backend
start "GenFin — Backend Server" cmd /k "color 0B && echo GenFin Backend Starting... && cd /d "%~dp0%BACKEND_DIR%" && npm start"

:: Wait for backend to init
timeout /t 4 /nobreak >nul

echo.
echo  Waiting for live data to load...
timeout /t 5 /nobreak >nul
echo  Checking live rates...
powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:5000/api/rates/live' -UseBasicParsing -TimeoutSec 5).StatusCode } catch { 'offline' }"
echo.

:: Start frontend
start "GenFin — Frontend Server" cmd /k "color 0D && echo GenFin Frontend Starting... && cd /d "%~dp0" && npm run dev"

:: Wait then open browser
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo  GenFin.ai is running!
echo  Visit: http://localhost:5173
echo.
echo  Close this window when you are done.
echo  (The two server windows must stay open)
echo.
pause
