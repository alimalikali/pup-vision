import { create } from "zustand"
import { persist } from "zustand/middleware"

// User state interface
interface User {
  id: string
  name: string
  email: string
  avatar?: string
  profileCompletion: number
  memberSince: string
  lastActive: string
  subscription: {
    plan: "free" | "premium" | "elite"
    status: "active" | "cancelled" | "expired"
    currentPeriodEnd: string
  }
}

// Auth state interface
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: { name: string; email: string; password: string }) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

// Profile state interface
interface ProfileState {
  profile: any | null
  isLoading: boolean
  fetchProfile: () => Promise<void>
  updateProfile: (profileData: any) => Promise<boolean>
  uploadPhoto: (photoData: any) => Promise<string | null>
  removePhoto: (photoIndex: number) => Promise<boolean>
  setMainPhoto: (photoIndex: number) => Promise<boolean>
}

// Settings state interface
interface SettingsState {
  settings: any | null
  isLoading: boolean
  fetchSettings: () => Promise<void>
  updateSettings: (settingsData: any) => Promise<boolean>
}

// Matches state interface
interface Match {
  id: string
  profile: {
    name: string
    age: number
    avatar?: string
    city: string
    state: string
    profession: string
    purpose: {
      domain: string
      archetype: string
    }
  }
  compatibilityScore: number
  narrative: string
  createdAt: string
}

interface MatchesState {
  matches: Match[]
  interests: any[]
  isLoading: boolean
  fetchMatches: () => Promise<void>
  fetchInterests: () => Promise<void>
  likeMatch: (matchId: string) => Promise<void>
  passMatch: (matchId: string) => Promise<void>
  likeBack: (interestId: string) => Promise<void>
}

// Billing state interface
interface BillingState {
  subscription: {
    plan: string
    amount: number
    currency: string
    currentPeriodEnd: string
    status: string
  }
  paymentHistory: any[]
  isLoading: boolean
  fetchBilling: () => Promise<void>
  changePlan: (planId: string) => Promise<boolean>
  cancelSubscription: () => Promise<boolean>
}

// Auth store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          if (response.ok) {
            const userData = await response.json()
            set({
              user: userData.user,
              isAuthenticated: true,
              isLoading: false,
            })
            return true
          }
          return false
        } catch (error) {
          console.error("Login error:", error)
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      signup: async (data) => {
        set({ isLoading: true })
        try {
          const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })

          if (response.ok) {
            const userData = await response.json()
            set({
              user: userData.user,
              isAuthenticated: true,
              isLoading: false,
            })
            return true
          }
          return false
        } catch (error) {
          console.error("Signup error:", error)
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
        // Call logout API
        fetch("/api/auth/logout", { method: "POST" })
      },

      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

// Profile store
export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const profile = await response.json()
        set({ profile, isLoading: false })
      }
    } catch (error) {
      console.error("Fetch profile error:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true })
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        const result = await response.json()
        set({ profile: result.profile, isLoading: false })
        return true
      }
      return false
    } catch (error) {
      console.error("Update profile error:", error)
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  uploadPhoto: async (photoData) => {
    try {
      const response = await fetch("/api/user/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upload", ...photoData }),
      })

      if (response.ok) {
        const result = await response.json()
        return result.photoUrl
      }
      return null
    } catch (error) {
      console.error("Upload photo error:", error)
      return null
    }
  },

  removePhoto: async (photoIndex) => {
    try {
      const response = await fetch("/api/user/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", photoIndex }),
      })

      return response.ok
    } catch (error) {
      console.error("Remove photo error:", error)
      return false
    }
  },

  setMainPhoto: async (photoIndex) => {
    try {
      const response = await fetch("/api/user/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setMain", photoIndex }),
      })

      return response.ok
    } catch (error) {
      console.error("Set main photo error:", error)
      return false
    }
  },
}))

// Settings store
export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch("/api/user/settings")
      if (response.ok) {
        const settings = await response.json()
        set({ settings, isLoading: false })
      }
    } catch (error) {
      console.error("Fetch settings error:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  updateSettings: async (settingsData) => {
    set({ isLoading: true })
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsData),
      })

      if (response.ok) {
        const result = await response.json()
        set({ settings: result.settings, isLoading: false })
        return true
      }
      return false
    } catch (error) {
      console.error("Update settings error:", error)
      return false
    } finally {
      set({ isLoading: false })
    }
  },
}))

// Matches store
export const useMatchesStore = create<MatchesState>((set, get) => ({
  matches: [],
  interests: [],
  isLoading: false,

  fetchMatches: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch("/api/matches")
      if (response.ok) {
        const matches = await response.json()
        set({ matches, isLoading: false })
      }
    } catch (error) {
      console.error("Fetch matches error:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  fetchInterests: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch("/api/interests")
      if (response.ok) {
        const interests = await response.json()
        set({ interests, isLoading: false })
      }
    } catch (error) {
      console.error("Fetch interests error:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  likeMatch: async (matchId: string) => {
    try {
      await fetch("/api/matches/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      })
    } catch (error) {
      console.error("Like match error:", error)
    }
  },

  passMatch: async (matchId: string) => {
    try {
      await fetch("/api/matches/pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      })
    } catch (error) {
      console.error("Pass match error:", error)
    }
  },

  likeBack: async (interestId: string) => {
    try {
      await fetch("/api/interests/like-back", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interestId }),
      })
      // Remove from interests after liking back
      const currentInterests = get().interests
      set({ interests: currentInterests.filter((i) => i.id !== interestId) })
    } catch (error) {
      console.error("Like back error:", error)
    }
  },
}))

// Billing store
export const useBillingStore = create<BillingState>((set, get) => ({
  subscription: {
    plan: "premium",
    amount: 29.99,
    currency: "USD",
    currentPeriodEnd: "2024-03-01",
    status: "active",
  },
  paymentHistory: [],
  isLoading: false,

  fetchBilling: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch("/api/billing")
      if (response.ok) {
        const billing = await response.json()
        set({
          subscription: billing.subscription,
          paymentHistory: billing.paymentHistory,
          isLoading: false,
        })
      }
    } catch (error) {
      console.error("Fetch billing error:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  changePlan: async (planId: string) => {
    try {
      const response = await fetch("/api/billing/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      if (response.ok) {
        const updatedSubscription = await response.json()
        set({ subscription: updatedSubscription })
        return true
      }
      return false
    } catch (error) {
      console.error("Change plan error:", error)
      return false
    }
  },

  cancelSubscription: async () => {
    try {
      const response = await fetch("/api/billing/cancel", {
        method: "POST",
      })

      if (response.ok) {
        const currentSubscription = get().subscription
        set({ subscription: { ...currentSubscription, status: "cancelled" } })
        return true
      }
      return false
    } catch (error) {
      console.error("Cancel subscription error:", error)
      return false
    }
  },
}))
