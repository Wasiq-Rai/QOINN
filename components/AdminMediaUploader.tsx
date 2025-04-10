// components/AdminMediaUploader.tsx
"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { uploadMedia } from '@/utils/api';

interface MediaUploaderProps {
  initialMediaUrl: string;
  mediaType: 'image' | 'video';
  isAdmin: boolean;
}

const AdminMediaUploader = ({ initialMediaUrl, mediaType, isAdmin }: MediaUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialMediaUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type and size
      if (mediaType === 'image' && !selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      if (mediaType === 'video' && !selectedFile.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }

      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        setError('File size must be less than 50MB');
        return;
      }

      setError(null);
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
       
    setIsUploading(true);
    setError(null);
    
    try {
      const response = await uploadMedia(file, mediaType);
      const data = await response;
      setPreviewUrl(data.mediaUrl);
      setFile(null); // Clear selected file after successful upload
      setError(null);

    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload media. Please try again.');
    }
    finally {
        setIsUploading(false);
    }
  };

  // Update preview when file changes
  useEffect(() => {
    if (!file) return;
    
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="space-y-4">
      {/* Media Display */}
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
        {mediaType === 'image' ? (
          <img
            src={previewUrl}
            alt="Uploaded content"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={previewUrl}
            controls
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="mediaUpload"
              accept={mediaType === 'image' ? 'image/*' : 'video/*'}
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="mediaUpload"
              className="flex-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer text-center"
            >
              Choose {mediaType === 'image' ? 'Image' : 'Video'}
            </label>
            
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {file && (
            <div className="text-sm text-gray-600">
              Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMediaUploader;