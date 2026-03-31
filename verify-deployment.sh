#!/bin/bash

# WattsFlow Production Readiness Verification Script
# This script checks if the application is ready for deployment to Render

echo "🔍 WattsFlow Deployment Readiness Checker"
echo "=========================================="
echo ""

ERRORS=0
WARNINGS=0

# Check 1: Git .gitignore configuration
echo "1️⃣  Checking .gitignore configuration..."
if grep -q "\.env" .gitignore && grep -q "node_modules" .gitignore; then
  echo "   ✅ .gitignore properly configured"
else
  echo "   ❌ .gitignore missing critical entries"
  ERRORS=$((ERRORS + 1))
fi

# Check 2: Backend .env file not committed
echo ""
echo "2️⃣  Checking if .env files are properly ignored..."
if [ ! -f "backend/.env" ] || ! git ls-files --cached | grep -q "backend/.env"; then
  echo "   ✅ Backend .env is not in git"
else
  echo "   ⚠️  WARNING: Backend .env might be tracked in git"
  WARNINGS=$((WARNINGS + 1))
fi

# Check 3: Environment example files exist
echo ""
echo "3️⃣  Checking example environment files..."
if [ -f "backend/.env.example" ] && [ -f "frontend/.env.example" ]; then
  echo "   ✅ .env.example files exist"
else
  echo "   ❌ Missing .env.example files"
  ERRORS=$((ERRORS + 1))
fi

# Check 4: Package.json scripts
echo ""
echo "4️⃣  Checking package.json scripts..."
if grep -q '"build"' package.json; then
  echo "   ✅ Build scripts configured"
else
  echo "   ❌ Build scripts not configured"
  ERRORS=$((ERRORS + 1))
fi

# Check 5: render.yaml exists
echo ""
echo "5️⃣  Checking Render configuration..."
if [ -f "render.yaml" ]; then
  echo "   ✅ render.yaml configuration file exists"
else
  echo "   ❌ render.yaml not found"
  ERRORS=$((ERRORS + 1))
fi

# Check 6: Frontend vite.config.js has build config
echo ""
echo "6️⃣  Checking Vite build configuration..."
if grep -q "build:" frontend/vite.config.js; then
  echo "   ✅ Vite build configuration found"
else
  echo "   ⚠️  WARNING: Vite build configuration might be missing"
  WARNINGS=$((WARNINGS + 1))
fi

# Check 7: CORS configuration in server.js
echo ""
echo "7️⃣  Checking CORS configuration..."
if grep -q "corsOrigins\|process.env.FRONTEND_URL" backend/server.js; then
  echo "   ✅ CORS properly configured for environment variables"
else
  echo "   ⚠️  WARNING: CORS might not be flexible for production"
  WARNINGS=$((WARNINGS + 1))
fi

# Check 8: MongoDB connection uses environment variable
echo ""
echo "8️⃣  Checking MongoDB configuration..."
if grep -q "process.env.MONGODB_URI" backend/server.js; then
  echo "   ✅ MongoDB using environment variables"
else
  echo "   ❌ MongoDB might be hardcoded"
  ERRORS=$((ERRORS + 1))
fi

# Check 9: JWT configuration
echo ""
echo "9️⃣  Checking JWT configuration..."
if grep -q "process.env.JWT_SECRET" backend/routes/auth.js; then
  echo "   ✅ JWT using environment variables"
else
  echo "   ❌ JWT might be hardcoded"
  ERRORS=$((ERRORS + 1))
fi

# Check 10: No hardcoded API URLs (except localhost for dev)
echo ""
echo "🔟 Checking for hardcoded production URLs..."
if grep -r "https://.*\\.com\|api\\..*\\.com" backend/src backend/*.js 2>/dev/null | grep -v "localhost" | grep -v ".env.example" | grep -v "render"; then
  echo "   ⚠️  WARNING: Possible hardcoded production URLs found"
  WARNINGS=$((WARNINGS + 1))
else
  echo "   ✅ No hardcoded production URLs"
fi

# Summary
echo ""
echo "=========================================="
echo "📊 Summary:"
echo "   Errors: $ERRORS"
echo "   Warnings: $WARNINGS"

if [ $ERRORS -eq 0 ]; then
  echo ""
  echo "✅ Application appears ready for Render deployment!"
  echo ""
  echo "Next steps:"
  echo "1. Set up MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
  echo "2. Push code to GitHub"
  echo "3. Connect to Render: https://render.com"
  echo "4. Follow DEPLOYMENT.md for detailed instructions"
else
  echo ""
  echo "❌ Please fix the errors above before deploying"
  exit 1
fi
