@echo off
echo ========================================
echo Admin Password Reset Tool
echo ========================================
echo.
echo This will reset the admin password to a simple one.
echo.
pause

cd /d e:\village-skill-portal

echo Resetting password...
node -e "const mongoose = require('mongoose'); const bcrypt = require('bcryptjs'); mongoose.connect('mongodb://localhost:27017/village_skill_portal').then(async () => { const User = mongoose.model('User', new mongoose.Schema({}, {strict: false})); const salt = await bcrypt.genSalt(10); const hash = await bcrypt.hash('admin123', salt); await User.updateOne({email: 'admin@village.com'}, {$set: {password: hash, isAdmin: true, isActive: true}}); console.log('Password reset complete!'); process.exit(0); }).catch(err => { console.log('Error:', err.message); process.exit(1); });"

echo.
echo ========================================
echo Password Reset Complete!
echo ========================================
echo.
echo Login credentials:
echo Email: admin@village.com
echo Password: admin123
echo.
echo NOTE: All lowercase, no special characters
echo.
echo Now:
echo 1. Restart your backend server (Ctrl+C then npm start)
echo 2. Go to http://localhost:3000
echo 3. Login with the credentials above
echo.
pause
