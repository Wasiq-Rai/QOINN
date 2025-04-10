// components/CustomImageUpload.tsx
import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';

interface CustomImageUploadProps {
  src?: string | null;
  alt: string;
  defaultImage: string;
  onImageUpload: (file: File) => Promise<void>;
  className?: string;
}

export default function CustomImageUpload({
  src,
  alt,
  defaultImage,
  onImageUpload,
  className = '',
}: CustomImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Basic validation
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await onImageUpload(file);
      } catch (err) {
        setError('Failed to upload image');
        console.error('Upload error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        onClick={handleImageClick}
        className="cursor-pointer relative group"
      >
        <Image
          src={src || defaultImage}
          alt={alt}
          width={200}
          height={200}
          className="rounded-lg object-cover"
          priority
        />
        
        {/* Upload overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isLoading ? 'Uploading...' : 'Change Image'}
          </span>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isLoading}
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}