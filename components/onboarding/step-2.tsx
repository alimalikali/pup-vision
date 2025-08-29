"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Target } from "lucide-react"

interface OnboardingStep2Props {
  onNext: (data: any) => void
}

export function OnboardingStep2({ onNext }: OnboardingStep2Props) {
  const [formData, setFormData] = useState({
    domain: "",
    archetype: "",
    modality: "",
    narrative: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const domains = [
    "Technology & Innovation",
    "Healthcare & Wellness",
    "Education & Learning",
    "Arts & Creativity",
    "Business & Entrepreneurship",
    "Social Impact & Advocacy",
    "Science & Research",
    "Finance & Investment",
    "Environment & Sustainability",
    "Sports & Fitness",
  ]

  const archetypes = [
    "The Creator",
    "The Innovator",
    "The Healer",
    "The Teacher",
    "The Leader",
    "The Advocate",
    "The Explorer",
    "The Nurturer",
    "The Strategist",
    "The Connector",
  ]

  const modalities = [
    "Collaborative",
    "Analytical",
    "Empathetic",
    "Strategic",
    "Creative",
    "Systematic",
    "Intuitive",
    "Practical",
    "Visionary",
    "Methodical",
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center">
          <Target className="mr-2 h-6 w-6 text-primary" />
          Your Purpose
        </h2>
        <p className="text-muted-foreground">Help us understand what drives you and gives your life meaning</p>
      </div>

      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Why Purpose Matters</CardTitle>
          <CardDescription>
            Our matching algorithm prioritizes purpose alignment because shared values and life direction create
            stronger, more meaningful relationships than surface-level compatibility alone.
          </CardDescription>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="domain">Purpose Domain</Label>
          <Select value={formData.domain} onValueChange={(value) => handleInputChange("domain", value)}>
            <SelectTrigger>
              <SelectValue placeholder="What field or area drives your passion?" />
            </SelectTrigger>
            <SelectContent>
              {domains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="archetype">Your Archetype</Label>
          <Select value={formData.archetype} onValueChange={(value) => handleInputChange("archetype", value)}>
            <SelectTrigger>
              <SelectValue placeholder="How do you see yourself in your purpose?" />
            </SelectTrigger>
            <SelectContent>
              {archetypes.map((archetype) => (
                <SelectItem key={archetype} value={archetype}>
                  {archetype}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="modality">Your Approach</Label>
          <Select value={formData.modality} onValueChange={(value) => handleInputChange("modality", value)}>
            <SelectTrigger>
              <SelectValue placeholder="How do you typically approach your work and goals?" />
            </SelectTrigger>
            <SelectContent>
              {modalities.map((modality) => (
                <SelectItem key={modality} value={modality}>
                  {modality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="narrative">Your Purpose Narrative</Label>
          <Textarea
            id="narrative"
            placeholder="Describe what drives you, what impact you want to make, and what gives your life meaning..."
            value={formData.narrative}
            onChange={(e) => handleInputChange("narrative", e.target.value)}
            rows={4}
            required
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
