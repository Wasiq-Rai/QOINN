// pages/profile.tsx
'use client'
import { useState } from 'react';
import CustomImageUpload from '../components/CustomImage';
import { UploadImage } from '@/utils/api';

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await UploadImage(file);
      setProfileImage(response.imageUrl); // Update with the new image URL from Django
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile Picture</h1>
      
      <CustomImageUpload
        src={profileImage}
        alt="Profile picture"
        defaultImage="/default-profile.png"
        onImageUpload={handleImageUpload}
        className="w-48 h-48"
      />
      
      {isLoading && <p className="mt-2 text-blue-500">Uploading image...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}