"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Star } from "lucide-react"

interface PhotoGalleryProps {
  photos: string[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhotos, setSelectedPhotos] = useState(photos)

  const handlePhotoUpload = () => {
    // Mock photo upload
    const newPhoto = `/professional-${Math.random() > 0.5 ? "man" : "woman-smiling"}.png`
    setSelectedPhotos([...selectedPhotos, newPhoto])
  }

  const handlePhotoRemove = (index: number) => {
    setSelectedPhotos(selectedPhotos.filter((_, i) => i !== index))
  }

  const handleSetMain = (index: number) => {
    const newPhotos = [...selectedPhotos]
    const [mainPhoto] = newPhotos.splice(index, 1)
    setSelectedPhotos([mainPhoto, ...newPhotos])
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Photo Gallery</CardTitle>
          <Button onClick={handlePhotoUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Add Photo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="relative aspect-square">
              {selectedPhotos[index] ? (
                <div className="relative group">
                  <img
                    src={selectedPhotos[index] || "/placeholder.svg"}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 bg-primary">
                      <Star className="mr-1 h-3 w-3" />
                      Main
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                    {index !== 0 && (
                      <Button size="sm" variant="secondary" onClick={() => handleSetMain(index)}>
                        Set Main
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handlePhotoRemove(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-full border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onClick={handlePhotoUpload}
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Add Photo</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>• Upload up to 6 photos</p>
          <p>• First photo will be your main profile photo</p>
          <p>• All photos are verified for authenticity</p>
        </div>
      </CardContent>
    </Card>
  )
}
