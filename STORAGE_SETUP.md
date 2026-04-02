# Storage Configuration Guide

This application uses two free storage services for different purposes:

## 1. GoFile (Document Storage)

**Purpose:** Unlimited storage for EDMS documents, project files, and large uploads

**Setup:**
1. Go to [gofile.io](https://gofile.io)
2. Create a free account
3. Navigate to your Profile page
4. Copy your API Token
5. Add to `.env`:
   ```
   GOFILE_API_TOKEN="your_token_here"
   ```

**Features:**
- Unlimited storage (free tier)
- Files up to 50MB per upload
- Automatic file organization
- Direct download links

**API Documentation:** https://gofile.io/contents/api.html

---

## 2. ImgBB (Image Storage)

**Purpose:** User avatars, profile images, and UI images

**Setup:**
1. Go to [api.imgbb.com](https://api.imgbb.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to `.env`:
   ```
   IMGBB_API_KEY="your_api_key_here"
   ```

**Features:**
- Free image hosting
- Up to 32MB per image
- Automatic thumbnail generation
- Direct image URLs
- Optional expiration (60 seconds to 180 days)

**API Documentation:** https://api.imgbb.com/

---

## Environment Variables

Add these to your `.env` file:

```env
# GoFile for document storage
GOFILE_API_TOKEN="your_gofile_token"

# ImgBB for image storage
IMGBB_API_KEY="your_imgbb_key"
```

---

## Usage in Code

### Document Upload (GoFile)
```typescript
import { uploadEdmsFile } from "@/lib/edms/storage-gofile";

const result = await uploadEdmsFile({
  file: myFile,
  projectId: "project-123",
  folder: "documents"
});
```

### Avatar Upload (ImgBB)
```typescript
import { uploadAvatarImage } from "@/lib/storage-imgbb";

const imageUrl = await uploadAvatarImage(avatarFile);
```

---

## API Endpoints

### Document Upload
- **Endpoint:** `POST /api/edms/uploads`
- **Auth:** Required
- **Max Size:** 50MB
- **Storage:** GoFile

### Avatar Upload
- **Endpoint:** `POST /api/upload/avatar`
- **Auth:** Required
- **Max Size:** 5MB
- **Formats:** JPEG, PNG, GIF, WebP
- **Storage:** ImgBB

---

## Migration from Vercel Blob

If you were previously using Vercel Blob storage:

1. Remove `BLOB_READ_WRITE_TOKEN` from environment variables
2. Add `GOFILE_API_TOKEN` and `IMGBB_API_KEY`
3. Existing file URLs will continue to work
4. New uploads will use GoFile/ImgBB

---

## Cost Comparison

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **GoFile** | Unlimited storage | Premium features available |
| **ImgBB** | Unlimited images | No paid plans needed |
| **Vercel Blob** | 500MB free | $0.15/GB after |

**Result:** Unlimited free storage with GoFile + ImgBB! 🎉
