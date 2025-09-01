import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AuthProfile } from "@/types/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEnumLabel(value: string | undefined | null): string {
  if (!value) return ''
  return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export function calculateProfileCompletion(profile: AuthProfile): number {
  if (!profile) return 0

  const requiredFields = [
    'name',
    'gender',
    'religion',
    'education',
    'profession',
    'purposeDomain',
    'purposeArchetype',
    'purposeModality',
    'interests',
    'personality',
    'maritalStatus',
    'lookingFor',
    'language',
    'smoke',
    'alcohol',
    'drugs',
    'politics'
  ]

  const optionalFields = [
    'avatar',
    'dob',
    'income',
    'lat',
    'lang',
    'city',
    'state',
    'country',
    'purposeNarrative',
    'height',
    'weight'
  ]

  let completedRequired = 0
  let completedOptional = 0

  // Check required fields
  requiredFields.forEach(field => {
    const value = profile[field as keyof AuthProfile]
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        completedRequired++
      } else if (!Array.isArray(value)) {
        completedRequired++
      }
    }
  })

  // Check optional fields
  optionalFields.forEach(field => {
    const value = profile[field as keyof AuthProfile]
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        completedOptional++
      } else if (!Array.isArray(value)) {
        completedOptional++
      }
    }
  })

  // Calculate completion percentage
  // Required fields are worth 70% of total completion
  // Optional fields are worth 30% of total completion
  const requiredScore = (completedRequired / requiredFields.length) * 70
  const optionalScore = (completedOptional / optionalFields.length) * 30
  
  const totalScore = Math.round(requiredScore + optionalScore)
  
  return Math.min(totalScore, 100)
}

/**
 * Get a list of missing profile fields to help users complete their profile
 * @param profile - The user's profile object
 * @returns Array of human-readable field names that are missing (max 5)
 */
export function getProfileMissingFields(profile: AuthProfile): string[] {
  if (!profile) return []

  const requiredFields = [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'religion', label: 'Religion' },
    { key: 'education', label: 'Education' },
    { key: 'profession', label: 'Profession' },
    { key: 'purposeDomain', label: 'Purpose Domain' },
    { key: 'purposeArchetype', label: 'Purpose Archetype' },
    { key: 'purposeModality', label: 'Purpose Modality' },
    { key: 'interests', label: 'Interests' },
    { key: 'personality', label: 'Personality' },
    { key: 'maritalStatus', label: 'Marital Status' },
    { key: 'lookingFor', label: 'Looking For' },
    { key: 'language', label: 'Language' },
    { key: 'smoke', label: 'Smoking Preference' },
    { key: 'alcohol', label: 'Alcohol Preference' },
    { key: 'drugs', label: 'Drugs Preference' },
    { key: 'politics', label: 'Political Views' }
  ]

  const optionalFields = [
    { key: 'avatar', label: 'Profile Photo' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'income', label: 'Income' },
    { key: 'lat', label: 'Location' },
    { key: 'lang', label: 'Location' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'country', label: 'Country' },
    { key: 'purposeNarrative', label: 'Purpose Story' },
    { key: 'height', label: 'Height' },
    { key: 'weight', label: 'Weight' }
  ]

  const missingFields: string[] = []

  // Check required fields
  requiredFields.forEach(field => {
    const value = profile[field.key as keyof AuthProfile]
    if (value === null || value === undefined || value === '') {
      if (Array.isArray(value) && value.length === 0) {
        missingFields.push(field.label)
      } else if (!Array.isArray(value)) {
        missingFields.push(field.label)
      }
    }
  })

  // Check optional fields
  optionalFields.forEach(field => {
    const value = profile[field.key as keyof AuthProfile]
    if (value === null || value === undefined || value === '') {
      if (Array.isArray(value) && value.length === 0) {
        missingFields.push(field.label)
      } else if (!Array.isArray(value)) {
        missingFields.push(field.label)
      }
    }
  })

  return missingFields.slice(0, 5) // Show only first 5 missing fields
}
