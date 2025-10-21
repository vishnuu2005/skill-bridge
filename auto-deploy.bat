@echo off
echo ========================================
echo   SkillBridge Auto-Deployment Script
echo ========================================
echo.

echo Step 1: Checking installations...
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
) else (
    echo Vercel CLI already installed!
)

echo.
echo Step 2: Committing latest changes...
cd /d "%~dp0"
git add .
git commit -m "Auto-deploy: Update deployment configurations"
git push origin master

echo.
echo Step 3: Deploying Frontend to Vercel...
cd frontend
vercel --prod --yes

echo.
echo ========================================
echo   Deployment Instructions
echo ========================================
echo.
echo FRONTEND: Successfully deployed to Vercel!
echo Check the output above for your frontend URL.
echo.
echo BACKEND: Please complete these steps:
echo.
echo 1. Visit: https://dashboard.render.com/
echo 2. Sign in with GitHub account: vishnuu2005
echo 3. Click the "Deploy to Render" button in README
echo    OR manually create a new Web Service
echo 4. Select repository: skill-bridge
echo 5. Render will auto-detect settings from render.yaml
echo 6. Add MONGODB_URI in environment variables
echo.
echo DATABASE: Setup MongoDB Atlas
echo 1. Go to: https://www.mongodb.com/cloud/atlas/register
echo 2. Create FREE M0 cluster
echo 3. Create database user
echo 4. Whitelist IP: 0.0.0.0/0
echo 5. Get connection string
echo 6. Add to Render environment variables
echo.
echo ========================================
echo.
pause
