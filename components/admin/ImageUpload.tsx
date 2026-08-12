'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: 'products' | 'gallery' | 'pages' | 'misc' | 'books';
  label?: string;
}

export default function ImageUpload({ value, onChange, folder = 'misc', label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Only JPEG, PNG, WebP, and GIF images are allowed');
      return;
    }

    // Validate file size (8MB)
    if (file.size > 8 * 1024 * 1024) {
      setError('File size must be less than 8MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onChange(data.url);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    // If it's a MongoDB stored upload, delete it
    if (value.startsWith('/api/uploads/')) {
      try {
        await fetch(value, { method: 'DELETE' });
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }

    onChange('');
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-900">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative inline-block">
          <div className="relative w-48 h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Upload preview"
              fill
              className="object-cover"
              unoptimized={value.startsWith('/api/uploads/')}
            />
          </div>
          <div className="mt-2 flex gap-2">
            <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
              Replace
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mb-3"></div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, WebP or GIF (Max 8MB)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
