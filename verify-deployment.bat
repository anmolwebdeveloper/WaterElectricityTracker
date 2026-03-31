@echo off
REM WattsFlow Production Readiness Verification Script (Windows)
REM This script checks if the application is ready for deployment to Render

echo.
echo 🔍 WattsFlow Deployment Readiness Checker
echo ==========================================
echo.

setlocal enabledelayedexpansion
set ERRORS=0
set WARNINGS=0

REM Check 1: Git .gitignore configuration
echo 1️⃣  Checking .gitignore configuration...
findstr /M "\.env" .gitignore >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo    ✅ .gitignore contains .env
) else (
  echo    ❌ .gitignore missing .env entry
  set /a ERRORS=ERRORS+1
)

REM Check 2: Backend .env.example exists
echo.
echo 2️⃣  Checking example environment files...
if exist "backend\.env.example" (
  echo    ✅ Backend .env.example exists
) else (
  echo    ❌ Backend .env.example missing
  set /a ERRORS=ERRORS+1
)

if exist "frontend\.env.example" (
  echo    ✅ Frontend .env.example exists
) else (
  echo    ❌ Frontend .env.example missing
  set /a ERRORS=ERRORS+1
)

REM Check 3: Package.json scripts
echo.
echo 3️⃣  Checking package.json scripts...
findstr /M "\"build\"" package.json >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo    ✅ Build scripts configured
) else (
  echo    ❌ Build scripts not configured
  set /a ERRORS=ERRORS+1
)

REM Check 4: render.yaml exists
echo.
echo 4️⃣  Checking Render configuration...
if exist "render.yaml" (
  echo    ✅ render.yaml configuration file exists
) else (
  echo    ❌ render.yaml not found
  set /a ERRORS=ERRORS+1
)

REM Check 5: Backend server.js exists
echo.
echo 5️⃣  Checking backend configuration...
if exist "backend\server.js" (
  echo    ✅ Backend server.js found
) else (
  echo    ❌ Backend server.js not found
  set /a ERRORS=ERRORS+1
)

REM Check 6: Frontend package.json
echo.
echo 6️⃣  Checking frontend configuration...
if exist "frontend\package.json" (
  echo    ✅ Frontend package.json found
) else (
  echo    ❌ Frontend package.json not found
  set /a ERRORS=ERRORS+1
)

REM Summary
echo.
echo ==========================================
echo 📊 Summary:
echo    Errors: %ERRORS%
echo    Warnings: %WARNINGS%
echo.

if %ERRORS% EQU 0 (
  echo ✅ Application appears ready for Render deployment!
  echo.
  echo Next steps:
  echo 1. Set up MongoDB Atlas: https://www.mongodb.com/cloud/atlas
  echo 2. Push code to GitHub
  echo 3. Connect to Render: https://render.com
  echo 4. Follow DEPLOYMENT.md for detailed instructions
) else (
  echo ❌ Please fix the errors above before deploying
)

echo.
pause
