# Supabase Storage Image Upload Guide

## ✅ No Credit Card Required!

This implementation uses **Supabase Storage** instead of Cloudflare R2 - completely free with no credit card needed.

## 📋 Quick Setup

### Step 1: Create Storage Bucket (2 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Storage** in the sidebar
4. Click **Create a new bucket**
5. Name it: `hotel-photos`
6. Make it **Public** (uncheck "Private")
7. Click **Create bucket**

### Step 2: Set CORS (Optional, for cross-domain requests)

1. Go to Storage settings
2. In CORS section, add your domain (or leave default)
3. Save

### Step 3: That's it! ✅

Your environment variables are already configured in `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 🚀 Usage Examples

### Basic Upload

```typescript
import { uploadToSupabaseStorage, getThumbnailUrl } from './services/supabaseStorageService';
import { saveAttractionImage } from './services/supabaseService';

// Upload file
const { publicUrl, storagePath } = await uploadToSupabaseStorage(file, 'taj-mahal-123');

// Get thumbnail URL (200x200)
const thumbUrl = getThumbnailUrl(publicUrl);

// Save to database
await saveAttractionImage(
  'taj-mahal-123',
  storagePath,
  publicUrl,
  false
);
```

### Using in React Component

```tsx
import { ImageUploadComponent } from './components/ImageUploadComponent';

export function AttractionDetail({ attractionId }: { attractionId: string }) {
  return (
    <div>
      <h1>Upload Attraction Images</h1>
      <ImageUploadComponent
        attractionId={attractionId}
        onUploadSuccess={(image) => {
          console.log('Image uploaded!', image);
          // Refresh gallery or update UI
        }}
        onUploadError={(error) => {
          console.error('Upload failed:', error.message);
        }}
      />
    </div>
  );
}
```

### Display Images with Transformations

```tsx
import { getMobileHeroUrl, getDesktopHeroUrl } from './services/supabaseStorageService';

export function ImageGallery({ images }: { images: any[] }) {
  return (
    <div>
      {images.map((img) => (
        <picture key={img.id}>
          <source media="(max-width: 640px)" srcSet={getMobileHeroUrl(img.image_url)} />
          <img
            src={getDesktopHeroUrl(img.image_url)}
            alt="Attraction"
            className="w-full"
          />
        </picture>
      ))}
    </div>
  );
}
```

## 📐 URL Transformation Reference

Supabase Storage supports image transformation via URL parameters:

### Available Parameters

- **`width`** - Image width in pixels
- **`height`** - Image height in pixels
- **`quality`** - Image quality (0-100, default: 80)
- **`resize`** - Resize mode: cover, contain, fill (default: cover)

### Examples

```typescript
// Thumbnail (200x200)
getThumbnailUrl(url) 
// → ?width=200&height=200

// Mobile (600x400)
getMobileHeroUrl(url)
// → ?width=600&height=400

// Desktop (1200x600)
getDesktopHeroUrl(url)
// → ?width=1200&height=600

// Custom size
getCustomSizeUrl(url, 400, 300)
// → ?width=400&height=300
```

## 🗂️ File Organization

Files are automatically organized by attraction in the bucket:

```
hotel-photos/
└── attractions/
    ├── taj-mahal-123/
    │   ├── 1703688000000.jpg
    │   ├── 1703688000001.jpg
    │   └── 1703688000002.jpg
    ├── red-fort-456/
    │   ├── 1703688000100.jpg
    │   └── 1703688000101.jpg
    └── golden-temple-789/
        └── 1703688000200.jpg
```

## 📊 Storage Limits

| Plan | Storage | Bandwidth |
|------|---------|-----------|
| Free | 1GB | 2GB/month |
| Pro | 100GB | 200GB/month |
| Enterprise | Custom | Custom |

**Perfect for:** Up to 10,000 images at free tier

## 🔐 Security

### Public Bucket (Current Setup)

✅ Files readable by anyone with the URL  
✅ Files uploadable only via authenticated client  
✅ RLS policies control database access  

### Making Bucket Private (Optional)

If you want only authenticated users to see images:

1. Go to Storage → `hotel-photos` → Settings
2. Toggle **Private**
3. Update RLS policies in Supabase

## 🔧 API Reference

### Upload Functions

```typescript
// Upload file to Supabase Storage
const result = await uploadToSupabaseStorage(file, attractionId);
// Returns: { publicUrl, storagePath, fileName }

