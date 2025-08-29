"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Camera, Check } from "lucide-react"

interface OnboardingStep4Props {
  onNext: (data: any) => void
}

export function OnboardingStep4({ onNext }: OnboardingStep4Props) {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ photos: uploadedPhotos })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mock photo upload - in real app would handle file upload
    const mockPhotoUrl = `/professional-${Math.random() > 0.5 ? "man" : "woman-smiling"}.png`
    setUploadedPhotos([...uploadedPhotos, mockPhotoUrl])
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center">
          <Camera className="mr-2 h-6 w-6 text-primary" />
          Add Your Photos
        </h2>
        <p className="text-muted-foreground">Upload photos that represent the real you</p>
      </div>

      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Photo Guidelines</CardTitle>
          <CardDescription>
            • Use recent, clear photos of yourself • Include at least one face photo • Show your personality and
            interests • All photos are verified for authenticity
          </CardDescription>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="aspect-square">
              <CardContent className="p-4 h-full flex items-center justify-center">
                {uploadedPhotos[index] ? (
                  <div className="relative w-full h-full">
                    <img
                      src={uploadedPhotos[index] || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <Label
                      htmlFor={`photo-${index}`}
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    >
                      {index === 0 ? "Main Photo" : `Photo ${index + 1}`}
                    </Label>
                    <input
                      id={`photo-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Upload at least 2 photos to continue. You can add more later.</p>
        </div>

        <Button type="submit" className="w-full" disabled={uploadedPhotos.length < 2}>
          Complete Profile Setup
          <Check className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
