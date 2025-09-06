import { create } from "zustand"
import { persist } from "zustand/middleware"
import { matchesService } from "@/services/api/matches-service"
import { MatchProfile, MatchesFilters, AdmireData } from "@/types/matches"

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

interface MatchesState {
  // Matches data
  profiles: MatchProfile[]
  currentProfile: MatchProfile | null
  
  // Admire data
  admireData: AdmireData | null
  
  // Pagination
  cursor: string | null
  hasMore: boolean
  
  // Filters
  filters: MatchesFilters
  advancedFilters: AdvancedFilters
  
  // Loading states
  isLoading: boolean
  isLoadingMore: boolean
  isLoadingProfile: boolean
  isLoadingAdmire: boolean
  
  // Error handling
  error: string | null
}

interface MatchesActions {
  // Profile actions
  fetchProfiles: (reset?: boolean) => Promise<void>
  loadMoreProfiles: () => Promise<void>
  fetchProfile: (profileId: string) => Promise<void>
  clearCurrentProfile: () => void
  
  // Admire actions
  admireUser: (targetUserId: string) => Promise<boolean>
  passUser: (targetUserId: string) => Promise<boolean>
  fetchAdmireData: () => Promise<void>
  
  // Filter actions
  updateFilters: (filters: Partial<MatchesFilters>) => void
  updateAdvancedFilters: (filters: Partial<AdvancedFilters>) => void
  clearFilters: () => void
  clearAdvancedFilters: () => void
  
  // Utility actions
  clearError: () => void
  reset: () => void
}

type Store = MatchesState & MatchesActions

const initialState: MatchesState = {
  profiles: [],
  currentProfile: null,
  admireData: null,
  cursor: null,
  hasMore: false,
  filters: {},
  advancedFilters: {},
  isLoading: false,
  isLoadingMore: false,
  isLoadingProfile: false,
  isLoadingAdmire: false,
  error: null,
}

