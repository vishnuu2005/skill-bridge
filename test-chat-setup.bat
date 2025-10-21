@echo off
echo ========================================
echo Village Skill Portal - Chat Test
echo ========================================
echo.

echo Step 1: Checking if Node.js is installed...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)
echo OK: Node.js found!
echo.

echo Step 2: Checking backend dependencies...
cd /d e:\village-skill-portal\backend
if not exist node_modules (
    echo WARNING: node_modules not found. Running npm install...
    call npm install
) else (
    echo OK: node_modules found!
)
echo.

echo Step 3: Checking if socket.io is installed...
npm list socket.io >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: socket.io not found. Installing...
    call npm install socket.io
) else (
    echo OK: socket.io installed!
)
echo.

echo Step 4: Checking frontend dependencies...
cd /d e:\village-skill-portal\frontend
if not exist node_modules (
    echo WARNING: node_modules not found. Running npm install...
    call npm install
) else (
    echo OK: node_modules found!
)
echo.

echo Step 5: Checking if socket.io-client is installed...
npm list socket.io-client >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: socket.io-client not found. Installing...
    call npm install socket.io-client
) else (
    echo OK: socket.io-client installed!
)
echo.

echo ========================================
echo All checks complete!
echo ========================================
echo.
echo To start the servers:
echo 1. Open a new terminal and run: cd e:\village-skill-portal\backend ^&^& node server.js
echo 2. Open another terminal and run: cd e:\village-skill-portal\frontend ^&^& npm start
echo.
echo Then test the chat feature in your browser!
echo.
pause
