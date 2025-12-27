import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { 
  uploadToSupabaseStorage, 
  validateImageFile, 
  getThumbnailUrl,
  getMobileHeroUrl,
  getDesktopHeroUrl 
} from '../services/supabaseStorageService';
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
 * Handles the complete image upload flow using Supabase Storage:
 * 1. Validate file locally
 * 2. Upload file to Supabase Storage (hotel-photos bucket)
 * 3. Get public URL with transformations
 * 4. Save metadata to database
 * 
 * ✅ No credit card needed - Supabase Storage is completely free!
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
      setIsUploading(true);

      // 1. Validate file
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 10, status: 'uploading' },
      }));

      validateImageFile(file);

      // 2. Upload to Supabase Storage
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 30, status: 'uploading' },
      }));

      const { publicUrl, storagePath } = await uploadToSupabaseStorage(
        file,
        attractionId
      );

      // 3. Generate transformed URLs
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 70, status: 'uploading' },
      }));

      const thumbnailUrl = getThumbnailUrl(publicUrl);
      const mobileHeroUrl = getMobileHeroUrl(publicUrl);
      const desktopHeroUrl = getDesktopHeroUrl(publicUrl);

      // 4. Save metadata to database
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 85, status: 'uploading' },
      }));

      const savedImage = await saveAttractionImage(
        attractionId,
        storagePath,
        publicUrl,
        false // Not primary initially
      );

      // 5. Mark as success
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
        setIsUploading(false);
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

      setIsUploading(false);

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
      <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
        <p className="text-xs text-green-900 dark:text-green-200">
          <strong>✅ No credit card needed!</strong> Images are uploaded directly to 
          Supabase Storage (completely free). Metadata saved to your database.
        </p>
      </div>
    </div>
  );
};

export default ImageUploadComponent;
