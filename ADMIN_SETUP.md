# 👨‍💼 How to Create and Login as Admin

## 🔐 Creating an Admin User

Admin privileges are set at the database level. You need to manually update a user in MongoDB to make them an admin.

---

## Method 1: Using MongoDB Compass (Recommended - Easy)

### Step 1: Install MongoDB Compass
- Download from: https://www.mongodb.com/try/download/compass
- Install and open it

### Step 2: Connect to Your Database
- Connection String: `mongodb://localhost:27017`
- Click "Connect"

### Step 3: Find Your Database
- Look for database named: `village_skill_portal` or similar
- Click on it

### Step 4: Find the Users Collection
- Click on `users` collection
- You'll see all registered users

### Step 5: Make a User Admin
1. Find the user you want to make admin
2. Click the pencil icon (Edit) next to that user
3. Add a new field or modify existing:
   ```json
   {
     "isAdmin": true
   }
   ```
4. Click "Update"

### Step 6: Login
- Go to your website
- Login with that user's email and password
- You'll now see "Admin" link in the navigation menu

---

## Method 2: Using MongoDB Shell (Command Line)

### Step 1: Open MongoDB Shell
```powershell
mongosh
```

### Step 2: Switch to Your Database
```javascript
use village_skill_portal
```

### Step 3: Check Existing Users
```javascript
db.users.find().pretty()
```

### Step 4: Make a User Admin by Email
```javascript
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { isAdmin: true } }
)
```

**Replace `youremail@example.com` with the actual email!**

### Step 5: Verify It Worked
```javascript
db.users.findOne({ email: "youremail@example.com" })
```

Should show `isAdmin: true`

---

## Method 3: Create New Admin User via Registration

### Step 1: Register a New User
1. Go to your website: http://localhost:3000
2. Click "Register"
3. Fill in the form:
   - Name: Admin User
   - Email: admin@village.com
   - Password: Admin@123
   - Village: Select any
   - Phone: Any number

### Step 2: Make Them Admin in Database
Use Method 1 or Method 2 above to set `isAdmin: true` for this new user.

### Step 3: Login
- Logout (if logged in)
- Login with admin@village.com and Admin@123
- You'll see the Admin link!

---

## 🎯 Quick Script to Create Admin User

Save this as `create-admin.js` in your project root:

```javascript
// create-admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/village_skill_portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  village: String,
  phone: String,
  isAdmin: Boolean,
  skills: Array,
  savedJobs: Array,
  isActive: { type: Boolean, default: true },
  timestamps: true
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@village.com' });
    
    if (existingAdmin) {
      // Update existing user to admin
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log('✅ Existing user updated to admin!');
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@village.com',
        password: hashedPassword,
        village: 'Admin Village',
        phone: '1234567890',
        isAdmin: true,
        skills: [],
        savedJobs: [],
        isActive: true
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('\n📧 Admin Login Credentials:');
    console.log('Email: admin@village.com');
    console.log('Password: Admin@123');
    console.log('\n🎉 You can now login as admin!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
  }
}

createAdmin();
```

### Run it:
```powershell
cd e:\village-skill-portal
node create-admin.js
```

---

## 🔍 Verify Admin Status After Login

### Method 1: Check Browser Console
1. Login to the website
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Type: `JSON.parse(localStorage.getItem('user'))`
5. Should show `isAdmin: true`

### Method 2: Check Navigation
- If you're admin, you'll see a purple "Admin" link in the navigation menu

### Method 3: Try Accessing Admin Page
- Go to: http://localhost:3000/admin
- If you're admin, you'll see the dashboard
- If not, you'll be redirected or see "Access Denied"

---

## 🎯 Summary - Quickest Way

1. **Register any user on the website**
2. **Open MongoDB Compass**
3. **Find that user in the `users` collection**
4. **Add field: `isAdmin: true`**
5. **Logout and login again**
6. **See Admin link in menu!**

---

**Default Admin Credentials (if using script):**
- Email: `admin@village.com`
- Password: `Admin@123`

**Change these immediately after first login!**
