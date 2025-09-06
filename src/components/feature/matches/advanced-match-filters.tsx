"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Alcohol,
  Drugs,
  Education,
  Gender,
  Interest,
  Language,
  LookingFor,
  MaritalStatus,
  Personality,
  Politics,
  Profession,
  PurposeArchetype,
  PurposeDomain,
  PurposeModality,
  Religion,
  Smoke
} from "@/types/enums"
import { Filter, RotateCcw, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export interface AdvancedFilters {
  // Basic Info
  gender?: string[]
  ageRange?: { min: number; max: number }
  incomeRange?: { min: number; max: number }
  religion?: string[]
  education?: string[]
  profession?: string[]
  maritalStatus?: string[]
  lookingFor?: string[]
  
  // Purpose
  purposeDomain?: string[]
  purposeArchetype?: string[]
  purposeModality?: string[]
  
  // Location
  country?: string[]
  state?: string[]
  city?: string[]
  
  // Physical
  heightRange?: { min: number; max: number }
  weightRange?: { min: number; max: number }
  
  // Lifestyle
  smoke?: string[]
  alcohol?: string[]
  drugs?: string[]
  language?: string[]
  politics?: string[]
  personality?: string[]
  interests?: string[]
}

interface AdvancedMatchFiltersProps {
  filters: AdvancedFilters
  onFiltersChange: (filters: AdvancedFilters) => void
  className?: string
}

// Helper function to get enum values as options
const getEnumOptions = (enumObj: Record<string, string>) => 
  Object.values(enumObj).map(value => ({ value, label: value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) }))