export const useMatchesStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,

      // --- Profile Actions ---
      
      fetchProfiles: async (reset = false) => {
        const { cursor, filters, isLoading } = get()
        
        // Prevent multiple simultaneous requests
        if (isLoading) return
        
        if (reset) {
          set({ isLoading: true, error: null, profiles: [], cursor: null })
        } else {
          set({ isLoading: true, error: null })
        }

        try {
          const response = await matchesService.getMatches(
            reset ? null : cursor,
            20,
            true,
            filters
          )

          if (response.success) {
            set({
              profiles: reset ? response.data : [...get().profiles, ...response.data],
              cursor: response.pagination.cursor,
              hasMore: response.pagination.hasMore,
              isLoading: false,
              error: null,
            })
          } else {
            set({ error: response.message || "Failed to fetch profiles", isLoading: false })
          }
        } catch (error) {
          console.error("Error fetching profiles:", error)
          set({ 
            error: error instanceof Error ? error.message : "Failed to fetch profiles", 
            isLoading: false 
          })
        }
      },

      loadMoreProfiles: async () => {
        const { hasMore, isLoadingMore } = get()
        
        if (!hasMore || isLoadingMore) return

        set({ isLoadingMore: true, error: null })

        try {
          await get().fetchProfiles(false)
          set({ isLoadingMore: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to load more profiles", 
            isLoadingMore: false 
          })
        }
      },

      fetchProfile: async (profileId: string) => {
        set({ isLoadingProfile: true, error: null })

        try {
          const response = await matchesService.getProfile(profileId, true)

          if (response.success) {
            set({
              currentProfile: response.data,
              isLoadingProfile: false,
              error: null,
            })
          } else {
            set({ error: response.message || "Failed to fetch profile", isLoadingProfile: false })
          }
        } catch (error) {
          console.error("Error fetching profile:", error)
          set({ 
            error: error instanceof Error ? error.message : "Failed to fetch profile", 
            isLoadingProfile: false 
          })
        }
      },

      clearCurrentProfile: () => {
        set({ currentProfile: null })
      },

      // --- Admire Actions ---

      admireUser: async (targetUserId: string) => {
        try {
          const response = await matchesService.admireUser(targetUserId)

          if (response.success) {
            // Remove the profile from the list since it's been admired
            set({
              profiles: get().profiles.filter(profile => profile.userId !== targetUserId)
            })

            // Refresh admire data to get updated lists
            await get().fetchAdmireData()

            return true
          } else {
            set({ error: response.message || "Failed to admire user" })
            return false
          }
        } catch (error) {
          console.error("Error admiring user:", error)
          set({ error: error instanceof Error ? error.message : "Failed to admire user" })
          return false
        }
      },

      passUser: async (targetUserId: string) => {
        try {
          const response = await matchesService.passUser(targetUserId)

          if (response.success) {
            // Remove the profile from the list since it's been passed
            set({
              profiles: get().profiles.filter(profile => profile.userId !== targetUserId)
            })

            return true
          } else {
            set({ error: response.message || "Failed to pass user" })
            return false
          }
        } catch (error) {
          console.error("Error passing user:", error)
          set({ error: error instanceof Error ? error.message : "Failed to pass user" })
          return false
        }
      },

      fetchAdmireData: async () => {
        set({ isLoadingAdmire: true, error: null })

        try {
          const response = await matchesService.getAdmireData()

          if (response.success) {
            set({
              admireData: response.data,
              isLoadingAdmire: false,
              error: null,
            })
          } else {
            set({ error: response.message || "Failed to fetch admire data", isLoadingAdmire: false })
          }
        } catch (error) {
          console.error("Error fetching admire data:", error)
          set({ 
            error: error instanceof Error ? error.message : "Failed to fetch admire data", 
            isLoadingAdmire: false 
          })
        }
      },

      // --- Filter Actions ---

      updateFilters: (newFilters: Partial<MatchesFilters>) => {
        const currentFilters = get().filters
        const updatedFilters = { ...currentFilters, ...newFilters }
        
        set({ filters: updatedFilters })
        
        // Automatically refetch profiles with new filters
        get().fetchProfiles(true)
      },

      updateAdvancedFilters: (newFilters: Partial<AdvancedFilters>) => {
        const currentFilters = get().advancedFilters
        const updatedFilters = { ...currentFilters, ...newFilters }
        
        set({ advancedFilters: updatedFilters })
        
        // Convert advanced filters to basic filters for API
        const basicFilters: Partial<MatchesFilters> = {}
        
        if (updatedFilters.ageRange) {
          basicFilters.ageMin = updatedFilters.ageRange.min
          basicFilters.ageMax = updatedFilters.ageRange.max
        }
        
        if (updatedFilters.gender && updatedFilters.gender.length > 0) {
          basicFilters.gender = updatedFilters.gender[0] // API might only support single gender
        }
        
        if (updatedFilters.city && updatedFilters.city.length > 0) {
          basicFilters.city = updatedFilters.city[0]
        }
        
        if (updatedFilters.education && updatedFilters.education.length > 0) {
          basicFilters.education = updatedFilters.education[0]
        }
        
        if (updatedFilters.profession && updatedFilters.profession.length > 0) {
          basicFilters.profession = updatedFilters.profession[0]
        }
        
        if (updatedFilters.purposeDomain && updatedFilters.purposeDomain.length > 0) {
          basicFilters.purposeDomain = updatedFilters.purposeDomain[0]
        }
        
        if (updatedFilters.interests && updatedFilters.interests.length > 0) {
          basicFilters.interests = updatedFilters.interests
        }
        
        // Update basic filters but don't auto-fetch - let the component handle it
        set({ filters: { ...get().filters, ...basicFilters } })
      },

      clearFilters: () => {
        set({ filters: {} })
        get().fetchProfiles(true)
      },

      clearAdvancedFilters: () => {
        set({ advancedFilters: {}, filters: {} })
        // Don't auto-fetch here either - let the component handle it
      },

      // --- Utility Actions ---

      clearError: () => {
        set({ error: null })
      },

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: "matches-storage",
      partialize: (state) => ({
        filters: state.filters,
        advancedFilters: state.advancedFilters,
        admireData: state.admireData,
      }),
    }
  )
)
