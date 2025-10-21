# GitHub Deployment Guide

## Step 1: Initialize Git Repository

```bash
cd e:\village-skill-portal
git init
git add .
git commit -m "Initial commit: Village Skill Portal with chat, call, admin features"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `village-skill-portal`
3. DO NOT initialize with README (we already have one)
4. Click "Create repository"

## Step 3: Connect and Push to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/village-skill-portal.git
git branch -M main
git push -u origin main
```

## Step 4: Set Up Environment Variables

### For Local Development
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/village-skill-portal
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### For Production (Render/Heroku)
Set these in your hosting platform:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A secure random string
- `NODE_ENV` - Set to `production`

## Step 5: Deploy Backend (Render.com)

1. Sign up at https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: village-skill-portal-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Instance Type**: Free
5. Add Environment Variables (as listed above)
6. Click "Create Web Service"

## Step 6: Deploy Frontend (Vercel)

1. Sign up at https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variable:
   - `REACT_APP_API_URL` = Your Render backend URL
6. Click "Deploy"

## Step 7: Update Frontend API URLs

In `frontend/src`, update all axios calls to use the backend URL:

```javascript
// Before
axios.get('/api/users')

// After
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.get(`${API_URL}/api/users`)
```

## Step 8: Set Up MongoDB Atlas (Cloud Database)

1. Go to https://www.mongodb.com/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist IP: 0.0.0.0/0 (allow from anywhere)
5. Get connection string
6. Update `MONGODB_URI` in Render environment variables

## Step 9: Create Admin User on Production

SSH into your Render instance or use their shell:
```bash
node create-admin.js
```

Or create manually via MongoDB Atlas interface.

## Step 10: Test Your Deployment

1. Visit your Vercel frontend URL
2. Register a test user
3. Login as admin: `admin@village.com` / `Admin@123`
4. Test all features (chat, jobs, admin dashboard)

## 🔧 Important: Update CORS

In `backend/server.js`, update CORS to allow your frontend domain:

```javascript
const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}));
```

## 🎉 You're Live!

Your app is now deployed:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.onrender.com
- **Admin Panel**: https://your-app.vercel.app/admin

## 📝 Post-Deployment Checklist

- [ ] Change admin password
- [ ] Test all features
- [ ] Set up custom domain (optional)
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring
- [ ] Add analytics (optional)
- [ ] Update README with live URLs

## 🐛 Common Issues

### Issue: CORS Error
**Solution**: Add your frontend domain to CORS whitelist in backend

### Issue: MongoDB Connection Failed
**Solution**: Check MongoDB Atlas whitelist and connection string

### Issue: Admin Login Not Working
**Solution**: Ensure admin user exists in production database

### Issue: Socket.IO Not Connecting
**Solution**: Update Socket.IO connection URL in frontend to use production backend URL

## 💡 Pro Tips

1. Use environment variables for all sensitive data
2. Enable MongoDB Atlas backup
3. Set up GitHub Actions for CI/CD
4. Monitor logs on Render dashboard
5. Use Vercel preview deployments for testing

---

**Need Help?** Check the main README.md or create an issue on GitHub.
