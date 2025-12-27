import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { 
  generatePresignedUrl, 
  validateImageFile, 
  getPublicImageUrl,
  generateStorageKey 
} from '../services/r2Service';
import { 
  getThumbnail, 
  getMobileHero, 
  getDesktopHero 
} from '../services/imageKitService';
import { saveAttractionImage } from '../services/supabaseService';

interface ImageUploadProps {
  attractionId: string;
  onUploadSuccess?: (imageData: any) => void;
  onUploadError?: (error: Error) => void;
  maxFiles?: number;
}

interface UploadProgress {
  [key: string]: {
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
  };
}

/**
 * ImageUploadComponent
 * 
 * Handles the complete image upload flow:
 * 1. Request presigned URL from backend
 * 2. Upload file directly to Cloudflare R2
 * 3. Save metadata to Supabase
 * 4. Transform images with ImageKit
 */
export const ImageUploadComponent: React.FC<ImageUploadProps> = ({
  attractionId,
  onUploadSuccess,
  onUploadError,
  maxFiles = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const filesToUpload = Array.from(files).slice(0, maxFiles);

      for (const file of filesToUpload) {
        await uploadSingleFile(file);
      }
    },
    [attractionId, maxFiles]
  );

  /**
   * Upload a single file through the complete pipeline
   */
  const uploadSingleFile = async (file: File) => {
    const fileId = `${Date.now()}-${file.name}`;

    try {
      // Initialize progress tracking
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 0, status: 'pending' },
      }));

      // 1. Validate file
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 10, status: 'uploading' },
      }));

      validateImageFile(file, 50); // Max 50MB

      // 2. Generate storage key and get presigned URL
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 20, status: 'uploading' },
      }));

      const storageKey = generateStorageKey(file.name);
      const presignedUrl = await generatePresignedUrl(
        file.name,
        file.type,
        3600 // 1 hour expiration
      );

      // 3. Upload directly to R2
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 30, status: 'uploading' },
      }));

      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 70) / (progressEvent.total || 1)
          );
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: { 
              progress: 30 + Math.min(percentCompleted, 70), 
              status: 'uploading' 
            },
          }));
        },
      });

      // 4. Get public URL
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 85, status: 'uploading' },
      }));

      const publicImageUrl = getPublicImageUrl(storageKey);

      // 5. Generate transformed URLs
      const thumbnailUrl = getThumbnail(publicImageUrl);
      const mobileHeroUrl = getMobileHero(publicImageUrl);
      const desktopHeroUrl = getDesktopHero(publicImageUrl);

      // 6. Save metadata to Supabase
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 95, status: 'uploading' },
      }));

      const savedImage = await saveAttractionImage(
        attractionId,
        storageKey,
        publicImageUrl,
        thumbnailUrl,
        mobileHeroUrl,
        desktopHeroUrl,
        false // Not primary initially
      );

      // 7. Mark as success
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 100, status: 'success' },
      }));

      // Callback
      if (onUploadSuccess) {
        onUploadSuccess(savedImage);
      }

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setUploadProgress((prev) => {
          const updated = { ...prev };
          delete updated[fileId];
          return updated;
        });
      }, 3000);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { 
          progress: 0, 
          status: 'error',
          error: err.message 
        },
      }));

      if (onUploadError) {
        onUploadError(err);
      }

      // Auto-remove error after 5 seconds
      setTimeout(() => {
        setUploadProgress((prev) => {
          const updated = { ...prev };
          delete updated[fileId];
          return updated;
        });
      }, 5000);
    }
  };

  /**
   * Handle drag and drop
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const hasActiveUploads = Object.values(uploadProgress).some(
    (p) => p.status === 'uploading'
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            hasActiveUploads
              ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/20'
              : 'border-slate-300 dark:border-slate-600 hover:border-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-900/10'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          disabled={hasActiveUploads}
          className="hidden"
        />

        <Upload className="mx-auto mb-3 text-slate-600 dark:text-slate-400" size={32} />
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Drop images here or click to select
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
          PNG, JPG, WebP or AVIF • Max 50MB each • Up to {maxFiles} images
        </p>
      </div>

      {/* Upload Progress Items */}
      <div className="mt-4 space-y-2">
        {Object.entries(uploadProgress).map(([fileId, upload]) => (
          <div
            key={fileId}
            className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {fileId.split('-').pop()}
              </span>
              {upload.status === 'uploading' && (
                <Loader2 className="text-teal-500 animate-spin" size={16} />
              )}
              {upload.status === 'success' && (
                <CheckCircle className="text-green-500" size={16} />
              )}
              {upload.status === 'error' && (
                <AlertCircle className="text-red-500" size={16} />
              )}
            </div>

            {upload.status !== 'error' && (
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    upload.status === 'success'
                      ? 'bg-green-500'
                      : 'bg-teal-500'
                  }`}
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
            )}

            {upload.error && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                {upload.error}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-900 dark:text-blue-200">
          <strong>How it works:</strong> Images are uploaded directly to Cloudflare R2 
          and automatically optimized with ImageKit for all devices.
        </p>
      </div>
    </div>
  );
};

export default ImageUploadComponent;
