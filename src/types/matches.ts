interface MatchProfile {
    id: string
    userId: string
    name: string
    avatar?: string | null
    dob?: Date | null
    gender: string
    income?: number | null
    religion: string
    education: string
    profession: string
    lat?: number | null
    lang?: number | null
    city?: string | null
    state?: string | null
    country?: string | null
    purposeDomain: string
    purposeArchetype: string
    purposeModality: string
    purposeNarrative?: string | null
    interests: string[]
    personality: string
    maritalStatus: string
    lookingFor: string
    language: string
    height?: number | null
    weight?: number | null
    smoke: string
    alcohol: string
    drugs: string
    politics: string[]
    createdAt: Date
    updatedAt: Date
    admiredBy: string[]
    admiredUsers: string[]
    user: {
      id: string
      email: string
      isVerified: boolean
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }
    age?: number | null
    compatibilityScore?: number
  }
  
  interface MatchesResponse {
    success: boolean
    data: MatchProfile[]
    pagination: {
      cursor: string | null
      hasMore: boolean
      limit: number
    }
    message?: string
  }
  
  interface ProfileResponse {
    success: boolean
    data: MatchProfile
    message?: string
  }
  
  interface AdmireResponse {
    success: boolean
    message: string
    isMutual?: boolean
  }
  
  interface AdmireData {
    admired: MatchProfile[]
    admirers: MatchProfile[]
    matches: Array<{
      id: string
      compatibilityScore: number
      status: string
      createdAt: Date
      updatedAt: Date
      otherUser: MatchProfile
    }>
  }
  
  interface AdmireDataResponse {
    success: boolean
    data: AdmireData
    message?: string
  }
  
  interface MatchesFilters {
    ageMin?: number
    ageMax?: number
    gender?: string
    city?: string
    state?: string
    education?: string
    profession?: string
    purposeDomain?: string
    interests?: string[]
  }

export type { MatchProfile, MatchesFilters, AdmireData, MatchesResponse, ProfileResponse, AdmireResponse, AdmireDataResponse }
