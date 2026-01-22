# UnFee'd - Deployment Package

This folder contains everything needed to deploy to Vercel.

## Files Included:
- `index.html` - Main application (all CSS/JS embedded)
- `api/subscribe.js` - Beehiiv integration serverless function
- `vercel.json` - Vercel configuration
- `package.json` - Project metadata

## To Deploy:
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Drag this entire folder onto Vercel
4. Click "Deploy"

## After Deployment:
1. Add environment variables in Vercel:
   - `BEEHIIV_API_KEY`
   - `BEEHIIV_PUBLICATION_ID`
2. Redeploy

That's it! 🚀
