# 🚀 Push to GitHub - Simple Steps

## Step 1: Install Git (5 minutes)

1. **Download Git**:
   - Go to: https://git-scm.com/download/win
   - Click "Click here to download" (64-bit version)
   - File will download: `Git-2.xx.x-64-bit.exe`

2. **Install Git**:
   - Run the downloaded file
   - Click "Next" through all screens (use default settings)
   - Click "Install"
   - Click "Finish"

3. **Restart VS Code**:
   - Close and reopen VS Code completely
   - This loads Git into the system

4. **Verify Installation**:
   - Open new terminal in VS Code
   - Run: `git --version`
   - Should show: `git version 2.xx.x`

---

## Step 2: Setup Git (2 minutes)

Open terminal and run these commands (replace with YOUR details):

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Step 3: Create GitHub Account (if needed)

1. Go to: https://github.com/signup
2. Enter your email address
3. Create a password
4. Choose a username
5. Verify your email
6. Login to GitHub

---

## Step 4: Create Personal Access Token (IMPORTANT!)

**Don't use your GitHub password - use a token instead:**

1. Login to GitHub
2. Click your profile picture (top right)
3. Click: **Settings**
4. Scroll down, click: **Developer settings** (left sidebar, bottom)
5. Click: **Personal access tokens** → **Tokens (classic)**
6. Click: **Generate new token** → **Generate new token (classic)**
7. Fill in:
   - **Note**: "Village Skill Portal"
   - **Expiration**: 90 days (or your choice)
   - **Select scopes**: Check ✅ **repo** (this checks all repo boxes)
8. Click: **Generate token** (green button at bottom)
9. **COPY THE TOKEN NOW!** 
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You won't see it again!
   - Paste it in a text file temporarily

---

## Step 5: Create GitHub Repository

1. Go to: https://github.com/new
2. Fill in:
   - **Repository name**: `village-skill-portal`
   - **Description**: "Community platform connecting skilled professionals"
   - **Public** or **Private** (your choice)
   - **DO NOT** check any boxes (no README, no .gitignore, no license)
3. Click: **Create repository** (green button)
4. **Keep this page open** - you'll need the URL

---

## Step 6: Push Your Code (5 minutes)

Copy and run these commands ONE BY ONE in your VS Code terminal:

### Initialize Git:
```powershell
cd e:\village-skill-portal
git init
```

### Add all files:
```powershell
git add .
```

### Create first commit:
```powershell
git commit -m "Initial commit: Village Skill Portal with admin features"
```

### Connect to GitHub:
**Replace `YOUR_USERNAME` with your actual GitHub username!**
```powershell
git remote add origin https://github.com/YOUR_USERNAME/village-skill-portal.git
```

### Set main branch:
```powershell
git branch -M main
```

### Push to GitHub:
```powershell
git push -u origin main
```

**When prompted for credentials:**
- **Username**: `your_github_username`
- **Password**: Paste your Personal Access Token (starts with `ghp_`)
  - **NOT YOUR GITHUB PASSWORD!**
  - Use the token you copied in Step 4

---

## ✅ Success!

If you see:
```
Enumerating objects: xxx, done.
Counting objects: 100%
Writing objects: 100%
```

**Your code is on GitHub!** 🎉

Visit: `https://github.com/YOUR_USERNAME/village-skill-portal`

---

## 🚀 Next: Deploy Online (Optional)

After your code is on GitHub, you can deploy it so anyone can access it online.

**See: `COMPLETE_DEPLOYMENT_GUIDE.md`** for deployment to Render + Vercel (free hosting)

---

## ❓ Troubleshooting

### "git is not recognized"
- Git not installed or VS Code not restarted
- Install Git from link above, then restart VS Code

### "Permission denied"
- Using GitHub password instead of token
- Go back to Step 4 and create Personal Access Token

### "Repository not found"
- Check your username in the URL
- Make sure repository exists on GitHub

### "Authentication failed"
- Token might be expired or wrong
- Create a new token and try again

---

## 📝 Quick Command Reference

```powershell
# Initialize repository
git init

# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main

# Pull latest
git pull origin main
```

---

**Start with Step 1 (Install Git) and follow each step in order!** 🚀
