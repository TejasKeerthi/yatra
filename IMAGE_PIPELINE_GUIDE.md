# Production-Grade Image Pipeline Setup Guide

This guide walks you through setting up the free-forever image pipeline for your travel application.

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Setup Instructions](#setup-instructions)
3. [Integration Guide](#integration-guide)
4. [Usage Examples](#usage-examples)
5. [Troubleshooting](#troubleshooting)
6. [Cost & Scaling](#cost--scaling)

## 🏗️ Architecture Overview

Your image pipeline uses four free services:

```
User Uploads Image
       ↓
[ImageUploadComponent] ← Requests Presigned URL
       ↓
[Cloudflare R2] ← Stores original image (10GB free)
       ↓
[ImageKit.io] ← Transforms for different devices (25GB bandwidth free)
       ↓
[Supabase] ← Stores metadata (500MB DB free)
       ↓
Application ← Serves optimized images
```

### Why This Stack?

- **Cloudflare R2**: Unlimited API calls, S3-compatible, no egress fees
- **ImageKit.io**: CDN included, automatic format optimization, smart cropping
- **Supabase**: PostgreSQL, real-time, generous free tier
- **Zero vendor lock-in**: Easy to migrate if needed

## 🚀 Setup Instructions

### Step 1: Cloudflare R2 Setup (5 minutes)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **R2** in the left sidebar
3. Click **Create bucket**
4. Name it: `travel-app-images`
5. Leave everything default, click **Create bucket**
6. Go to **Account Home** → **API Tokens**
7. Click **Create token**
   - Name: `R2 Upload Token`
   - Permissions: Select **Edit** for **R2**
   - Resources: Select **Include - All buckets in an account**
8. Click **Create API Token**
9. Copy these values:
   - Account ID (from account page)
   - Access Key ID
   - Secret Access Key
   - Bucket name

**Add to `.env.local`:**
```
VITE_R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
VITE_R2_BUCKET_NAME=travel-app-images
VITE_R2_ACCESS_KEY_ID=your_access_key
VITE_R2_SECRET_ACCESS_KEY=your_secret_key
VITE_R2_PUBLIC_URL=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
```

### Step 2: ImageKit.io Setup (5 minutes)

1. Go to [ImageKit.io](https://imagekit.io)
2. Click **Sign up** (free tier)
3. Complete account setup
4. Go to **Account** → **API Keys**
5. Copy your **Public Key**
6. Use the default endpoint: `https://ik.imagekit.io/YOUR_PUBLIC_KEY`

**Add to `.env.local`:**
```
VITE_IMAGEKIT_ENDPOINT=https://ik.imagekit.io/YOUR_PUBLIC_KEY
```

### Step 3: Supabase Setup (5 minutes)

1. Go to [Supabase](https://supabase.com)
2. Click **New Project**
3. Name: `Yatra Travel App`
4. Set password (save it!)
5. Click **Create new project**
6. Wait for project to initialize (2-3 minutes)
7. Go to **Settings** → **API**
8. Copy:
   - **Project URL**
   - **Anon Key** (under `anon` [public])

**Add to `.env.local`:**
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 4: Create Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents from `migrations/001_create_attraction_images_table.sql`
4. Paste into SQL editor
5. Click **Run**

✅ You'll see: "Query executed successfully"

### Step 5: Install Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @supabase/supabase-js axios
```

Or if you use yarn:
```bash
yarn add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @supabase/supabase-js axios
```

## 🔧 Integration Guide

### Basic Upload Implementation

```tsx
import { ImageUploadComponent } from './components/ImageUploadComponent';

export function AttractionDetail({ attractionId }: { attractionId: string }) {
  const handleUploadSuccess = (imageData) => {
    console.log('Image uploaded!', imageData);
    // Refresh images list
  };

  return (
    <div>
      <h1>Upload Images for This Attraction</h1>
      <ImageUploadComponent
        attractionId={attractionId}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
```

### Display Uploaded Images

```tsx
import { useAttractionImages } from './hooks/useAttractionImages';
import { getDesktopHero } from './services/imageKitService';

export function AttractionGallery({ attractionId }: { attractionId: string }) {
  const { images, loading, fetchImages } = useAttractionImages(attractionId);

  useEffect(() => {
    fetchImages(attractionId);
  }, [attractionId]);

  if (loading) return <div>Loading images...</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <img
          key={image.id}
          src={image.desktop_hero_url}
          alt="Attraction"
          className="rounded-lg"
        />
      ))}
    </div>
  );
}
```

### Set Primary Image

```tsx
const { setPrimary } = useAttractionImages(attractionId);

const handleSetPrimary = async (imageId: string) => {
  await setPrimary(imageId, attractionId);
  console.log('Primary image set!');
};
```

## 📖 Usage Examples

### Example 1: Simple Image Display

```tsx
import { getMobileHero } from './services/imageKitService';

const image = {
  image_url: 'https://r2.example.com/attractions/taj-mahal.jpg'
};

export default function HeroImage() {
  return (
    <img
      src={getMobileHero(image.image_url)}
      alt="Taj Mahal"
      className="w-full h-96 object-cover"
    />
  );
}
```

### Example 2: Responsive Images

```tsx
import { getThumbnail, getMobileHero, getDesktopHero } from './services/imageKitService';

export default function ResponsiveImage({ imageUrl }: { imageUrl: string }) {
  return (
    <picture>
      <source
        media="(max-width: 640px)"
        srcSet={getMobileHero(imageUrl)}
      />
      <source
        media="(min-width: 641px)"
        srcSet={getDesktopHero(imageUrl)}
      />
      <img
        src={getThumbnail(imageUrl)}
        alt="Attraction"
        className="w-full h-96 object-cover"
      />
    </picture>
  );
}
```

### Example 3: Image Grid with ImageKit

```tsx
import { getThumbnail, getResponsiveSizes } from './services/imageKitService';

export function ImageGrid({ images }: { images: any[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {images.map((image) => {
        const sizes = getResponsiveSizes(image.image_url);
        
        return (
          <img
            key={image.id}
            src={getThumbnail(image.image_url)}
            srcSet={`
              ${getThumbnail(image.image_url)} 200w,
              ${sizes.small} 400w,
              ${sizes.medium} 600w
            `}
            sizes="(max-width: 768px) 100vw, 25vw"
            alt="Attraction"
            className="rounded-lg"
          />
        );
      })}
    </div>
  );
}
```

## 🛠️ Troubleshooting

### Issue: "Can't find module '@aws-sdk/client-s3'"
**Solution:** Run `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`

### Issue: "CORS error when uploading"
**Solution:** Check R2 bucket CORS settings:
1. Go to R2 → Settings → CORS
2. Add allowed origin: `*` (or your domain in production)

### Issue: "Images not appearing in database"
**Solution:**
1. Check Supabase API key is correct
2. Verify table exists: `SELECT * FROM attraction_images;`
3. Check RLS policies: Settings → Authentication → Policies

### Issue: "ImageKit URLs return 404"
**Solution:**
1. Verify endpoint is correct: `https://ik.imagekit.io/YOUR_KEY`
2. Test in browser: go to the URL directly
3. Check ImageKit dashboard for API status

## 💰 Cost & Scaling

### Current Usage (Free Tier)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Cloudflare R2 | 10GB storage, unlimited API | $0 |
| ImageKit.io | 25GB bandwidth, 2GB storage | $0 |
| Supabase | 500MB database, 2GB bandwidth | $0 |
| **Total** | **Enough for 1M+ images** | **$0/month** |

### Scaling Guide

When you outgrow free tier:

| Milestone | Service | Cost | Action |
|-----------|---------|------|--------|
| 100GB images | Cloudflare R2 | $1.50/month | Automatic, no limits |
| 100GB bandwidth | ImageKit | $20/month | Upgrade plan |
| 1GB database | Supabase | $25/month | Upgrade to Pro |

**Example:** App with 10,000 images and 100K monthly users:
- R2: $0.30/month (3GB storage)
- ImageKit: $0/month (within free bandwidth)
- Supabase: $0/month (within free database)
- **Total: $0.30/month**

## 🔐 Security Checklist

- [ ] Presigned URLs have 1-hour expiration
- [ ] File uploads validated on frontend AND backend
- [ ] R2 bucket not publicly writable
- [ ] ImageKit API key not exposed in frontend
- [ ] Supabase RLS policies enabled
- [ ] Environment variables in .gitignore
- [ ] CORS configured for your domain only
- [ ] Regular backup of database

## 📚 Additional Resources

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [ImageKit Documentation](https://docs.imagekit.io/)
- [Supabase Guide](https://supabase.com/docs)
- [AWS S3 SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/)

## ✨ Next Steps

1. ✅ Complete all setup steps
2. ✅ Test with sample image upload
3. ✅ Implement in your attraction detail page
4. ✅ Add image management dashboard
5. ✅ Set up monitoring & analytics

---

**Need help?** Check the troubleshooting section or file an issue in the repository.
