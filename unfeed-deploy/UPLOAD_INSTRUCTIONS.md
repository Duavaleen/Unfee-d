# 📤 Upload Instructions for Vercel

## Your Deployment Folder is Ready!

**Location:** `C:\Users\Big D\Desktop\Unfee'd\unfeed-deploy`

## Files Included:
✅ `index.html` - Your main app (everything embedded)
✅ `api/subscribe.js` - Beehiiv integration
✅ `vercel.json` - Vercel configuration
✅ `package.json` - Project metadata

---

## Step-by-Step Upload:

### 1. Go to Vercel
- Open: https://vercel.com
- Make sure you're logged in

### 2. Create New Project
- Click "Add New..." (top right)
- Click "Project"

### 3. Upload Your Folder
**Option A - Drag & Drop (Easiest):**
1. Open File Explorer
2. Navigate to: `C:\Users\Big D\Desktop\Unfee'd\unfeed-deploy`
3. Drag the entire `unfeed-deploy` folder onto the Vercel page

**Option B - Browse:**
1. Click "Browse" or "Upload"
2. Navigate to: `C:\Users\Big D\Desktop\Unfee'd\unfeed-deploy`
3. Select the folder
4. Click "Open"

### 4. Configure (if asked)
- **Project Name:** `unfeed` (or leave default)
- **Framework:** "Other" or "Static"
- **Build Command:** Leave EMPTY
- **Output Directory:** Leave EMPTY

### 5. Deploy!
- Click "Deploy" button
- Wait 30-60 seconds
- **You'll get your live URL!** 🎉

---

## After Deployment:

### Add Beehiiv Environment Variables:
1. Click your project name in Vercel
2. Go to "Settings" → "Environment Variables"
3. Add:
   - Name: `BEEHIIV_API_KEY` → Value: (your API key)
   - Name: `BEEHIIV_PUBLICATION_ID` → Value: (your Publication ID)
4. Check all environments (Production, Preview, Development)
5. Click "Save"
6. Go to "Deployments" → Redeploy latest

---

## That's It! 🚀

Your site will be live at: `unfeed-abc123.vercel.app`

**Ready to upload?** Go to Vercel and drag that folder! 
