"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Save, X } from "lucide-react"

interface ProfileEditFormProps {
  profile: any
  onSave: () => void
}

export function ProfileEditForm({ profile, onSave }: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age.toString(),
    profession: profile.profession,
    company: profile.company,
    education: profile.education,
    bio: profile.bio,
    interests: profile.interests,
    lifestyle: profile.lifestyle,
  })

  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests)

  const availableInterests = [
    "Technology",
    "Travel",
    "Cooking",
    "Reading",
    "Music",
    "Art",
    "Sports",
    "Fitness",
    "Photography",
    "Dancing",
    "Movies",
    "Gaming",
    "Hiking",
    "Yoga",
    "Meditation",
    "Volunteering",
    "Writing",
    "Learning Languages",
    "Gardening",
    "Fashion",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock save - in real app would call API
    console.log("Saving profile:", { ...formData, interests: selectedInterests })
    onSave()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const handleLifestyleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      lifestyle: { ...formData.lifestyle, [field]: value },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => handleInputChange("profession", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High School">High School</SelectItem>
                <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle>Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableInterests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={selectedInterests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <Label htmlFor={interest} className="text-sm">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Label className="text-sm font-medium">Selected Interests:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle */}
      <Card>
        <CardHeader>
          <CardTitle>Lifestyle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Smoking</Label>
              <Select
                value={formData.lifestyle.smoking}
                onValueChange={(value) => handleLifestyleChange("smoking", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Occasionally">Occasionally</SelectItem>
                  <SelectItem value="Regularly">Regularly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Drinking</Label>
              <Select
                value={formData.lifestyle.drinking}
                onValueChange={(value) => handleLifestyleChange("drinking", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Socially">Socially</SelectItem>
                  <SelectItem value="Regularly">Regularly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Exercise</Label>
              <Select
                value={formData.lifestyle.exercise}
                onValueChange={(value) => handleLifestyleChange("exercise", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Occasionally">Occasionally</SelectItem>
                  <SelectItem value="Regularly">Regularly</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onSave}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </form>
  )
}
