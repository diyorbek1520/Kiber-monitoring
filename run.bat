@echo off
setlocal

cd /d "%~dp0"
title AI Kiberxavfsizlik Platformasi

echo AI Kiberxavfsizlik Platformasi ishga tushirilmoqda...
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js topilmadi. Avval Node.js o'rnating.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Paketlar o'rnatilmoqda. Bu bir necha daqiqa olishi mumkin...
  call npm.cmd install
  if errorlevel 1 (
    echo Paketlarni o'rnatishda xatolik yuz berdi.
    pause
    exit /b 1
  )
)

if not exist "server\.env" (
  echo server\.env topilmadi. server\.env.example asosida server\.env yarating.
  pause
  exit /b 1
)

echo Backend oynasi ochilmoqda...
start "Kiber Platforma Backend" cmd /k "cd /d %~dp0server && node src/index.js"

echo Frontend oynasi ochilmoqda...
start "Kiber Platforma Frontend" cmd /k "cd /d %~dp0 && npm.cmd run dev --workspace client -- --host 127.0.0.1"

echo.
echo Platforma ishga tushmoqda...
echo Frontend: http://127.0.0.1:5173
echo Backend:  http://127.0.0.1:5000
echo.

timeout /t 6 /nobreak >nul
start "" "http://127.0.0.1:5173"

echo Agar sahifa darhol ochilmasa, 10-20 soniya kutib brauzerni yangilang.
pause
