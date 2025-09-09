'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Star, Camera } from 'lucide-react';
import Image from 'next/image';

interface PhotoGalleryProps {
  avatar?: string | null;
  onAvatarChange?: (avatarUrl: string) => void;
}

export function PhotoGallery({ avatar, onAvatarChange }: PhotoGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);

      try {
        // For now, we'll create a mock upload by reading the file as data URL
        // In a real app, you'd upload to your server/cloud storage
        const reader = new FileReader();
        reader.onload = e => {
          const result = e.target?.result as string;
          if (result && onAvatarChange) {
            onAvatarChange(result);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Failed to upload photo:', error);
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  const handlePhotoRemove = () => {
    if (onAvatarChange) {
      onAvatarChange('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile Photo</CardTitle>
          <Button onClick={handlePhotoUpload} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Change Photo'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Photo Display */}
          <div className="flex justify-center">
            <div className="relative">
              {avatar ? (
                <div className="relative group">
                  <Image src={avatar} alt="Profile Photo" className="w-48 h-48 object-cover rounded-lg border-2 border-border" width={192} height={192} />
                  <Badge className="absolute top-2 left-2 bg-primary">
                    <Star className="mr-1 h-3 w-3" />
                    Main Photo
                  </Badge>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button size="sm" variant="destructive" onClick={handlePhotoRemove} className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-48 h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors" onClick={handlePhotoUpload}>
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No photo uploaded</p>
                    <p className="text-xs text-muted-foreground mt-1">Click to upload</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Photo Guidelines */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Photo Guidelines:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Upload a clear, recent photo of yourself</li>
              <li>Use a high-quality image (minimum 400x400 pixels)</li>
              <li>Ensure good lighting and a neutral background</li>
              <li>Show your face clearly without sunglasses or hats</li>
              <li>Keep it professional and appropriate</li>
            </ul>
          </div>

          {/* Upload Status */}
          {isUploading && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Processing your photo...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
