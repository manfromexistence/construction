# Deployment Checklist

## Required Environment Variables

Add these to your Vercel project settings:

### 1. GoFile (Document Storage)
```
GOFILE_API_TOKEN=your_token_from_gofile.io
```
- Sign up at https://gofile.io
- Get token from Profile page
- Provides unlimited document storage

### 2. ImgBB (Image Storage)
```
IMGBB_API_KEY=your_key_from_api.imgbb.com
```
- Sign up at https://api.imgbb.com/
- Get API key from dashboard
- Provides unlimited image hosting

### 3. Email (Optional but Recommended)
```
RESEND_FROM_EMAIL=your-verified-email@domain.com
```
- Verify sender email in Resend dashboard
- Required for password reset emails

## Quick Setup Commands

### Add to Vercel via CLI:
```bash
vercel env add GOFILE_API_TOKEN
vercel env add IMGBB_API_KEY
vercel env add RESEND_FROM_EMAIL
```

### Or via Vercel Dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add each variable for Production environment
4. Redeploy the project

## What Changed

✅ Removed dependency on Vercel Blob (paid after 500MB)
✅ Added GoFile for unlimited document storage (free)
✅ Added ImgBB for unlimited image storage (free)
✅ Commented out OAuth buttons (Google/GitHub)
✅ Email/password authentication works without OAuth

## Testing After Deployment

1. Sign up with email/password
2. Try uploading a document in EDMS
3. Try uploading an avatar image
4. Test password reset flow

## Cost Savings

- Before: Vercel Blob ($0.15/GB after 500MB)
- After: GoFile + ImgBB (unlimited free)
- Savings: 100% on storage costs! 🎉
