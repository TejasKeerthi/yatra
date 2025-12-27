/**
 * ImageKit.io Transformation Helper
 * Converts raw Cloudflare R2 URLs to optimized ImageKit URLs
 * Free tier: 25GB/month bandwidth
 * 
 * Transformations include:
 * - Automatic format optimization (WebP for supported browsers)
 * - Quality compression
 * - Responsive sizing
 */

const IMAGEKIT_ENDPOINT = process.env.VITE_IMAGEKIT_ENDPOINT || "";

/**
 * Build an ImageKit transformation URL
 * 
 * @param imageUrl - Original image URL (R2 or any external URL)
 * @param transformations - ImageKit transformation parameters
 * @returns Transformed URL
 */
const buildImageKitUrl = (
  imageUrl: string,
  transformations: Record<string, string | number>
): string => {
  if (!IMAGEKIT_ENDPOINT) {
    console.warn("ImageKit endpoint not configured, returning original URL");
    return imageUrl;
  }

  // Encode the image URL
  const encodedUrl = Buffer.from(imageUrl).toString("base64");

  // Build transformation string
  const transformationString = Object.entries(transformations)
    .map(([key, value]) => `${key}-${value}`)
    .join("/");

  return `${IMAGEKIT_ENDPOINT}/${transformationString}/tr:q-auto/${encodedUrl}`;
};

/**
 * Generate a thumbnail image (200x200, cropped)
 * Perfect for: listing cards, avatars, grid displays
 * 
 * @param imageUrl - Original image URL
 * @returns Optimized thumbnail URL
 * 
 * @example
 * getThumbnail('https://r2.example.com/attractions/taj-mahal.jpg')
 * // Returns ImageKit URL with 200x200 crop
 */
export const getThumbnail = (imageUrl: string): string => {
  return buildImageKitUrl(imageUrl, {
    w: 200,
    h: 200,
    c: "force", // Force crop to exact dimensions
    q: 80, // Quality
    f: "auto", // Auto format (WebP for supported browsers)
  });
};

/**
 * Generate a mobile hero image (600px width)
 * Perfect for: mobile app hero sections, detail pages on phones
 * 
 * @param imageUrl - Original image URL
 * @returns Optimized mobile hero URL
 * 
 * @example
 * getMobileHero('https://r2.example.com/attractions/taj-mahal.jpg')
 * // Returns ImageKit URL optimized for mobile (600px wide)
 */
export const getMobileHero = (imageUrl: string): string => {
  return buildImageKitUrl(imageUrl, {
    w: 600,
    h: 400,
    c: "at_max", // Fit within bounds, maintain aspect ratio
    q: 85,
    f: "auto",
    ar: "3-2", // Aspect ratio 3:2
  });
};

/**
 * Generate a desktop hero image (1200px width)
 * Perfect for: desktop hero sections, large displays, desktops
 * 
 * @param imageUrl - Original image URL
 * @returns Optimized desktop hero URL
 * 
 * @example
 * getDesktopHero('https://r2.example.com/attractions/taj-mahal.jpg')
 * // Returns ImageKit URL optimized for desktop (1200px wide)
 */
export const getDesktopHero = (imageUrl: string): string => {
  return buildImageKitUrl(imageUrl, {
    w: 1200,
    h: 600,
    c: "at_max",
    q: 90,
    f: "auto",
    ar: "2-1", // Aspect ratio 2:1
  });
};

/**
 * Generate a responsive image with multiple sizes
 * Perfect for: <picture> elements with srcset
 * 
 * @param imageUrl - Original image URL
 * @param maxWidth - Maximum width for the largest size (default: 1200)
 * @returns Object with URLs for different sizes
 */
export const getResponsiveSizes = (
  imageUrl: string,
  maxWidth: number = 1200
): {
  small: string;
  medium: string;
  large: string;
  xlarge: string;
} => {
  return {
    small: buildImageKitUrl(imageUrl, {
      w: Math.floor(maxWidth * 0.33),
      q: 75,
      f: "auto",
    }),
    medium: buildImageKitUrl(imageUrl, {
      w: Math.floor(maxWidth * 0.5),
      q: 80,
      f: "auto",
    }),
    large: buildImageKitUrl(imageUrl, {
      w: Math.floor(maxWidth * 0.75),
      q: 85,
      f: "auto",
    }),
    xlarge: buildImageKitUrl(imageUrl, {
      w: maxWidth,
      q: 90,
      f: "auto",
    }),
  };
};

/**
 * Apply custom transformations
 * For advanced use cases
 * 
 * @param imageUrl - Original image URL
 * @param width - Image width
 * @param height - Image height
 * @param quality - Quality (1-100, default: 85)
 * @param crop - Crop mode: 'force', 'at_max', 'at_least', 'maintain_ratio'
 * @returns Transformed URL
 */
export const getCustomTransform = (
  imageUrl: string,
  width?: number,
  height?: number,
  quality: number = 85,
  crop: "force" | "at_max" | "at_least" | "maintain_ratio" = "at_max"
): string => {
  const transformations: Record<string, string | number> = {
    q: quality,
    f: "auto",
  };

  if (width) transformations.w = width;
  if (height) transformations.h = height;
  if (crop) transformations.c = crop;

  return buildImageKitUrl(imageUrl, transformations);
};

/**
 * Generate image srcSet for responsive images
 * Perfect for: <img srcset="...">
 * 
 * @param imageUrl - Original image URL
 * @param widths - Array of widths to generate (default: [320, 640, 960, 1280])
 * @returns srcset string
 * 
 * @example
 * <img src={getThumbnail(url)} srcset={getSrcSet(url)} sizes="..." />
 */
export const getSrcSet = (
  imageUrl: string,
  widths: number[] = [320, 640, 960, 1280]
): string => {
  return widths
    .map((width) => {
      const url = buildImageKitUrl(imageUrl, {
        w: width,
        q: 80,
        f: "auto",
      });
      return `${url} ${width}w`;
    })
    .join(", ");
};
