@echo off
title Anil Dutta - Web Apps, Financial Articles & HELP Hub
cd /d "%~dp0"
echo ========================================================
echo   Anil Dutta - Digital Web-Apps & Financial Insights Hub
echo   Master Launchpad, Article Library & Community Q&A Desk
echo ========================================================
echo.
echo Starting master portal on http://127.0.0.1:8090 ...
echo Press Ctrl+C to stop.
echo.

python server.py

if errorlevel 1 (
    echo.
    echo Launching index.html directly in browser...
    start "" "%~dp0static\index.html"
)

pause