// Predefined options for countries and states (you can expand this)
const COUNTRIES = [
  { value: "Pakistan", label: "Pakistan" },
  { value: "India", label: "India" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Other", label: "Other" }
]

const PAKISTAN_STATES = [
  { value: "Punjab", label: "Punjab" },
  { value: "Sindh", label: "Sindh" },
  { value: "Khyber Pakhtunkhwa", label: "Khyber Pakhtunkhwa" },
  { value: "Balochistan", label: "Balochistan" },
  { value: "Islamabad", label: "Islamabad" },
  { value: "Azad Kashmir", label: "Azad Kashmir" },
  { value: "Gilgit-Baltistan", label: "Gilgit-Baltistan" }
]

// const INDIAN_STATES = [
//   { value: "Delhi", label: "Delhi" },
//   { value: "Mumbai", label: "Mumbai" },
//   { value: "Bangalore", label: "Bangalore" },
//   { value: "Chennai", label: "Chennai" },
//   { value: "Kolkata", label: "Kolkata" },
//   { value: "Hyderabad", label: "Hyderabad" },
//   { value: "Pune", label: "Pune" },
//   { value: "Other", label: "Other" }
// ]

// Removed debounce hook - not needed anymore

export function AdvancedMatchFilters({ 
  filters, 
  onFiltersChange, 
  className 
}: AdvancedMatchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<AdvancedFilters>(filters)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Update local filters when parent filters change
  useEffect(() => {
    setLocalFilters(filters)
    setHasChanges(false)
  }, [filters])

  const handleMultiSelectChange = useCallback((
    field: keyof AdvancedFilters,
    value: string,
    checked: boolean
  ) => {
    const currentValues = (localFilters[field] as string[]) || []
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value)
    
    const newFilters = {
      ...localFilters,
      [field]: newValues.length > 0 ? newValues : undefined
    }
    
    setLocalFilters(newFilters)
    setHasChanges(true)
  }, [localFilters])

  const handleRangeChange = useCallback((
    field: keyof AdvancedFilters,
    values: number[]
  ) => {
    const newFilters = {
      ...localFilters,
      [field]: { min: values[0], max: values[1] }
    }
    
    setLocalFilters(newFilters)
    setHasChanges(true)
  }, [localFilters])

  const handleSingleSelectChange = useCallback((
    field: keyof AdvancedFilters,
    value: string
  ) => {
    const newFilters = {
      ...localFilters,
      [field]: value || undefined
    }
    
    setLocalFilters(newFilters)
    setHasChanges(true)
  }, [localFilters])

  const removeFilter = useCallback((field: keyof AdvancedFilters, value: string) => {
    const currentValues = (localFilters[field] as string[]) || []
    const newValues = currentValues.filter(v => v !== value)
    
    const newFilters = {
      ...localFilters,
      [field]: newValues.length > 0 ? newValues : undefined
    }
    
    setLocalFilters(newFilters)
    setHasChanges(true)
  }, [localFilters])

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).filter(value => 
      value !== undefined && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length
  }

  const handleApplyFilters = useCallback(() => {
    onFiltersChange(localFilters)
    setHasChanges(false)
  }, [localFilters, onFiltersChange])

  const handleClearAll = useCallback(() => {
    const emptyFilters: AdvancedFilters = {}
    setLocalFilters(emptyFilters)
    setHasChanges(true)
  }, [])

  const renderMultiSelect = (
    field: keyof AdvancedFilters,
    options: { value: string; label: string }[],
    title: string
  ) => {
    const selectedValues = (localFilters[field] as string[]) || []
    
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">{title}</Label>
        <div className="max-h-32 overflow-y-auto space-y-2">
          {options.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${field}-${option.value}`}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleMultiSelectChange(field, option.value, checked as boolean)
                }
              />
              <Label 
                htmlFor={`${field}-${option.value}`}
                className="text-sm cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedValues.map(value => (
              <Badge key={value} variant="secondary" className="text-xs">
                {value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                <button
                  onClick={() => removeFilter(field, value)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderRangeSlider = (
    field: keyof AdvancedFilters,
    title: string,
    min: number,
    max: number,
    step: number = 1,
    unit: string = ""
  ) => {
    const range = localFilters[field] as { min: number; max: number } | undefined
    const currentMin = range?.min || min
    const currentMax = range?.max || max

    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          {title} ({currentMin}{unit} - {currentMax}{unit})
        </Label>
        <Slider
          value={[currentMin, currentMax]}
          onValueChange={(values) => handleRangeChange(field, values)}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    )
  }

  const renderSingleSelect = (
    field: keyof AdvancedFilters,
    options: { value: string; label: string }[],
    title: string,
    placeholder: string
  ) => {
    const fieldValue = localFilters[field]
    const selectedValue = (fieldValue && typeof fieldValue === 'string') ? fieldValue : "any"

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{title}</Label>
        <Select value={selectedValue} onValueChange={(value) => handleSingleSelectChange(field, value === "any" ? "" : value)}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any {title}</SelectItem>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Filter className="mr-2 h-5 w-5" />
            Advanced Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={getActiveFiltersCount() === 0}
            >
              <RotateCcw className="mr-1 h-4 w-4" />
              Clear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderMultiSelect("gender", getEnumOptions(Gender), "Gender")}
            {renderMultiSelect("religion", getEnumOptions(Religion), "Religion")}
            {renderMultiSelect("education", getEnumOptions(Education), "Education")}
            {renderMultiSelect("profession", getEnumOptions(Profession), "Profession")}
            {renderMultiSelect("maritalStatus", getEnumOptions(MaritalStatus), "Marital Status")}
            {renderMultiSelect("lookingFor", getEnumOptions(LookingFor), "Looking For")}
          </div>

          {renderRangeSlider("ageRange", "Age", 18, 80, 1, " years")}
          {renderRangeSlider("incomeRange", "Monthly Income", 0, 500000, 5000, " PKR")}
        </div>

        <Separator />

        {/* Purpose & Values */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Purpose & Values</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderMultiSelect("purposeDomain", getEnumOptions(PurposeDomain), "Purpose Domain")}
            {renderMultiSelect("purposeArchetype", getEnumOptions(PurposeArchetype), "Purpose Archetype")}
            {renderMultiSelect("purposeModality", getEnumOptions(PurposeModality), "Purpose Modality")}
          </div>
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderMultiSelect("country", COUNTRIES, "Country")}
            {renderSingleSelect("state", PAKISTAN_STATES, "State", "Select State")}
            <div className="space-y-2">
              <Label className="text-sm font-medium">City</Label>
              <Input
                placeholder="Enter city name"
                value={(localFilters.city as string[])?.join(", ") || ""}
                onChange={(e) => {
                  const cities = e.target.value.split(",").map(c => c.trim()).filter(c => c)
                  const newFilters = {
                    ...localFilters,
                    city: cities.length > 0 ? cities : undefined
                  }
                  setLocalFilters(newFilters)
                  setHasChanges(true)
                }}
              />
            </div>
          </div>
        </div>

        {isExpanded && (
          <>
            <Separator />

            {/* Physical Attributes */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Physical Attributes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderRangeSlider("heightRange", "Height", 120, 220, 1, " cm")}
                {renderRangeSlider("weightRange", "Weight", 30, 150, 1, " kg")}
              </div>
            </div>

            <Separator />

            {/* Lifestyle */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Lifestyle</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMultiSelect("smoke", getEnumOptions(Smoke), "Smoking")}
                {renderMultiSelect("alcohol", getEnumOptions(Alcohol), "Alcohol")}
                {renderMultiSelect("drugs", getEnumOptions(Drugs), "Drugs")}
                {renderMultiSelect("language", getEnumOptions(Language), "Language")}
                {renderMultiSelect("politics", getEnumOptions(Politics), "Political Views")}
                {renderMultiSelect("personality", getEnumOptions(Personality), "Personality")}
              </div>
            </div>

            <Separator />

            {/* Interests */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Interests</h3>
              {renderMultiSelect("interests", getEnumOptions(Interest), "Interests")}
            </div>
          </>
        )}

        {/* Apply Button */}
        {hasChanges && (
          <div className="pt-4 border-t">
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setLocalFilters(filters)
                  setHasChanges(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="bg-primary hover:bg-primary/90"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
