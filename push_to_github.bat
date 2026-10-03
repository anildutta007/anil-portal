@echo off
title Push Anil Portal to GitHub
cd /d "%~dp0"
echo ========================================================
echo        Pushing anil-portal to GitHub
echo ========================================================
echo.
echo Remote target: https://github.com/anildutta007/anil-portal.git
echo.
git push -u origin main
if errorlevel 1 (
    echo.
    echo [NOTE] If you haven't created the repository on GitHub yet:
    echo 1. Go to https://github.com/new
    echo 2. Repository name: anil-portal
    echo 3. Click "Create repository" (leave it empty)
    echo 4. Run this script again!
)
pause
