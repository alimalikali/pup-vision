import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AuthProfile } from "@/types/auth"
import { profileService } from "@/services/api/profile-service"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEnumLabel(value: string | undefined | null): string {
  if (!value) return ''
  return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export function calculateProfileCompletion(profile: AuthProfile): number {
  if (!profile) return 0

  // All fields are treated equally - no distinction between required and optional
  const allFields = [
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
    'politics',
    'avatar',
    'dob',
    'income',
    'city',
    'state',
    'country',
    'purposeNarrative',
    'height',
    'weight'
  ]

  let completedFields = 0

  // Check all fields equally
  allFields.forEach(field => {
    const value = profile[field as keyof AuthProfile]
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        completedFields++
      } else if (!Array.isArray(value)) {
        completedFields++
      }
    }
  })

  // Calculate completion percentage - all fields weighted equally
  const completionPercentage = Math.round((completedFields / allFields.length) * 100)
  
  return Math.min(completionPercentage, 100)
}

/**
 * Get a list of missing profile fields to help users complete their profile
 * @param profile - The user's profile object
 * @returns Array of human-readable field names that are missing (max 5)
 */
export function getProfileMissingFields(profile: AuthProfile): string[] {
  if (!profile) return []

  // All fields are treated equally - no distinction between required and optional
  const allFields = [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'religion', label: 'Religion' },
    { key: 'education', label: 'Education' },
    { key: 'profession', label: 'Profession' },
    { key: 'purposeDomain', label: 'Purpose Domain' },
    { key: 'purposeArchetype', label: 'Purpose Archetype' },
    { key: 'purposeModality', label: 'Purpose Modality' },
    { key: 'personality', label: 'Personality' },
    { key: 'maritalStatus', label: 'Marital Status' },
    { key: 'lookingFor', label: 'Looking For' },
    { key: 'language', label: 'Language' },
    { key: 'smoke', label: 'Smoking Preference' },
    { key: 'alcohol', label: 'Alcohol Preference' },
    { key: 'drugs', label: 'Drugs Preference' },
    { key: 'politics', label: 'Political Views' },
    { key: 'interests', label: 'Interests' },
    { key: 'avatar', label: 'Profile Photo' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'income', label: 'Income' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'country', label: 'Country' },
    { key: 'purposeNarrative', label: 'Purpose Story' },
    { key: 'height', label: 'Height' },
    { key: 'weight', label: 'Weight' }
  ]

  const missingFields: string[] = []

  // Check all fields equally
  allFields.forEach(field => {
    const value = profile[field.key as keyof AuthProfile]
    if (Array.isArray(value)) {
      if (value.length === 0) {
        missingFields.push(field.label)
      }
    } else {
      if (value === null || value === undefined || value === '') {
        missingFields.push(field.label)
      }
    }
  })

  return missingFields.slice(0, 5) // Show only first 5 missing fields
}

/**
 * Fetch fresh profile data from API and calculate completion
 * @returns Promise with completion percentage and missing fields
 */
export async function getProfileCompletionFromAPI(): Promise<{
  completion: number
  missingFields: string[]
  profile: AuthProfile | null
}> {
  try {
    const profile = await profileService.getProfile()
    if (!profile) {
      return { completion: 0, missingFields: [], profile: null }
    }

    const completion = calculateProfileCompletion(profile)
    const missingFields = getProfileMissingFields(profile)

    return { completion, missingFields, profile }
  } catch (error) {
    console.error('Failed to fetch profile completion from API:', error)
    return { completion: 0, missingFields: [], profile: null }
  }
}

/**
 * Trigger a profile completion refresh event
 * This can be called by other components after profile updates
 */
export function triggerProfileCompletionRefresh(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('profileUpdated'))
  }
}
