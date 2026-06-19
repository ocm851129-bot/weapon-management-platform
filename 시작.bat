@echo off
chcp 65001 >nul
title DATEWORLD - Weapon Management Platform
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║     DATEWORLD WMS - 서버 시작 중...      ║
echo  ╚══════════════════════════════════════════╝
echo.
echo  서버가 시작되면 브라우저에서 자동으로 열립니다.
echo  종료하려면 이 창을 닫으세요.
echo.
cd /d "%~dp0"
start http://localhost:5173
npm run dev
pause
