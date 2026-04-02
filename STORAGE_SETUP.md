# Storage Configuration Guide

This application uses **100% FREE unlimited storage** for all file uploads:

## Storage Services Overview

| Service | Purpose | Storage Limit | Cost |
|---------|---------|---------------|------|
| **GoFile** | Documents, PDFs, large files | ✅ UNLIMITED | FREE |
| **ImgBB** | Images, avatars, photos | ✅ UNLIMITED | FREE |
| **Database** | Metadata only (not files) | Depends on host | Varies |

---

## 1. GoFile (Document Storage)

**Purpose:** Unlimited storage for EDMS documents, project files, PDFs, and any file type

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
- ✅ Unlimited storage (completely free)
- ✅ Any file type supported
- ✅ Files up to 50MB per upload
- ✅ Automatic file organization
- ✅ Direct download links
- ✅ No bandwidth limits

**API Documentation:** https://gofile.io/contents/api.html

---

## 2. ImgBB (Image Storage)

**Purpose:** User avatars, profile images, project photos, document preview images

**Setup:**
1. Go to [api.imgbb.com](https://api.imgbb.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to `.env`:
   ```
   IMGBB="your_api_key_here"
   ```

**Features:**
- ✅ Unlimited image hosting (completely free)
- ✅ Up to 32MB per image
- ✅ Automatic thumbnail generation
- ✅ Direct image URLs
- ✅ Optional expiration (60 seconds to 180 days)
- ✅ Supports JPEG, PNG, GIF, WebP

**API Documentation:** https://api.imgbb.com/

---

## New Features: Image Cards

Both projects and documents now support image cards:

### Project Images
- Add site photos, design mockups, or visual references
- Up to 5 images per project
- Displayed as beautiful image cards
- Stored on ImgBB (unlimited free)

### Document Images
- Add preview images, diagrams, or visual references
- Up to 5 images per document
- Perfect for quick visual identification
- Stored on ImgBB (unlimited free)

---

## Environment Variables

Add these to your `.env` file:

```env
# GoFile for document storage (UNLIMITED FREE)
GOFILE_API_TOKEN="your_gofile_token"

# ImgBB for image storage (UNLIMITED FREE)
IMGBB="your_imgbb_key"
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

### Image Upload (ImgBB)
```typescript
import { uploadAvatarImage } from "@/lib/storage-imgbb";

const imageUrl = await uploadAvatarImage(avatarFile);
```

### Image Cards Component
```typescript
import { ImageCardUpload } from "@/components/edms/image-card-upload";

<ImageCardUpload
  value={images}
  onChange={setImages}
  maxImages={5}
  label="Project images"
/>
```

---

## API Endpoints

### Document Upload
- **Endpoint:** `POST /api/edms/uploads`
- **Auth:** Required
- **Max Size:** 50MB
- **Storage:** GoFile (unlimited)

### Image Upload
- **Endpoint:** `POST /api/upload/avatar`
- **Auth:** Required
- **Max Size:** 5MB (images), 32MB (max supported)
- **Formats:** JPEG, PNG, GIF, WebP
- **Storage:** ImgBB (unlimited)

---

## Migration from Vercel Blob

If you were previously using Vercel Blob storage:

1. Remove `BLOB_READ_WRITE_TOKEN` from environment variables
2. Add `GOFILE_API_TOKEN` and `IMGBB`
3. Existing file URLs will continue to work
4. New uploads will use GoFile/ImgBB

---

## Cost Comparison

| Service | Free Tier | Paid Plans | Monthly Cost |
|---------|-----------|------------|--------------|
| **GoFile** | ✅ Unlimited storage | Premium features available | $0 |
| **ImgBB** | ✅ Unlimited images | No paid plans needed | $0 |
| **Vercel Blob** | 500MB free | $0.15/GB after | $15+ for 100GB |

**Result:** Save $180+/year with unlimited free storage! 🎉

---

## Why This is Better

1. **Truly Unlimited:** No storage caps, no bandwidth limits
2. **100% Free:** Both services are completely free forever
3. **Better UX:** Image cards make projects and documents more visual
4. **Reliable:** Both services have excellent uptime
5. **Fast:** Global CDN for quick image delivery
6. **Simple:** Easy API integration, no complex setup

---

## Database Storage

The database only stores:
- Metadata (titles, descriptions, tags)
- Image URLs (not the actual images)
- File URLs (not the actual files)
- User data and relationships

This keeps your database small and fast, while files are stored on specialized free services.
