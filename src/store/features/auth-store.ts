import { create } from "zustand"
import { persist } from "zustand/middleware"
import { AuthUser, AuthStatus } from "@/types/auth"
import { authService } from "@/services"

interface AuthState {
  user: AuthUser | null
  status: AuthStatus
  error: string | null
  isLoading: boolean
}

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: { name: string; email: string; password: string }) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (updates: Partial<AuthUser>) => void
  clearError: () => void
  checkAuth: () => Promise<void>
  setAuthenticated: (user: AuthUser) => void
  initialize: () => Promise<void>
}

type Store = AuthState & AuthActions

export const useAuthStore = create<Store>()(
  persist(
    (set, get) => ({
      // --- State ---
      user: null,
      status: "idle",
      error: null,
      isLoading: false,

      // --- Actions ---
      login: async (email, password) => {
        set({ status: "loading", error: null, isLoading: true })
        try {
          const { success, user, message } = await authService.login(email, password)
          if (success && user) {
            set({ user, status: "authenticated", error: null, isLoading: false })
            return true
          }
          set({ status: "error", error: message || "Login failed", isLoading: false })
          return false
        } catch {
          set({ status: "error", error: "Network error. Please try again.", isLoading: false })
          return false
        }
      },

      signup: async (data) => {
        set({ status: "loading", error: null, isLoading: true })
        try {
          const { success, user, message } = await authService.signup(data)
          if (success && user) {
            set({ user, status: "authenticated", error: null, isLoading: false })
            return true
          }
          set({ status: "error", error: message || "Signup failed", isLoading: false })
          return false
        } catch {
          set({ status: "error", error: "Network error. Please try again.", isLoading: false })
          return false
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()
        } finally {
          set({ user: null, status: "unauthenticated", error: null, isLoading: false })
        }
      },

      updateUser: (updates) => {
        const { user } = get()
        if (user) set({ user: { ...user, ...updates } })
      },

      clearError: () => set({ error: null, status: get().status === "error" ? "idle" : get().status }),

      checkAuth: async () => {
        set({ status: "loading", isLoading: true })
        try {
          const { success, user } = await authService.checkAuth()
          if (success && user) {
            set({ user, status: "authenticated", error: null, isLoading: false })
          } else {
            set({ user: null, status: "unauthenticated", error: null, isLoading: false })
          }
        } catch {
          set({ user: null, status: "error", error: "Failed to check authentication status", isLoading: false })
        }
      },

      setAuthenticated: (user) => {
        set({ user, status: "authenticated", error: null })
      },

      initialize: async () => {
        const currentStatus = get().status
        if (currentStatus !== "idle" && currentStatus !== "loading") return
        await get().checkAuth()
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        status: state.status,
      }),
    }
  )
)
