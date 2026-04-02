# Quick Start Guide

## Environment Variables Setup

Add these to your Vercel project (or `.env.local` for local development):

```env
# ImgBB - Unlimited Image Storage (FREE)
IMGBB="your_imgbb_api_key"

# GoFile - Unlimited Document Storage (FREE)
GOFILE_API_TOKEN="your_gofile_token"

# Resend - Email Service (Optional)
RESEND_FROM_EMAIL="your-verified-email@domain.com"
```

## Get Your API Keys

### 1. ImgBB (Images)
1. Go to https://api.imgbb.com/
2. Sign up for free account
3. Copy your API key
4. Add as `IMGBB` environment variable

### 2. GoFile (Documents)
1. Go to https://gofile.io
2. Create free account
3. Go to Profile page
4. Copy your API Token
5. Add as `GOFILE_API_TOKEN` environment variable

### 3. Resend (Email - Optional)
1. Go to https://resend.com
2. Create account
3. Verify your sender email
4. Add as `RESEND_FROM_EMAIL` environment variable

## Add to Vercel

```bash
# Via CLI
vercel env add IMGBB
vercel env add GOFILE_API_TOKEN
vercel env add RESEND_FROM_EMAIL

# Then redeploy
vercel --prod
```

Or via Vercel Dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add each variable for Production
4. Redeploy

## Features Using Unlimited Storage

### ✅ User Avatars
- Settings → Account
- Upload profile picture
- Stored on ImgBB (unlimited)

### ✅ Project Images
- Dashboard → Projects → Create Project
- Add up to 5 images per project
- Site photos, mockups, references
- Stored on ImgBB (unlimited)

### ✅ Document Images
- Dashboard → Documents → Upload Document
- Add up to 5 preview images
- Diagrams, screenshots, references
- Stored on ImgBB (unlimited)

### ✅ Document Files
- Dashboard → Documents → Upload Document
- Upload PDFs, DWG, any file type
- Up to 50MB per file
- Stored on GoFile (unlimited)

### ✅ Transmittal Images
- Dashboard → Transmittals → Create Transmittal
- Add up to 5 images
- Cover sheets, sign-offs, visuals
- Stored on ImgBB (unlimited)

## Database Migrations

After setting up environment variables, run migrations:

```bash
# Generate migration (if schema changed)
npm run db:generate

# Apply migration to database
npm run db:migrate
```

## Test the Setup

1. Sign up with email/password
2. Go to Settings → Account
3. Upload an avatar (tests ImgBB)
4. Create a project with images (tests ImgBB)
5. Upload a document (tests GoFile)
6. Create a transmittal with images (tests ImgBB)

## Troubleshooting

### Images not uploading?
- Check `IMGBB` is set in Vercel environment variables
- Verify API key is correct
- Check browser console for errors

### Documents not uploading?
- Check `GOFILE_API_TOKEN` is set in Vercel environment variables
- Verify token is correct from gofile.io profile
- Check file size is under 50MB

### Emails not sending?
- Check `RESEND_FROM_EMAIL` is set
- Verify email is verified in Resend dashboard
- Check `RESEND_API_KEY` is also set

## Cost Summary

| Service | Storage | Cost |
|---------|---------|------|
| ImgBB | Unlimited images | $0/month |
| GoFile | Unlimited files | $0/month |
| Database | Metadata only | Varies by host |

**Total Storage Cost: $0/month forever!** 🎉

## Next Steps

1. ✅ Set up environment variables
2. ✅ Deploy to Vercel
3. ✅ Run database migrations
4. ✅ Test image uploads
5. ✅ Test document uploads
6. ✅ Invite team members
7. ✅ Start managing projects!

## Support

- ImgBB Docs: https://api.imgbb.com/
- GoFile API: https://gofile.io/contents/api.html
- Resend Docs: https://resend.com/docs

---

**You're all set!** Start uploading unlimited images and documents for free! 🚀
