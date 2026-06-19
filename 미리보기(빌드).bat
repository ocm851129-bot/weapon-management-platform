@echo off
chcp 65001 >nul
title DATEWORLD - Preview Mode
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   DATEWORLD WMS - 미리보기 모드 시작     ║
echo  ╚══════════════════════════════════════════╝
echo.
echo  빌드된 파일을 서빙합니다 (더 빠름)
echo.
cd /d "%~dp0"
start http://localhost:4173
npm run preview
pause
