@echo off
REM WattsFlow Environment Setup Script
REM This script helps set up environment files for local development

echo.
echo 🚀 WattsFlow Environment Setup
echo ==============================
echo.

REM Check if .env files already exist
if exist "backend\.env" (
  echo ⚠️  Backend .env already exists, skipping...
) else (
  echo Creating backend/.env from template...
  copy "backend\.env.example" "backend\.env" >nul
  echo ✅ Created backend/.env
  echo.
  echo ⚠️  IMPORTANT: Edit backend/.env with your configuration:
  echo    - MongoDB URI (local or MongoDB Atlas)
  echo    - JWT_SECRET (change from default)
  echo    - Google OAuth credentials (if needed)
  echo    - Twilio credentials (if using SMS)
)

echo.

if exist "frontend\.env" (
  echo ⚠️  Frontend .env already exists, skipping...
) else (
  echo Creating frontend/.env from template...
  copy "frontend\.env.example" "frontend\.env" >nul
  echo ✅ Created frontend/.env
)

echo.
echo ========================================
echo 📋 Setup Complete!
echo.
echo Next steps:
echo 1. Edit backend/.env with your actual credentials
echo 2. Run: npm run install:all
echo 3. Run: npm run dev
echo.
echo For Render deployment, see DEPLOYMENT.md
echo.
