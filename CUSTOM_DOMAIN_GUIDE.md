# 🌐 CUSTOM DOMAIN SETUP GUIDE

## 🎯 Current URL vs Desired URL

### Current:
❌ `https://frontend-pqp4kv1vb-vishnus-projects-74225a00.vercel.app`

### Target Options:
✅ `https://skillbridge.vercel.app` (Free - Vercel subdomain)
✅ `https://skillbridge.com` (Paid - Custom domain ~$10-15/year)

---

## 📋 OPTION 1: Rename Vercel Project (FREE - 5 minutes)

This will give you a cleaner Vercel URL like: `skillbridge.vercel.app`

### Steps:

1. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/vishnus-projects-74225a00/frontend/settings

2. **Rename Project**:
   - Scroll to **"Project Name"** section
   - Current name: `frontend`
   - Change to: `skillbridge`
   - Click **"Save"**

3. **New URL Options**:
   After renaming, you can choose from:
   - `skillbridge.vercel.app`
   - `skillbridge-vishnu.vercel.app`
   - `skillbridge-vishnuu2005.vercel.app`

4. **Set Primary Domain**:
   - Go to **Settings** → **Domains**
   - Click **"Add"** 
   - Enter: `skillbridge.vercel.app` (or your preferred name)
   - Click **"Add"**
   - Set as **Primary** domain

5. **Update Environment Variables** (I'll do this):
   - Backend needs to know the new frontend URL
   - I'll update and redeploy

### After Renaming:
✅ Cleaner, professional URL
✅ Easier to share
✅ Free forever
✅ Instant activation

---

## 📋 OPTION 2: Custom Domain (PAID - $10-15/year)

Get `skillbridge.com` - your own professional domain!

### Step 1: Buy Domain

**Recommended Registrars:**

1. **Vercel Domains** (Easiest integration):
   - Visit: https://vercel.com/domains
   - Search: `skillbridge.com`
   - Purchase directly (~$15/year)
   - Automatic DNS setup

2. **Namecheap** (Popular & Affordable):
   - Visit: https://www.namecheap.com/
   - Search: `skillbridge.com`
   - Check availability (~$10-12/year)
   - Use coupon codes for discounts

3. **GoDaddy**:
   - Visit: https://www.godaddy.com/
   - Search and purchase (~$12-15/year)

4. **Google Domains**:
   - Visit: https://domains.google/
   - Professional option (~$12/year)

### Step 2: Add Domain to Vercel

1. **Go to Vercel Dashboard**:
   - https://vercel.com/vishnus-projects-74225a00/frontend/settings/domains

2. **Add Domain**:
   - Click **"Add"**
   - Enter: `skillbridge.com`
   - Click **"Add"**
   - Also add: `www.skillbridge.com`

3. **Vercel will show DNS records** (example):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Step 3: Configure DNS

**In your domain registrar (Namecheap/GoDaddy/etc):**

1. Go to **DNS Management** or **DNS Settings**
2. Add the records Vercel provided
3. Save changes
4. Wait 1-24 hours for propagation (usually 1-2 hours)

### Step 4: Verify

1. Wait for DNS propagation
2. Visit `https://skillbridge.com`
3. Should redirect to your app!

---

## 📋 OPTION 3: Free Subdomain Services

Get free domains like `skillbridge.is-a.dev` or `skillbridge.js.org`

### is-a.dev (For Developers):

1. **Fork Repository**:
   - Visit: https://github.com/is-a-dev/register
   - Fork the repository

2. **Create Domain File**:
   - Create file: `domains/skillbridge.json`
   ```json
   {
     "owner": {
       "username": "vishnuu2005",
       "email": "your-email@example.com"
     },
     "record": {
       "CNAME": "frontend-pqp4kv1vb-vishnus-projects-74225a00.vercel.app"
     }
   }
   ```

3. **Submit Pull Request**
4. **Wait for approval** (1-7 days)
5. **Result**: `https://skillbridge.is-a.dev`

### js.org (JavaScript Projects):

Similar process at: https://github.com/js-org/js.org

---

## 🎯 RECOMMENDED APPROACH

### For Now (Immediate - FREE):
1. ✅ **Rename Vercel project** → Get `skillbridge.vercel.app`
2. ✅ **Professional enough** for portfolio and sharing
3. ✅ **Takes 5 minutes**

### Later (When Ready - PAID):
1. 💰 **Buy `skillbridge.com`** (~$10-15/year)
2. 🌐 **Add to Vercel** (5 minutes setup)
3. ✨ **Professional custom domain**

---

## 🔧 WHAT I'LL DO AFTER YOU RENAME

Once you rename your Vercel project and get the new URL, tell me and I'll:

1. ✅ Update frontend environment variables
2. ✅ Update backend CORS settings
3. ✅ Redeploy both frontend and backend
4. ✅ Update all documentation
5. ✅ Update README with new URL
6. ✅ Test everything works

---

## 📝 STEP-BY-STEP: Rename to Get Clean URL

### DO THIS NOW (5 minutes):

1. Open: https://vercel.com/vishnus-projects-74225a00/frontend/settings

2. Find **"Project Name"** section

3. Change from `frontend` to `skillbridge`

4. Click **"Save"**

5. Go to: Settings → Domains

6. Click **"Add Domain"**

7. Try these (in order until one works):
   - `skillbridge.vercel.app`
   - `skillbridge-vishnu.vercel.app`
   - `skillbridge-vishnuu2005.vercel.app`

8. Set it as **Primary Domain**

9. **COPY THE NEW URL** and tell me!

10. I'll update everything automatically

---

## ✅ BENEFITS OF CLEAN URL

### Before:
❌ `frontend-pqp4kv1vb-vishnus-projects-74225a00.vercel.app`
- Hard to remember
- Hard to share
- Looks unprofessional

### After (Option 1 - Free):
✅ `skillbridge.vercel.app`
- Easy to remember
- Easy to share
- Professional looking
- Perfect for portfolio

### After (Option 2 - Paid):
✅ `skillbridge.com`
- Most professional
- Your own brand
- Best for serious projects
- SEO benefits

---

## 💡 QUICK START

**Do this RIGHT NOW:**

1. Go to: https://vercel.com/vishnus-projects-74225a00/frontend/settings
2. Rename project to: `skillbridge`
3. Add domain: `skillbridge.vercel.app` (or available variant)
4. Tell me your new URL
5. I'll update and redeploy everything!

**Takes 5 minutes, FREE forever!** 🚀

---

## 📞 NEED HELP?

If you get stuck:
1. Check if `skillbridge.vercel.app` is available
2. Try variations: `skillbridge-vishnu`, `skillbridge-india`, etc.
3. Screenshot any errors and let me know

**Once you have your new URL, just tell me and I'll handle the rest!**
