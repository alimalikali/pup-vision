"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Profile } from "@/types/types"
import { Interest, Politics } from "@/types/enums"
import { AlertCircle } from "lucide-react"
import React from "react"

interface Step4LifestyleProps {
  formData: Partial<Profile>
  errors: Record<string, string>
  onInputChange: (fieldName: string, value: string | number | string[]) => void
}

export function Step4Lifestyle({ formData, errors, onInputChange }: Step4LifestyleProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Interests */}
      <div className="md:col-span-2 space-y-2">
        <Label>Interests</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "SPORTS", label: "Sports" },
            { value: "MUSIC", label: "Music" },
            { value: "TRAVEL", label: "Travel" },
            { value: "READING", label: "Reading" },
            { value: "COOKING", label: "Cooking" },
            { value: "ART", label: "Art" },
            { value: "TECHNOLOGY", label: "Technology" },
            { value: "OTHER", label: "Other" }
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`interests-${option.value}`}
                checked={Array.isArray(formData.interests) && formData.interests.includes(option.value as Interest)}
                onCheckedChange={(checked) => {
                  const currentValues = Array.isArray(formData.interests) ? formData.interests : []
                  if (checked) {
                    onInputChange("interests", [...currentValues, option.value as Interest])
                  } else {
                    onInputChange("interests", currentValues.filter((v: Interest) => v !== option.value))
                  }
                }}
              />
              <Label htmlFor={`interests-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        {errors.interests && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.interests}</span>
          </div>
        )}
      </div>

      {/* Personality */}
      <div className="space-y-2">
        <Label>Personality Type</Label>
        <RadioGroup
          value={formData.personality || ""}
          onValueChange={(value) => onInputChange("personality", value)}
        >
          {[
            { value: "INTROVERT", label: "Introvert" },
            { value: "EXTROVERT", label: "Extrovert" },
            { value: "AMBIVERT", label: "Ambivert" }
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`personality-${option.value}`} />
              <Label htmlFor={`personality-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {errors.personality && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.personality}</span>
          </div>
        )}
      </div>

      {/* Marital Status */}
      <div className="space-y-2">
        <Label htmlFor="maritalStatus">Marital Status</Label>
        <Select value={formData.maritalStatus || ""} onValueChange={(value) => onInputChange("maritalStatus", value)}>
          <SelectTrigger className={errors.maritalStatus ? "border-red-500" : ""}>
            <SelectValue placeholder="Select marital status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SINGLE">Single</SelectItem>
            <SelectItem value="MARRIED">Married</SelectItem>
            <SelectItem value="DIVORCED">Divorced</SelectItem>
            <SelectItem value="WIDOWED">Widowed</SelectItem>
          </SelectContent>
        </Select>
        {errors.maritalStatus && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.maritalStatus}</span>
          </div>
        )}
      </div>

      {/* Looking For */}
      <div className="space-y-2">
        <Label htmlFor="lookingFor">Looking For</Label>
        <Select value={formData.lookingFor || ""} onValueChange={(value) => onInputChange("lookingFor", value)}>
          <SelectTrigger className={errors.lookingFor ? "border-red-500" : ""}>
            <SelectValue placeholder="Select what you're looking for" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SINGLE">Single</SelectItem>
            <SelectItem value="MARRIED">Married</SelectItem>
            <SelectItem value="DIVORCED">Divorced</SelectItem>
            <SelectItem value="WIDOWED">Widowed</SelectItem>
          </SelectContent>
        </Select>
        {errors.lookingFor && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.lookingFor}</span>
          </div>
        )}
      </div>

      {/* Height */}
      <div className="space-y-2">
        <Label htmlFor="height">Height (cm)</Label>
        <Input
          id="height"
          type="number"
          placeholder="Enter your height in centimeters"
          value={formData.height || ""}
          onChange={(e) => onInputChange("height", e.target.value)}
          className={errors.height ? "border-red-500" : ""}
        />
        {errors.height && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.height}</span>
          </div>
        )}
      </div>

      {/* Weight */}
      <div className="space-y-2">
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          placeholder="Enter your weight in kilograms"
          value={formData.weight || ""}
          onChange={(e) => onInputChange("weight", e.target.value)}
          className={errors.weight ? "border-red-500" : ""}
        />
        {errors.weight && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.weight}</span>
          </div>
        )}
      </div>

      {/* Smoking */}
      <div className="space-y-2">
        <Label htmlFor="smoke">Smoking</Label>
        <Select value={formData.smoke || ""} onValueChange={(value) => onInputChange("smoke", value)}>
          <SelectTrigger className={errors.smoke ? "border-red-500" : ""}>
            <SelectValue placeholder="Select smoking preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="YES">Yes</SelectItem>
            <SelectItem value="NO">No</SelectItem>
            <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
          </SelectContent>
        </Select>
        {errors.smoke && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.smoke}</span>
          </div>
        )}
      </div>

      {/* Alcohol */}
      <div className="space-y-2">
        <Label htmlFor="alcohol">Alcohol</Label>
        <Select value={formData.alcohol || ""} onValueChange={(value) => onInputChange("alcohol", value)}>
          <SelectTrigger className={errors.alcohol ? "border-red-500" : ""}>
            <SelectValue placeholder="Select alcohol preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="YES">Yes</SelectItem>
            <SelectItem value="NO">No</SelectItem>
            <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
          </SelectContent>
        </Select>
        {errors.alcohol && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.alcohol}</span>
          </div>
        )}
      </div>

      {/* Drugs */}
      <div className="space-y-2">
        <Label htmlFor="drugs">Drugs</Label>
        <Select value={formData.drugs || ""} onValueChange={(value) => onInputChange("drugs", value)}>
          <SelectTrigger className={errors.drugs ? "border-red-500" : ""}>
            <SelectValue placeholder="Select drug preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="YES">Yes</SelectItem>
            <SelectItem value="NO">No</SelectItem>
            <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
          </SelectContent>
        </Select>
        {errors.drugs && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.drugs}</span>
          </div>
        )}
      </div>

      {/* Political Views */}
      <div className="md:col-span-2 space-y-2">
        <Label>Political Views</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "LEFT", label: "Left" },
            { value: "RIGHT", label: "Right" },
            { value: "CENTER", label: "Center" },
            { value: "LIBERTARIAN", label: "Libertarian" },
            { value: "FUNDAMENTALIST", label: "Fundamentalist" },
            { value: "CONSERVATIVE", label: "Conservative" },
            { value: "OTHER", label: "Other" }
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`politics-${option.value}`}
                checked={Array.isArray(formData.politics) && formData.politics.includes(option.value as Politics)}
                onCheckedChange={(checked) => {
                  const currentValues = Array.isArray(formData.politics) ? formData.politics : []
                  if (checked) {
                    onInputChange("politics", [...currentValues, option.value as Politics])
                  } else {
                    onInputChange("politics", currentValues.filter((v: Politics) => v !== option.value))
                  }
                }}
              />
              <Label htmlFor={`politics-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        {errors.politics && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.politics}</span>
          </div>
        )}
      </div>
    </div>
  )
}
