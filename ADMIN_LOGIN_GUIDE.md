# 🔐 How to Login to Admin Dashboard

## ❌ Why "Invalid Credentials" Error?

The admin user doesn't exist yet! You need to create it first.

---

## ✅ SOLUTION - 3 Methods (Choose ONE)

---

## 🎯 **METHOD 1: Create New Admin User (Recommended)**

### Step 1: Run the Admin Creation Script

```powershell
cd e:\village-skill-portal
node create-admin.js
```

**OR double-click:** `setup-admin.bat`

### Step 2: Wait for Success Message

You should see:
```
✅ Connected to MongoDB
✅ Admin user created successfully!

==================================================
📧 ADMIN LOGIN CREDENTIALS:
==================================================
Email:    admin@village.com
Password: Admin@123
==================================================
```

### Step 3: Login

1. Go to: http://localhost:3000
2. Click "Login"
3. Enter:
   - **Email:** `admin@village.com`
   - **Password:** `Admin@123`
4. Click "Login"
5. ✅ You should see purple "Admin" link!

---

## 🎯 **METHOD 2: Make Your Existing User Admin (If you already registered)**

### Option A: Using PowerShell Script

```powershell
cd e:\village-skill-portal
powershell -ExecutionPolicy Bypass -File make-user-admin.ps1
```

It will ask for your email, then make that user admin!

### Option B: Using MongoDB Shell Manually

1. **Open MongoDB Shell:**
```powershell
mongosh
```

2. **Switch to your database:**
```javascript
use village_skill_portal
```

3. **Find all users (to see emails):**
```javascript
db.users.find({}, {name: 1, email: 1, isAdmin: 1}).pretty()
```

4. **Make a user admin (replace with your email):**
```javascript
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { isAdmin: true } }
)
```

5. **Verify it worked:**
```javascript
db.users.findOne({ email: "youremail@example.com" })
```

Should show: `isAdmin: true`

6. **Exit MongoDB:**
```javascript
exit
```

7. **Now login with YOUR email and password!**

---

## 🎯 **METHOD 3: Using MongoDB Compass (GUI - Easiest)**

### Step 1: Download MongoDB Compass
- Website: https://www.mongodb.com/try/download/compass
- Install it

### Step 2: Connect
- Open MongoDB Compass
- Connection string: `mongodb://localhost:27017`
- Click "Connect"

### Step 3: Navigate to Users
1. Click on database: `village_skill_portal`
2. Click on collection: `users`
3. You'll see all registered users

### Step 4: Make User Admin
1. Find your user (by email)
2. Click the pencil icon (✏️ Edit)
3. Find the `isAdmin` field
4. Change it to: `true`
5. If `isAdmin` doesn't exist, add it:
   ```json
   "isAdmin": true
   ```
6. Click "Update"

### Step 5: Login
- Use YOUR email and password
- You're now admin!

---

## 🚨 **IMPORTANT: Common Mistakes**

### ❌ Mistake 1: Using admin@village.com without creating it
**Solution:** Run `node create-admin.js` first!

### ❌ Mistake 2: Wrong password
**Default password for admin@village.com is:** `Admin@123`
**Capital A, @ symbol, numbers!**

### ❌ Mistake 3: Not restarting after creating admin
**Solution:** 
1. Stop backend server (Ctrl+C)
2. Restart: `npm start`
3. Refresh browser
4. Try logging in again

### ❌ Mistake 4: Backend server not running
**Solution:**
```powershell
cd e:\village-skill-portal
npm start
```
Should show: `Server running on http://localhost:5000`

### ❌ Mistake 5: MongoDB not running
**Solution:**
- Open MongoDB Compass
- Or run: `net start MongoDB` (Windows)
- Or start MongoDB service

---

## 📋 **Complete Login Process**

### For NEW admin user (admin@village.com):

1. ✅ Create admin user:
   ```powershell
   cd e:\village-skill-portal
   node create-admin.js
   ```

2. ✅ Make sure backend running:
   ```powershell
   npm start
   ```

3. ✅ Make sure frontend running:
   ```powershell
   cd frontend
   npm start
   ```

4. ✅ Open browser: http://localhost:3000

5. ✅ Click "Login"

6. ✅ Enter credentials:
   - Email: `admin@village.com`
   - Password: `Admin@123` (exactly like this!)

7. ✅ Click "Login" button

8. ✅ Look for purple "Admin" link in navigation menu

9. ✅ Click "Admin" to access dashboard!

---

## 🔍 **Troubleshooting Invalid Credentials**

### Check 1: Is MongoDB running?
```powershell
mongosh
```
If it connects, MongoDB is running. Type `exit` to quit.

### Check 2: Does the admin user exist?
```powershell
mongosh
use village_skill_portal
db.users.findOne({ email: "admin@village.com" })
```
Should return a user object. If null, user doesn't exist - create it!

### Check 3: Is password correct?
Default: `Admin@123`
- Capital 'A'
- @ symbol (not 'a')
- Numbers '123'

### Check 4: Check backend logs
Look at terminal where backend is running. Should show:
```
MongoDB Connected: ...
```

### Check 5: Clear browser cache
1. Press Ctrl+Shift+Delete
2. Clear cookies and cache
3. Try again

### Check 6: Try in Incognito Mode
- Chrome: Ctrl+Shift+N
- Firefox: Ctrl+Shift+P
- Try logging in there

---

## 🎯 **Quick Fix - Just Run This**

Open PowerShell and paste:

```powershell
# Navigate to project
cd e:\village-skill-portal

# Create admin user
Write-Host "Creating admin user..." -ForegroundColor Cyan
node create-admin.js

# Instructions
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Admin user created!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Login with:" -ForegroundColor Yellow
Write-Host "Email: admin@village.com" -ForegroundColor Cyan
Write-Host "Password: Admin@123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to: http://localhost:3000" -ForegroundColor Magenta
```

---

## ✅ **After Successful Login**

You should see:
1. ✅ Welcome message with your name
2. ✅ Purple "Admin" link in navigation menu (top right area)
3. ✅ Click "Admin" → Admin Dashboard opens
4. ✅ See tabs: Overview, Users, Jobs
5. ✅ See statistics: Total Users, Active Users, Jobs, Resources

---

## 🔐 **Security Note**

**Change the default password immediately after first login!**

1. Click "Profile"
2. Update password
3. Save changes

---

## 📞 **Still Not Working?**

### Share these details for help:

1. **Run this in MongoDB Shell:**
```javascript
use village_skill_portal
db.users.find({ email: "admin@village.com" }, { email: 1, isAdmin: 1, _id: 0 })
```

2. **Check backend terminal output** (any errors?)

3. **Check browser console** (F12 → Console tab, any errors?)

4. **Try registering a new regular user first:**
   - Register with any email
   - Then make that user admin using Method 2 or 3

---

## 🎉 **Summary**

**Fastest way to get admin access:**

1. Run: `node create-admin.js`
2. Login with: `admin@village.com` / `Admin@123`
3. Done! ✅

**Can't remember if you ran the script?**
Run it again - it won't break anything!

---

**Last Updated:** January 2025  
**Status:** Complete guide for all scenarios
