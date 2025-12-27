# Environment Variables for Production-Grade Image Pipeline

## Cloudflare R2 Configuration
# Get these from Cloudflare Dashboard > R2 > API Tokens
VITE_R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
VITE_R2_BUCKET_NAME=your-bucket-name
VITE_R2_ACCESS_KEY_ID=your_access_key_id
VITE_R2_SECRET_ACCESS_KEY=your_secret_access_key
VITE_R2_PUBLIC_URL=https://images.yourdomain.com  # Your custom domain or R2 public URL

## ImageKit.io Configuration
# Get these from ImageKit Dashboard > Account > API Keys
VITE_IMAGEKIT_ENDPOINT=https://ik.imagekit.io/YOUR_PUBLIC_KEY
VITE_IMAGEKIT_PUBLIC_KEY=your_public_key
VITE_IMAGEKIT_PRIVATE_KEY=your_private_key  # Only for server-side if needed

## Supabase Configuration
# Get these from Supabase Dashboard > Settings > API
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For backend operations only

## Optional: Additional Configuration
# Maximum file size for uploads (in MB)
VITE_MAX_IMAGE_SIZE_MB=50

# Image upload timeout (in seconds)
VITE_UPLOAD_TIMEOUT=300

# CloudFlare Workers (if you want to proxy through your own domain)
VITE_CLOUDFLARE_WORKER_URL=https://images.yourdomain.com

## How to Get These Credentials

### Cloudflare R2
1. Go to https://dash.cloudflare.com
2. Click "R2" in the sidebar
3. Create a bucket (name it something like "travel-app-images")
4. Go to "API Tokens" in Account Home
5. Create token with "Edit" permissions for R2
6. Copy the endpoint, access key ID, and secret access key

### ImageKit.io
1. Go to https://imagekit.io
2. Sign up for free account (25GB/month bandwidth)
3. Go to Account > API Keys
4. Copy the Public Key and Endpoint

### Supabase
1. Go to https://supabase.com
2. Create a new project (free tier available)
3. Go to Project Settings > API
4. Copy Project URL and Anon Key
5. Run the SQL migration from migrations/001_create_attraction_images_table.sql

## Development vs Production

### .env.local (Development - Never commit!)
- Contains real credentials for local testing
- Use this file for development only
- Add to .gitignore

### .env.production
- Production credentials (use environment variables instead)
- Deploy with GitHub Actions secrets or similar

## Security Best Practices

1. **Never commit credentials** - Use .env files in .gitignore
2. **Use environment variables** in production (GitHub Actions secrets, Vercel, etc.)
3. **Rotate keys regularly** - Change R2 and ImageKit API keys quarterly
4. **Use RLS in Supabase** - Enable Row Level Security for database
5. **Validate file types** - Only allow image MIME types
6. **Set file size limits** - Prevent abuse
7. **Use presigned URLs** - Don't expose full credentials to frontend

## Testing Your Setup

### 1. Test Cloudflare R2
```bash
# This is handled by r2Service.ts
# Test by attempting an upload in the UI
```

### 2. Test ImageKit.io
```typescript
import { getThumbnail } from './services/imageKitService';

const testUrl = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80';
console.log(getThumbnail(testUrl));
// Should output ImageKit transformation URL
```

### 3. Test Supabase
```typescript
import { getAttractionImages } from './services/supabaseService';

getAttractionImages('test-attraction-id').then(console.log);
```

## Cost Breakdown (All Free Tier)

### Cloudflare R2
- **Free:** 10GB storage, unlimited API calls
- **Paid:** $0.015/GB for first 100TB/month

### ImageKit.io
- **Free:** 25GB bandwidth/month, 2GB storage
- **Paid:** $5 per 25GB additional bandwidth

### Supabase
- **Free:** 500MB database, unlimited API calls
- **Paid:** $25/month for 8GB database

**Total Monthly Cost (Free Tier):** $0 (forever!)

## Troubleshooting

### Images not uploading
- Check R2 credentials in .env
- Verify bucket name matches
- Check browser console for CORS errors
- Ensure file size < 50MB

### ImageKit URLs not transforming
- Verify VITE_IMAGEKIT_ENDPOINT is set correctly
- Check ImageKit dashboard for API key
- Test directly: https://ik.imagekit.io/PUBLIC_KEY/tr:w-200/IMAGE_URL

### Supabase queries failing
- Verify VITE_SUPABASE_URL and anon key are correct
- Check that migration was run successfully
- Verify RLS policies are set up
- Check Supabase dashboard for query errors

## Next Steps

1. ✅ Set up environment variables
2. ✅ Run Supabase migration
3. ✅ Test image upload component
4. ✅ Monitor your free tier usage
5. ✅ Implement image management dashboard (optional)
