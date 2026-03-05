@echo off
echo ========================================
echo         GenFin.ai Startup Script
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if MongoDB is running
echo [1/4] Checking MongoDB connection...
cd /d "%~dp0genfin-backend"
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://127.0.0.1:27017/genfin').then(() => { console.log('MongoDB Connected'); process.exit(0); }).catch(() => { console.log('MongoDB Not Connected'); process.exit(1); })"

if %errorlevel% neq 0 (
    echo [ERROR] MongoDB is not running
    echo Please start MongoDB service or install MongoDB Community Server
    echo.
    echo MongoDB Installation:
    echo 1. Download from: https://www.mongodb.com/try/download/community
    echo 2. Install with default settings
    echo 3. Start MongoDB service
    pause
    exit /b 1
)

echo [✓] MongoDB is running
echo.

:: Check if Ollama is installed and running
echo [2/4] Checking Ollama...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Ollama is not installed
    echo Installing Ollama...
    winget install Ollama.Ollama
    if %errorlevel% neq 0 (
        echo Please install Ollama manually from: https://ollama.com/
        pause
        exit /b 1
    )
)

:: Start Ollama if not running
tasklist | findstr "ollama" >nul
if %errorlevel% neq 0 (
    echo Starting Ollama...
    start "Ollama" ollama serve
    timeout /t 5 /nobreak >nul
)

:: Check if Mistral model is available
ollama list | findstr "mistral" >nul
if %errorlevel% neq 0 (
    echo Pulling Mistral model (this may take a few minutes)...
    ollama pull mistral
)

echo [✓] Ollama is running with Mistral model
echo.

:: Install backend dependencies
echo [3/4] Installing backend dependencies...
cd /d "%~dp0genfin-backend"
if not exist node_modules (
    npm install
)
echo [✓] Backend dependencies installed
echo.

:: Install frontend dependencies
echo [4/4] Installing frontend dependencies...
cd /d "%~dp0"
if not exist node_modules (
    npm install
)
echo [✓] Frontend dependencies installed
echo.

:: Start backend server
echo Starting backend server...
cd /d "%~dp0genfin-backend"
start "GenFin Backend" cmd /k "node server.js"

:: Wait for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend development server
echo Starting frontend development server...
cd /d "%~dp0"
start "GenFin Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo         GenFin.ai Started Successfully!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo Ollama:   http://localhost:11434
echo.
echo Press any key to open GenFin.ai in your browser...
pause >nul

:: Open in browser
start http://localhost:5173

echo.
echo GenFin.ai is now running! Check the separate terminal windows for logs.
echo.
echo To stop all services:
echo 1. Close the terminal windows
echo 2. Or press Ctrl+C in each terminal
echo.
pause
