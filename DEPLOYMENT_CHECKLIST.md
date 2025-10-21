# 📋 Deployment Checklist

## Before You Start
- [ ] Read `COMPLETE_DEPLOYMENT_GUIDE.md` (full detailed guide)
- [ ] Have your email ready for GitHub account
- [ ] Set aside 30-45 minutes

---

## Part 1: GitHub Setup (15 minutes)

### Install Git
- [ ] Download Git from https://git-scm.com/download/win
- [ ] Install with default settings
- [ ] Restart VS Code/Terminal
- [ ] Test: Run `git --version` in terminal

### Create GitHub Account
- [ ] Go to https://github.com/signup
- [ ] Create account with your email
- [ ] Verify email address
- [ ] Login to GitHub

### Create Personal Access Token
- [ ] Go to: Settings → Developer settings → Personal access tokens
- [ ] Click "Generate new token (classic)"
- [ ] Name: "Village Skill Portal"
- [ ] Check: **repo** (all repo permissions)
- [ ] Generate and **COPY the token** (save it!)
- [ ] Token looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Push Code to GitHub
- [ ] Open PowerShell in VS Code
- [ ] Run: `git config --global user.name "Your Name"`
- [ ] Run: `git config --global user.email "your@email.com"`
- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit"`
- [ ] Create repository on GitHub (https://github.com/new)
  - Name: `village-skill-portal`
  - Public or Private (your choice)
  - Don't check any boxes
  - Click "Create repository"
- [ ] Run: `git remote add origin https://github.com/YOUR_USERNAME/village-skill-portal.git`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`
  - Username: your GitHub username
  - Password: paste your token (NOT password!)
- [ ] ✅ Code is on GitHub!

---

## Part 2: MongoDB Atlas Setup (10 minutes)

### Create Database
- [ ] Go to https://www.mongodb.com/cloud/atlas/register
- [ ] Sign up (free)
- [ ] Create **FREE** cluster (M0 Sandbox)
  - Provider: AWS
  - Region: closest to you
- [ ] Wait 3-5 minutes for cluster to create

### Configure Database
- [ ] Click "Database Access"
- [ ] Add Database User:
  - Username: `admin`
  - Password: **Autogenerate** (copy it!)
- [ ] Click "Network Access"
- [ ] Add IP Address: `0.0.0.0/0` (Allow from anywhere)

### Get Connection String
- [ ] Click "Connect" on your cluster
- [ ] Choose "Connect your application"
- [ ] Copy connection string
- [ ] Replace `<password>` with your database password
- [ ] Add `/village-skill-portal` at the end
- [ ] Final format: `mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/village-skill-portal?retryWrites=true&w=majority`
- [ ] Save this string!

---

## Part 3: Deploy Backend on Render (10 minutes)

### Create Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub (easiest)
- [ ] Authorize Render

### Deploy Backend
- [ ] Click "New +" → "Web Service"
- [ ] Select your `village-skill-portal` repository
- [ ] Configure:
  - Name: `village-skill-portal-backend`
  - Root Directory: `backend`
  - Runtime: Node
  - Build: `npm install`
  - Start: `node server.js`
  - Instance Type: **Free**
- [ ] Add Environment Variables:
  ```
  PORT = 5000
  NODE_ENV = production
  MONGODB_URI = [paste your MongoDB connection string]
  JWT_SECRET = my_super_secret_key_12345
  ```
- [ ] Click "Create Web Service"
- [ ] Wait 5 minutes for deployment
- [ ] Copy backend URL: `https://village-skill-portal-backend.onrender.com`
- [ ] Test: Visit URL + `/api` (should show message)

### Create Admin User
- [ ] In Render dashboard, click your service
- [ ] Go to "Shell" tab
- [ ] Run: `node ../create-admin.js`
- [ ] Wait for success message
- [ ] Admin created! (admin@village.com / Admin@123)

---

## Part 4: Deploy Frontend on Vercel (10 minutes)

### Update Frontend
- [ ] Edit `frontend/.env.production`
- [ ] Set: `REACT_APP_API_URL=https://YOUR-BACKEND-URL.onrender.com`
- [ ] Save file
- [ ] In terminal: 
  ```
  git add .
  git commit -m "Add production API URL"
  git push origin main
  ```

### Deploy to Vercel
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub
- [ ] Click "Add New" → "Project"
- [ ] Import `village-skill-portal`
- [ ] Configure:
  - Framework: Create React App
  - Root Directory: `frontend`
  - Build: `npm run build`
  - Output: `build`
- [ ] Add Environment Variable:
  ```
  REACT_APP_API_URL = https://YOUR-BACKEND-URL.onrender.com
  ```
- [ ] Click "Deploy"
- [ ] Wait 3 minutes
- [ ] ✅ Your app is LIVE!
- [ ] Copy URL: `https://village-skill-portal.vercel.app`

---

## Part 5: Final Steps (5 minutes)

### Update CORS
- [ ] Go to your GitHub repository
- [ ] Edit `backend/server.js`
- [ ] Find CORS section and update:
  ```javascript
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://village-skill-portal.vercel.app',
      'https://*.vercel.app'
    ],
    credentials: true
  }));
  ```
- [ ] Commit changes (Render auto-deploys)
- [ ] Wait 2 minutes for Render to redeploy

### Test Everything
- [ ] Visit your Vercel URL
- [ ] Register a test user
- [ ] Create a test job
- [ ] Login as admin: `/admin`
  - Email: admin@village.com
  - Password: Admin@123
- [ ] Test admin features (delete user, job, etc.)
- [ ] Test chat feature
- [ ] Test save job feature
- [ ] ✅ Everything works!

---

## 🎉 SUCCESS! Your App is Live!

### Your URLs:
- **Main App**: `https://village-skill-portal.vercel.app`
- **Admin Panel**: `https://village-skill-portal.vercel.app/admin`
- **Backend API**: `https://village-skill-portal-backend.onrender.com`

### Share with Others:
Send them: `https://village-skill-portal.vercel.app`

### Admin Access:
- Email: `admin@village.com`
- Password: `Admin@123`
- **⚠️ Change password after first login!**

---

## 📞 If Something Goes Wrong

### Git not recognized
- Install Git from https://git-scm.com/download/win
- Restart terminal

### Can't push to GitHub
- Make sure you're using Personal Access Token, not password
- Token starts with `ghp_`

### Backend not deploying
- Check Render logs for errors
- Verify MongoDB connection string is correct

### Frontend can't connect
- Check REACT_APP_API_URL is correct
- Make sure backend is running (green in Render)
- Check CORS settings in backend

### Admin login fails
- Make sure you ran `create-admin.js` in Render shell
- Try creating admin again

---

## 💡 Tips

- **First load is slow**: Render free tier sleeps after 15 min inactivity
- **Save your tokens**: Store Personal Access Token safely
- **Monitor logs**: Check Render logs if something breaks
- **Update code**: `git add . && git commit -m "message" && git push`

---

## ✅ You're Done!

Total time: ~45 minutes
Cost: **FREE**

Your Village Skill Portal is now accessible to anyone in the world! 🌍🎉

Need help? Check COMPLETE_DEPLOYMENT_GUIDE.md for detailed explanations.
