# 🚀 SkillBridge Deployment Guide

## Quick Deployment Steps

### Step 1: Deploy Backend on Render (Free)

1. **Go to Render**: https://render.com
2. **Sign up/Login** with GitHub
3. **Click "New +"** → **"Web Service"**
4. **Connect your repository**: `vishnuu2005/skill-bridge`
5. **Configure**:
   - Name: `skillbridge-backend`
   - Root Directory: Leave empty
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free**

6. **Add Environment Variables** (in Render dashboard):
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your_mongodb_atlas_uri>
   JWT_SECRET=<auto_generated_or_random_string>
   FRONTEND_URL=<will_add_after_frontend_deploy>
   ```

7. **Click "Create Web Service"** - Wait 5-10 minutes for deployment
8. **Copy your backend URL**: `https://skillbridge-backend.onrender.com`

### Step 2: Setup MongoDB Atlas (Free)

1. **Go to**: https://www.mongodb.com/cloud/atlas
2. **Sign up** for free account
3. **Create a free cluster** (M0 Free tier)
4. **Create Database User**:
   - Username: `skillbridge`
   - Password: (generate strong password)
5. **Setup Network Access**:
   - Click "Network Access"
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
6. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Add database name: `skillbridge`
   - Example: `mongodb+srv://skillbridge:PASSWORD@cluster0.xxxxx.mongodb.net/skillbridge?retryWrites=true&w=majority`
7. **Add to Render**: Update `MONGODB_URI` in Render environment variables

### Step 3: Deploy Frontend on Vercel (Free)

1. **Install Vercel CLI**:
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```powershell
   vercel login
   ```

3. **Deploy**:
   ```powershell
   cd "e:\skill bridge"
   vercel --prod
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? (Select your account)
   - Link to existing project? **N**
   - Project name: `skillbridge`
   - In which directory is your code? `./frontend`
   - Override settings? **Y**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Development Command: `npm start`

5. **Your frontend URL**: `https://skillbridge.vercel.app` (or similar)

### Step 4: Update CORS Settings

1. **Go back to Render dashboard**
2. **Update Environment Variables**:
   - Set `FRONTEND_URL` to your Vercel URL (e.g., `https://skillbridge.vercel.app`)
3. **Redeploy** the backend (will happen automatically)

### Step 5: Update Frontend API URL

1. **Update** `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://skillbridge-backend.onrender.com
   ```

2. **Redeploy frontend**:
   ```powershell
   cd "e:\skill bridge"
   vercel --prod
   ```

## 🎉 Your Live URLs

- **Frontend**: https://skillbridge.vercel.app
- **Backend API**: https://skillbridge-backend.onrender.com
- **GitHub Repo**: https://github.com/vishnuu2005/skill-bridge

## 📝 Important Notes

- **Free tier limitations**:
  - Render: Backend sleeps after 15 min of inactivity (first request takes ~30 seconds to wake up)
  - MongoDB Atlas: 512 MB storage limit
  - Vercel: Unlimited bandwidth for personal projects

- **First deployment takes 5-10 minutes**
- **Backend will be slow on first load** (free tier spins down)

## 🔧 Troubleshooting

If deployment fails:
1. Check Render logs for errors
2. Verify MongoDB connection string
3. Ensure all environment variables are set
4. Check that PORT is set to 5000

## 🔐 Security Checklist

- ✅ Never commit `.env` files
- ✅ Use strong JWT_SECRET
- ✅ Use strong MongoDB password
- ✅ Restrict MongoDB network access in production (optional)
