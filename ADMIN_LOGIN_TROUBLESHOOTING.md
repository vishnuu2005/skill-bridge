# 🔧 ADMIN LOGIN - COMPLETE TROUBLESHOOTING

## Current Status:
- ✅ Admin user exists in database
- ✅ Password hash is correct in database
- ✅ isAdmin is set to true
- ✅ Backend server is running
- ❌ Login still failing with "Invalid credentials"

---

## 🎯 SOLUTIONS TO TRY (In Order)

### SOLUTION 1: Restart Backend Server (Most Common Fix)

The backend might have cached old data. Restart it:

```powershell
# 1. Stop the backend (press Ctrl+C in the terminal running npm start)
# 2. Start it again:
cd e:\village-skill-portal
npm start
```

**Then test login again!**

---

### SOLUTION 2: Check bcryptjs vs bcrypt

The password might have been hashed with a different library version.

#### Run this fix script:

```powershell
cd e:\village-skill-portal
node -e "const mongoose = require('mongoose'); const bcrypt = require('bcryptjs'); mongoose.connect('mongodb://localhost:27017/village_skill_portal').then(async () => { const User = mongoose.model('User', new mongoose.Schema({}, {strict: false})); const salt = await bcrypt.genSalt(10); const hashedPassword = await bcrypt.hash('Admin@123', salt); await User.updateOne({email: 'admin@village.com'}, {password: hashedPassword}); console.log('✅ Password reset successfully!'); process.exit(0); });"
```

---

### SOLUTION 3: Clear Browser Cache & Try Fresh

```
1. Press Ctrl+Shift+Delete
2. Clear all browsing data
3. Close browser completely
4. Open browser again
5. Go to http://localhost:3000
6. Try logging in
```

---

### SOLUTION 4: Use Test Scripts I Created

#### Test if password is correct:
```powershell
cd e:\village-skill-portal
node test-admin-password.js
```

#### Test if login API works:
```powershell
cd e:\village-skill-portal
node test-login-simple.js
```

---

### SOLUTION 5: Check Backend Logs

I added debug logging to the backend. Check the terminal where backend is running.

When you try to login, you should see:
```
Login attempt: { email: 'admin@village.com', passwordLength: 9 }
User found: { email: 'admin@village.com', hasPassword: true }
Password match: true
```

**If you see:**
- `User not found` → Admin user doesn't exist, run create-admin.js again
- `Password match: false` → Password hash is wrong, run SOLUTION 2
- No logs at all → Backend not running or wrong URL

---

### SOLUTION 6: Check Frontend API URL

Open browser console (F12) and check what URL it's calling.

#### Fix frontend API URL:

Check `frontend/src/context/AuthContext.js`:

```javascript
axios.defaults.baseURL = 'http://localhost:5000';
```

Should point to your backend!

---

### SOLUTION 7: Create Fresh Admin with Different Password

Let's try a simpler password first:

```powershell
cd e:\village-skill-portal
node -e "const mongoose = require('mongoose'); const bcrypt = require('bcryptjs'); mongoose.connect('mongodb://localhost:27017/village_skill_portal').then(async () => { const User = mongoose.model('User', new mongoose.Schema({}, {strict: false})); const salt = await bcrypt.genSalt(10); const hashedPassword = await bcrypt.hash('admin123', salt); await User.updateOne({email: 'admin@village.com'}, {password: hashedPassword, isAdmin: true, isActive: true}); console.log('✅ Password set to: admin123'); process.exit(0); });"
```

**Then try login with:**
- Email: admin@village.com
- Password: admin123 (all lowercase, simple)

---

### SOLUTION 8: Check for Hidden Characters

Sometimes copy-paste adds hidden characters.

**TYPE the password manually, don't copy-paste:**
- Type: `Admin@123`
- Character by character: A-d-m-i-n-@-1-2-3

---

### SOLUTION 9: Use Regular User Account as Admin

Instead of fighting with admin@village.com, make YOUR account admin:

```powershell
cd e:\village-skill-portal

# Replace YOUR_EMAIL with your actual email
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/village_skill_portal').then(async () => { const User = mongoose.model('User', new mongoose.Schema({}, {strict: false})); await User.updateOne({email: 'YOUR_EMAIL'}, {isAdmin: true}); console.log('✅ Your account is now admin!'); process.exit(0); });"
```

Then login with YOUR email and password!

---

### SOLUTION 10: Complete Fresh Start

Delete admin user and create again:

```powershell
cd e:\village-skill-portal

# Delete old admin
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/village_skill_portal').then(async () => { const User = mongoose.model('User', new mongoose.Schema({}, {strict: false})); await User.deleteOne({email: 'admin@village.com'}); console.log('✅ Old admin deleted'); process.exit(0); });"

# Create fresh admin
node create-admin.js

# Restart backend
# Stop with Ctrl+C, then:
npm start
```

---

## 🔍 Diagnostic Checklist

Run these to diagnose the issue:

```powershell
# 1. Check if backend is running
curl http://localhost:5000

# 2. Check if admin user exists
node test-admin-password.js

# 3. Test login API directly
node test-login-simple.js

# 4. Check MongoDB connection
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/village_skill_portal').then(() => console.log('✅ MongoDB connected')).catch(err => console.log('❌ Error:', err));"
```

---

## 📋 Quick Fix Commands

### Reset Admin Password to Simple One:
```powershell
cd e:\village-skill-portal
node -e "const mongoose = require('mongoose'); const bcrypt = require('bcryptjs'); mongoose.connect('mongodb://localhost:27017/village_skill_portal').then(async () => { const User = mongoose.model('User', new mongoose.Schema({}, {strict: false})); const salt = await bcrypt.genSalt(10); const hash = await bcrypt.hash('admin123', salt); await User.updateOne({email: 'admin@village.com'}, {password: hash}); console.log('Password set to: admin123'); process.exit(0); });"
```

### Make Any User Admin:
```powershell
cd e:\village-skill-portal
# Replace YOUR_EMAIL with your email
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/village_skill_portal').then(async () => { const User = mongoose.model('User', new mongoose.Schema({}, {strict: false})); const result = await User.updateOne({email: 'YOUR_EMAIL'}, {isAdmin: true}); console.log('Updated:', result.modifiedCount, 'user'); process.exit(0); });"
```

---

## 🎯 Most Likely Fix

Based on testing, the password IS correct in the database, so the issue is likely:

1. **Backend not restarted** after creating admin
2. **Typo when typing password** (type slowly!)
3. **Browser cache** showing old error

**Try this NOW:**
1. Stop backend (Ctrl+C)
2. Start backend (`npm start`)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Type password SLOWLY: A-d-m-i-n-@-1-2-3
5. Click Login

---

## 📞 Still Not Working?

Check the backend terminal logs when you try to login. You should see:
```
Login attempt: { email: 'admin@village.com', passwordLength: 9 }
User found: { email: 'admin@village.com', hasPassword: true }
Password match: [true/false]
```

Share what you see in the logs!

---

**Created:** January 2025  
**Test Scripts:** test-admin-password.js, test-login-simple.js
