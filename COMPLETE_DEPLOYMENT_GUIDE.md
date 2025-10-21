# 🚀 Complete GitHub & Deployment Guide

## Part 1: Install Git (Required First!)

### Download & Install Git:
1. Go to: https://git-scm.com/download/win
2. Download "64-bit Git for Windows Setup"
3. Run the installer
4. Use default settings (just keep clicking Next)
5. **Restart your terminal/VS Code** after installation

### Verify Git Installation:
```powershell
git --version
# Should show: git version 2.x.x
```

---

## Part 2: Create GitHub Account & Token

### A. Create GitHub Account (if you don't have one):
1. Go to: https://github.com/signup
2. Enter your email
3. Create password
4. Choose username
5. Verify email

### B. Create Personal Access Token (SAFER than password):
1. Login to GitHub
2. Click your profile picture (top right)
3. Go to: **Settings** → **Developer settings** (bottom left)
4. Click: **Personal access tokens** → **Tokens (classic)**
5. Click: **Generate new token** → **Generate new token (classic)**
6. Settings:
   - **Note**: "Village Skill Portal"
   - **Expiration**: 90 days (or No expiration)
   - **Select scopes**: Check **repo** (all)
7. Click: **Generate token**
8. **IMPORTANT**: Copy the token NOW (you won't see it again!)
   - Save it in a text file temporarily
   - Example: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Part 3: Push to GitHub

### Step 1: Initialize Git Repository
```powershell
cd e:\village-skill-portal
git init
```

### Step 2: Configure Git (First time only)
```powershell
# Replace with YOUR details
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Add All Files
```powershell
git add .
```

### Step 4: Create First Commit
```powershell
git commit -m "Initial commit: Village Skill Portal with admin features"
```

### Step 5: Create GitHub Repository
1. Go to: https://github.com/new
2. **Repository name**: `village-skill-portal`
3. **Description**: "Community platform connecting skilled professionals"
4. **Visibility**: 
   - ✅ Public (anyone can see)
   - ⭕ Private (only you can see)
5. **DO NOT** check any boxes (README, .gitignore, license)
6. Click: **Create repository**

### Step 6: Connect to GitHub
```powershell
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/village-skill-portal.git
git branch -M main
```

### Step 7: Push to GitHub
```powershell
git push -u origin main
```

**When prompted for credentials:**
- **Username**: Your GitHub username
- **Password**: Paste your Personal Access Token (NOT your password!)

**Success!** Your code is now on GitHub! 🎉

---

## Part 4: Deploy to Render (Free Hosting)

### A. Deploy Backend

#### Step 1: Sign Up for Render
1. Go to: https://render.com
2. Click: **Get Started**
3. Sign up with GitHub (easiest way)
4. Authorize Render to access your repositories

#### Step 2: Create MongoDB Atlas (Free Database)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free tier)
3. Create a **FREE** cluster:
   - Provider: AWS
   - Region: Choose closest to you
   - Cluster Tier: M0 Sandbox (FREE)
4. Create Database User:
   - Username: `admin`
   - Password: Click "Autogenerate Secure Password" (copy it!)
5. Network Access:
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm
6. Get Connection String:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Example: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your database password
   - Add database name at the end: `village-skill-portal`
   - Final: `mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/village-skill-portal?retryWrites=true&w=majority`

#### Step 3: Create Backend Web Service on Render
1. In Render Dashboard, click: **New +** → **Web Service**
2. Connect your GitHub repository: `village-skill-portal`
3. Configure:
   - **Name**: `village-skill-portal-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

4. **Environment Variables** (Click "Advanced"):
   ```
   PORT = 5000
   NODE_ENV = production
   MONGODB_URI = mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/village-skill-portal?retryWrites=true&w=majority
   JWT_SECRET = your_super_secret_random_string_here_12345
   ```

5. Click: **Create Web Service**
6. Wait 2-5 minutes for deployment
7. **Copy your backend URL**: `https://village-skill-portal-backend.onrender.com`

#### Step 4: Create Admin User in Production
1. In Render dashboard, go to your backend service
2. Click: **Shell** tab
3. Run:
   ```bash
   node ../create-admin.js
   ```
4. Admin user created with credentials:
   - Email: `admin@village.com`
   - Password: `Admin@123`

---

### B. Deploy Frontend

#### Step 1: Update Frontend API URL
Before deploying, we need to update the frontend to use the production backend URL.

**Option A: Using Environment Variable (Better)**
1. Create file: `frontend/.env.production`
2. Add:
   ```
   REACT_APP_API_URL=https://village-skill-portal-backend.onrender.com
   ```

**Option B: Update Code Directly**
Update each component that uses `API_URL` to:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://village-skill-portal-backend.onrender.com';
```

#### Step 2: Push Updated Code
```powershell
cd e:\village-skill-portal
git add .
git commit -m "Update API URL for production"
git push origin main
```

#### Step 3: Deploy to Vercel (Free)
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Click: **Add New** → **Project**
4. Import your repository: `village-skill-portal`
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. **Environment Variables**:
   ```
   REACT_APP_API_URL = https://village-skill-portal-backend.onrender.com
   ```
7. Click: **Deploy**
8. Wait 2-3 minutes
9. **Your app is LIVE!** 🎉
   - URL: `https://village-skill-portal.vercel.app`

---

## Part 5: Update Backend CORS

After deploying frontend, update backend to allow your frontend domain:

1. Edit `backend/server.js` on GitHub or locally
2. Update CORS configuration:
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://village-skill-portal.vercel.app',  // Your Vercel URL
       'https://*.vercel.app'  // All Vercel preview URLs
     ],
     credentials: true
   }));
   ```
3. Commit and push:
   ```powershell
   git add backend/server.js
   git commit -m "Update CORS for production"
   git push origin main
   ```
4. Render will automatically redeploy

---

## 🎉 Your App is LIVE!

### Access URLs:
- **Frontend (Users)**: `https://village-skill-portal.vercel.app`
- **Admin Dashboard**: `https://village-skill-portal.vercel.app/admin`
- **Backend API**: `https://village-skill-portal-backend.onrender.com`

