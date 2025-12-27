/**
 * Cloudflare R2 Service
 * Handles presigned URL generation for direct browser uploads to R2
 * Free tier: 10GB/month storage, unlimited API calls
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.VITE_R2_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.VITE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.VITE_R2_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Generate a presigned URL for direct browser upload to R2
 * Allows users to upload images directly without going through your server
 * 
 * @param fileName - Name of the file to upload
 * @param contentType - MIME type of the file (e.g., 'image/jpeg')
 * @param expirationSeconds - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Presigned URL for PUT request
 */
export const generatePresignedUrl = async (
  fileName: string,
  contentType: string = "image/jpeg",
  expirationSeconds: number = 3600
): Promise<string> => {
  try {
    // Generate a unique storage key to avoid collisions
    const timestamp = Date.now();
    const storageKey = `attractions/${timestamp}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.VITE_R2_BUCKET_NAME || "",
      Key: storageKey,
      ContentType: contentType,
      // Optional: Add metadata
      Metadata: {
        uploadedAt: new Date().toISOString(),
      },
    });

    const presignedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: expirationSeconds,
    });

    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate presigned URL");
  }
};

/**
 * Generate a unique storage key for an image
 * Use this to store in your database
 * 
 * @param fileName - Original file name
 * @returns Storage key path (e.g., 'attractions/1703688000000-taj-mahal.jpg')
 */
export const generateStorageKey = (fileName: string): string => {
  const timestamp = Date.now();
  return `attractions/${timestamp}-${fileName}`;
};

/**
 * Get the public URL for a stored image in R2
 * 
 * @param storageKey - The storage key returned from upload
 * @returns Public URL to access the image
 */
export const getPublicImageUrl = (storageKey: string): string => {
  const baseUrl = process.env.VITE_R2_PUBLIC_URL || "";
  return `${baseUrl}/${storageKey}`;
};

/**
 * Validate file before upload
 * 
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10MB)
 * @returns true if valid, throws error otherwise
 */
export const validateImageFile = (
  file: File,
  maxSizeMB: number = 10
): boolean => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  if (!allowedMimes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload JPEG, PNG, WebP, or AVIF images."
    );
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(
      `File size exceeds ${maxSizeMB}MB limit. Please compress your image.`
    );
  }

  return true;
};
