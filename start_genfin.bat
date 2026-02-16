@echo off
echo ================================
echo Starting MongoDB...
echo ================================
start cmd /k ""D:\MONGO\bin\mongod.exe" --dbpath "D:\data\db""

timeout /t 3

echo ================================
echo Starting Backend...
echo ================================
start cmd /k "cd /d D:\genfinproj\GenFin v3\project\genfin-backend && npx nodemon server.js"

timeout /t 3

echo ================================
echo Starting Frontend...
echo ================================
start cmd /k "cd /d D:\genfinproj\GenFin v3\project && npm run dev"

echo ================================
echo GenFin System Started
echo ================================
