import { create } from "zustand"
import { persist } from "zustand/middleware"
import { matchesService } from "@/services/api/matches-service"
import { MatchProfile, MatchesFilters, AdmireData } from "@/types/matches"

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
  clearFilters: () => void
  
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

      clearFilters: () => {
        set({ filters: {} })
        get().fetchProfiles(true)
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
        admireData: state.admireData,
      }),
    }
  )
)
