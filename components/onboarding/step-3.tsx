"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Heart } from "lucide-react"

interface OnboardingStep3Props {
  onNext: (data: any) => void
}

export function OnboardingStep3({ onNext }: OnboardingStep3Props) {
  const [formData, setFormData] = useState({
    lookingFor: "",
    ageRange: { min: "", max: "" },
    religion: "",
    interests: [] as string[],
    lifestyle: {
      smoking: "",
      drinking: "",
      exercise: "",
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleInterestToggle = (interest: string) => {
    const updatedInterests = formData.interests.includes(interest)
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest]
    setFormData({ ...formData, interests: updatedInterests })
  }

  const interests = [
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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center">
          <Heart className="mr-2 h-6 w-6 text-primary" />
          Your Preferences
        </h2>
        <p className="text-muted-foreground">Tell us what you're looking for in a partner</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="lookingFor">What are you looking for?</Label>
          <Select value={formData.lookingFor} onValueChange={(value) => handleInputChange("lookingFor", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="serious-relationship">Serious Relationship</SelectItem>
              <SelectItem value="marriage">Marriage</SelectItem>
              <SelectItem value="long-term-partnership">Long-term Partnership</SelectItem>
              <SelectItem value="companionship">Companionship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Preferred Age Range</Label>
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={formData.ageRange.min}
              onValueChange={(value) => handleInputChange("ageRange", { ...formData.ageRange, min: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Min age" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 43 }, (_, i) => i + 18).map((age) => (
                  <SelectItem key={age} value={age.toString()}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={formData.ageRange.max}
              onValueChange={(value) => handleInputChange("ageRange", { ...formData.ageRange, max: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Max age" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 43 }, (_, i) => i + 18).map((age) => (
                  <SelectItem key={age} value={age.toString()}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="religion">Religion (Optional)</Label>
          <Select value={formData.religion} onValueChange={(value) => handleInputChange("religion", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select religion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="christian">Christian</SelectItem>
              <SelectItem value="muslim">Muslim</SelectItem>
              <SelectItem value="jewish">Jewish</SelectItem>
              <SelectItem value="hindu">Hindu</SelectItem>
              <SelectItem value="buddhist">Buddhist</SelectItem>
              <SelectItem value="sikh">Sikh</SelectItem>
              <SelectItem value="atheist">Atheist</SelectItem>
              <SelectItem value="agnostic">Agnostic</SelectItem>
              <SelectItem value="spiritual">Spiritual</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Interests (Select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interests.map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={interest}
                  checked={formData.interests.includes(interest)}
                  onCheckedChange={() => handleInterestToggle(interest)}
                />
                <Label htmlFor={interest} className="text-sm">
                  {interest}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lifestyle Preferences</CardTitle>
            <CardDescription>Optional preferences for lifestyle compatibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Smoking</Label>
                <Select
                  value={formData.lifestyle.smoking}
                  onValueChange={(value) => handleInputChange("lifestyle", { ...formData.lifestyle, smoking: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="occasionally">Occasionally</SelectItem>
                    <SelectItem value="regularly">Regularly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Drinking</Label>
                <Select
                  value={formData.lifestyle.drinking}
                  onValueChange={(value) => handleInputChange("lifestyle", { ...formData.lifestyle, drinking: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="socially">Socially</SelectItem>
                    <SelectItem value="regularly">Regularly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exercise</Label>
                <Select
                  value={formData.lifestyle.exercise}
                  onValueChange={(value) => handleInputChange("lifestyle", { ...formData.lifestyle, exercise: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="occasionally">Occasionally</SelectItem>
                    <SelectItem value="regularly">Regularly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
