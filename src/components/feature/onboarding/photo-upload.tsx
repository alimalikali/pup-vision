'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, X, Camera } from 'lucide-react';
import Image from 'next/image';

interface PhotoUploadProps {
  onNext: (data: { photos: string[] }) => void;
  initialData?: { photos?: string[] };
}

export function PhotoUpload({ onNext, initialData = {} }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>(initialData.photos || []);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      // In a real app, you would upload to a storage service
      // For now, we'll create mock URLs
      const newPhotos = Array.from(files).map(() => {
        // Create a mock URL for demonstration
        return `/placeholder-${Math.random() > 0.5 ? 'user' : 'professional'}.jpg`;
      });

      setPhotos(prev => [...prev, ...newPhotos]);
    } catch (error) {
      console.error('Photo upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ photos });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Add Your Photos</h2>
        <p className="text-muted-foreground">Help others get to know you better with some great photos</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label>Profile Photos</Label>

          {/* Photo Grid */}
          <div className="grid grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image src={photo} alt={`Photo ${index + 1}`} fill className="object-cover" />
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemovePhoto(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Main</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Upload Button */}
            {photos.length < 6 && (
              <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center justify-center h-full min-h-[120px] space-y-2">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                    <Label htmlFor="photo-upload" className="cursor-pointer text-center">
                      <div className="text-sm font-medium text-muted-foreground">Add Photo</div>
                      <div className="text-xs text-muted-foreground">{photos.length}/6 photos</div>
                    </Label>
                    <Input id="photo-upload" type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" disabled={isUploading} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Upload Instructions */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Add at least 1 photo to continue</p>
            <p>• First photo will be your main profile picture</p>
            <p>• You can add up to 6 photos</p>
            <p>• Supported formats: JPG, PNG, WebP</p>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={photos.length === 0 || isUploading}>
          {isUploading ? 'Uploading...' : 'Complete Profile'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
