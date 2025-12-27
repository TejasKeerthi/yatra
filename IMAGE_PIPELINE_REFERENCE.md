# Image Pipeline Quick Reference

## File Structure
```
services/
  ├── r2Service.ts           ← Cloudflare R2 operations
  ├── imageKitService.ts     ← Image transformations
  └── supabaseService.ts     ← Database operations

components/
  └── ImageUploadComponent.tsx  ← File upload UI

hooks/
  └── useAttractionImages.ts   ← Image management hook

migrations/
  └── 001_create_attraction_images_table.sql  ← Database schema
```

## API Reference

### R2Service (Upload & Storage)
```typescript
// Generate presigned URL for direct browser upload
const url = await generatePresignedUrl(fileName, contentType);

// Get public image URL
const publicUrl = getPublicImageUrl(storageKey);

// Validate before upload
validateImageFile(file, maxSizeMB);

// Generate unique storage key
const key = generateStorageKey(fileName);
```

### ImageKitService (Transformations)
```typescript
// Thumbnail (200x200)
getThumbnail(imageUrl);

// Mobile (600px, optimized)
getMobileHero(imageUrl);

// Desktop (1200px, optimized)
getDesktopHero(imageUrl);

// Custom transforms
getCustomTransform(imageUrl, width, height, quality, crop);

// Responsive srcset
getSrcSet(imageUrl, widths);

// Multiple sizes
getResponsiveSizes(imageUrl, maxWidth);
```

### SupabaseService (Database)
```typescript
// Save image metadata after upload
await saveAttractionImage(
  attractionId,
  storageKey,
  imageUrl,
  thumbnailUrl,
  mobileHeroUrl,
  desktopHeroUrl,
  isPrimary
);

// Fetch all images
const images = await getAttractionImages(attractionId);

// Get primary image only
const primary = await getPrimaryAttractionImage(attractionId);

// Set as primary
await setPrimaryImage(imageId, attractionId);

// Delete image
await deleteAttractionImage(imageId, storageKey);
```

### useAttractionImages Hook
```typescript
const {
  images,              // All images for attraction
  primaryImage,        // Primary image only
  loading,            // Loading state
  error,              // Error object
  fetchImages,        // Fetch all images
  fetchPrimaryImage,  // Fetch primary only
  setPrimary,         // Set as primary
  removeImage,        // Delete image
  getThumbnailUrl,    // Get thumbnail URL
  getMobileUrl,       // Get mobile URL
  getDesktopUrl       // Get desktop URL
} = useAttractionImages(attractionId);
```

## Common Patterns

### Upload with Progress
```tsx
<ImageUploadComponent
  attractionId={id}
  onUploadSuccess={(data) => console.log('Uploaded!', data)}
  onUploadError={(err) => console.error('Failed', err)}
/>
```

### Display Images
```tsx
const { images } = useAttractionImages(attractionId);
return (
  <div>
    {images.map(img => (
      <img key={img.id} src={img.desktop_hero_url} />
    ))}
  </div>
);
```

### Responsive Image
```tsx
<picture>
  <source media="(max-width: 640px)" srcSet={getMobileHero(url)} />
  <source media="(min-width: 641px)" srcSet={getDesktopHero(url)} />
  <img src={getThumbnail(url)} alt="..." />
</picture>
```

## Environment Variables
```env
VITE_R2_ENDPOINT=...
VITE_R2_BUCKET_NAME=...
VITE_R2_ACCESS_KEY_ID=...
VITE_R2_SECRET_ACCESS_KEY=...
VITE_R2_PUBLIC_URL=...

VITE_IMAGEKIT_ENDPOINT=...

VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Workflow
```
1. User selects image → ImageUploadComponent
2. Component requests presigned URL → R2Service
3. Component uploads directly to R2
4. Component calls Supabase to save metadata → SupabaseService
5. App displays with ImageKit transforms
```

## Database Schema
```sql
Table: attraction_images
├── id (UUID, primary key)
├── attraction_id (UUID, foreign key)
├── storage_key (TEXT, unique) -- R2 path
├── image_url (TEXT) -- R2 public URL
├── thumbnail_url (TEXT) -- ImageKit 200x200
├── mobile_hero_url (TEXT) -- ImageKit 600px
├── desktop_hero_url (TEXT) -- ImageKit 1200px
├── is_primary (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Testing Checklist
- [ ] Environment variables set
- [ ] Database migration completed
- [ ] R2 credentials working
- [ ] ImageKit endpoint configured
- [ ] Supabase connection successful
- [ ] File upload works
- [ ] Images appear in database
- [ ] Transformed URLs load correctly

## Debugging Tips
```typescript
// Test R2
console.log(await generatePresignedUrl('test.jpg'));

// Test ImageKit
console.log(getThumbnail('https://example.com/image.jpg'));

// Test Supabase
console.log(await getAttractionImages('test-id'));

// Monitor uploads
onUploadSuccess={(data) => console.log('Success:', data)}
onUploadError={(err) => console.error('Error:', err.message)}
```

## Performance Tips
- Use ImageKit URLs in production (free CDN)
- Load images lazily with `loading="lazy"`
- Use `getSrcSet()` for responsive images
- Cache image URLs in your app state
- Set image dimensions to prevent layout shift

## Security Notes
- Presigned URLs expire in 1 hour
- Validate file types on frontend and backend
- Use environment variables for secrets
- Enable Supabase RLS
- Don't expose R2 access keys to frontend

## Cost Monitoring
- Monitor R2 bucket size in Cloudflare Dashboard
- Check ImageKit bandwidth in ImageKit Dashboard
- Monitor Supabase database size in Supabase
- All free tier until you exceed limits
- Total cost: **$0/month** for free tier
