"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"
import React from "react"

interface Step3PurposeProps {
  formData: any
  errors: Record<string, string>
  onInputChange: (fieldName: string, value: any) => void
}

export function Step3Purpose({ formData, errors, onInputChange }: Step3PurposeProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Purpose Domain */}
      <div className="space-y-2">
        <Label htmlFor="purposeDomain">Purpose Domain</Label>
        <Select value={formData.purposeDomain || ""} onValueChange={(value) => onInputChange("purposeDomain", value)}>
          <SelectTrigger className={errors.purposeDomain ? "border-red-500" : ""}>
            <SelectValue placeholder="Select purpose domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SOCIAL">Social Impact</SelectItem>
            <SelectItem value="ENVIRONMENTAL">Environmental</SelectItem>
            <SelectItem value="TECHNOLOGICAL">Technological</SelectItem>
            <SelectItem value="EDUCATIONAL">Educational</SelectItem>
            <SelectItem value="RELIGIOUS">Religious</SelectItem>
            <SelectItem value="PERSONAL">Personal Growth</SelectItem>
          </SelectContent>
        </Select>
        {errors.purposeDomain && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.purposeDomain}</span>
          </div>
        )}
      </div>

      {/* Purpose Archetype */}
      <div className="space-y-2">
        <Label htmlFor="purposeArchetype">Purpose Archetype</Label>
        <Select value={formData.purposeArchetype || ""} onValueChange={(value) => onInputChange("purposeArchetype", value)}>
          <SelectTrigger className={errors.purposeArchetype ? "border-red-500" : ""}>
            <SelectValue placeholder="Select purpose archetype" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LEADER">Leader</SelectItem>
            <SelectItem value="CREATOR">Creator</SelectItem>
            <SelectItem value="HEALER">Healer</SelectItem>
            <SelectItem value="EXPLORER">Explorer</SelectItem>
            <SelectItem value="ADVOCATE">Advocate</SelectItem>
            <SelectItem value="VISIONARY">Visionary</SelectItem>
          </SelectContent>
        </Select>
        {errors.purposeArchetype && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.purposeArchetype}</span>
          </div>
        )}
      </div>

      {/* Purpose Modality */}
      <div className="space-y-2">
        <Label htmlFor="purposeModality">Purpose Modality</Label>
        <Select value={formData.purposeModality || ""} onValueChange={(value) => onInputChange("purposeModality", value)}>
          <SelectTrigger className={errors.purposeModality ? "border-red-500" : ""}>
            <SelectValue placeholder="Select purpose modality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
            <SelectItem value="COMMUNITY">Community</SelectItem>
            <SelectItem value="GLOBAL">Global</SelectItem>
          </SelectContent>
        </Select>
        {errors.purposeModality && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.purposeModality}</span>
          </div>
        )}
      </div>

      {/* Purpose Narrative - Full width */}
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="purposeNarrative">Purpose Narrative</Label>
        <Textarea
          id="purposeNarrative"
          placeholder="Tell us about your life purpose and what drives you..."
          value={formData.purposeNarrative || ""}
          onChange={(e) => onInputChange("purposeNarrative", e.target.value)}
          rows={4}
          className={errors.purposeNarrative ? "border-red-500" : ""}
        />
        {errors.purposeNarrative && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.purposeNarrative}</span>
          </div>
        )}
      </div>
    </div>
  )
}