// List images for attraction
const paths = await listAttractionImages(attractionId);
// Returns: string[] of storage paths

// Delete image
await deleteFromStorage(storagePath);
```

### URL Generation Functions

```typescript
// Thumbnail (200x200)
getThumbnailUrl(publicUrl)

// Mobile hero (600x400)
getMobileHeroUrl(publicUrl)

// Desktop hero (1200x600)
getDesktopHeroUrl(publicUrl)

// Custom size
getCustomSizeUrl(publicUrl, width, height?)
```

### Database Functions

```typescript
// Save image metadata
await saveAttractionImage(
  attractionId,
  storagePath,
  publicImageUrl,
  isPrimary
)

// Get all images
const images = await getAttractionImages(attractionId)

// Get primary image
const primary = await getPrimaryAttractionImage(attractionId)

// Set primary
await setPrimaryImage(imageId, attractionId)

// Delete
await deleteAttractionImage(imageId, storagePath)
```

## 📝 Database Schema

The `attraction_images` table stores:

```sql
CREATE TABLE attraction_images (
  id UUID PRIMARY KEY,
  attraction_id UUID NOT NULL,
  storage_key TEXT UNIQUE,        -- Path in Supabase Storage
  image_url TEXT NOT NULL,        -- Public Supabase Storage URL
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Note:** `thumbnail_url`, `mobile_hero_url`, and `desktop_hero_url` are no longer stored - they're generated dynamically from the public URL.

## ✨ Advantages Over Cloudflare R2

✅ **No credit card** - Completely free  
✅ **Already set up** - You have Supabase account  
✅ **Simple** - No presigned URLs, direct uploads  
✅ **Integrated** - Same database as metadata  
✅ **Free transformations** - Built-in image resizing  
✅ **Dashboard** - Monitor usage easily  
✅ **Real-time** - Supabase real-time features included  

## 🚨 Troubleshooting

### Issue: "Failed to upload: 404"
**Solution:** Make sure bucket name is exactly `hotel-photos` (lowercase)

### Issue: "Upload successful but file not visible"
**Solution:** 
1. Refresh page
2. Check Storage → hotel-photos in dashboard
3. Verify bucket is **Public**

### Issue: "Image URL 404"
**Solution:**
1. Check storagePath in database
2. Verify file exists in Storage
3. Confirm bucket is Public

### Issue: "getPublicUrl returns null"
**Solution:** After upload, wait 1 second before calling getPublicUrl

### Issue: "Transformation parameters not working"
**Solution:** Make sure you're using the transform functions from `supabaseStorageService.ts`

## 📚 Example: Complete Upload Flow

```typescript
import { 
  uploadToSupabaseStorage, 
  getThumbnailUrl,
  getMobileHeroUrl,
  getDesktopHeroUrl 
} from './services/supabaseStorageService';
import { saveAttractionImage } from './services/supabaseService';

async function handleImageUpload(
  file: File,
  attractionId: string
) {
  try {
    // 1. Upload to Supabase Storage
    const { publicUrl, storagePath } = await uploadToSupabaseStorage(
      file,
      attractionId
    );

    // 2. Generate transformed URLs
    const thumbnailUrl = getThumbnailUrl(publicUrl);
    const mobileUrl = getMobileHeroUrl(publicUrl);
    const desktopUrl = getDesktopHeroUrl(publicUrl);

    // 3. Save to database
    const savedImage = await saveAttractionImage(
      attractionId,
      storagePath,
      publicUrl,
      false
    );

    console.log('Success!', {
      publicUrl,
      thumbnailUrl,
      mobileUrl,
      desktopUrl,
      savedImage
    });

    return savedImage;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}
```

## 🎯 Next Steps

1. ✅ Create `hotel-photos` bucket in Supabase
2. ✅ Test upload with `ImageUploadComponent`
3. ✅ Verify image appears in Storage
4. ✅ Verify metadata saved to database
5. ✅ Check transformed URLs work
6. ✅ Deploy! 🚀

## 💡 Pro Tips

- Use unique attraction IDs in storage path (prevents collisions)
- Keep image size under 5MB for best performance
- Test transformations in browser DevTools Network tab
- Monitor storage usage in Supabase Dashboard
- Batch delete old images quarterly

## 📞 Support

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Dashboard](https://supabase.com/dashboard)
- Check browser console for upload errors
- Verify environment variables are loaded

---

**Congratulations!** You now have a completely free image upload system. 🎉
