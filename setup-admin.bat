@echo off
echo ========================================
echo Creating Admin User for Village Skill Portal
echo ========================================
echo.

echo This will create an admin user with:
echo Email: admin@village.com
echo Password: Admin@123
echo.
pause

cd /d e:\village-skill-portal

echo Running admin creation script...
echo.

node create-admin.js

echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo 1. Make sure backend server is running
echo 2. Go to: http://localhost:3000
echo 3. Click "Login"
echo 4. Enter email: admin@village.com
echo 5. Enter password: Admin@123
echo 6. You should see "Admin" link in the menu!
echo.
pause
