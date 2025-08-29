"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"

interface OnboardingStep1Props {
  onNext: (data: any) => void
}

export function OnboardingStep1({ onNext }: OnboardingStep1Props) {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    location: "",
    profession: "",
    education: "",
    bio: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Basic Information</h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, State, Country"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profession">Profession</Label>
          <Input
            id="profession"
            placeholder="Your current job title"
            value={formData.profession}
            onChange={(e) => handleInputChange("profession", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="education">Education</Label>
          <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself in a few sentences..."
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