### Admin Login:
- Email: `admin@village.com`
- Password: `Admin@123`

### Share with Others:
Send them: `https://village-skill-portal.vercel.app`

---

## 📝 Important Notes

### Free Tier Limitations:
1. **Render Free Plan**:
   - Backend sleeps after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds to wake up
   - 750 hours/month free

2. **Vercel Free Plan**:
   - Unlimited bandwidth
   - Automatic HTTPS
   - Global CDN

3. **MongoDB Atlas Free**:
   - 512 MB storage
   - Shared resources
   - Enough for thousands of users

### Upgrading to Paid Plans:
- **Render**: $7/month (always on)
- **Vercel**: $20/month (team features)
- **MongoDB Atlas**: $9/month (2GB storage)

---

## 🔧 Troubleshooting

### Issue: Backend not connecting to MongoDB
**Solution**: Double-check MONGODB_URI format and password

### Issue: Frontend can't reach backend
**Solution**: Verify API_URL in frontend environment variables

### Issue: Admin login not working
**Solution**: Run create-admin.js in Render shell

### Issue: CORS errors
**Solution**: Add your Vercel URL to CORS whitelist in backend

---

## 🚀 Quick Commands Reference

```powershell
# Check if Git is installed
git --version

# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# Check status
git status
```

---

## 📞 Next Steps

After deployment:
1. ✅ Test all features on live site
2. ✅ Change admin password
3. ✅ Share link with users
4. ✅ Monitor Render logs for errors
5. ✅ Set up custom domain (optional)

---

## 🎯 Alternative Deployment Options

### Option 1: Netlify (instead of Vercel)
- Similar to Vercel
- Free tier available
- Great for React apps

### Option 2: Railway (instead of Render)
- $5 free credit monthly
- Faster than Render free tier
- No sleep time

### Option 3: Heroku (paid)
- $7/month minimum
- Very reliable
- Good documentation

---

**Need help? Follow each step carefully and let me know where you get stuck!** 🚀
