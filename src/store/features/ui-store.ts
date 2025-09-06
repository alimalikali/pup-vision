import { create } from "zustand"
import { UIState, Notification } from "@/store/types"

interface UIActions {
  setTheme: (theme: "light" | "dark" | "system") => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useUIStore = create<UIState & UIActions>()((set, get) => ({
  theme: "system",
  sidebarOpen: false,
  notifications: [],

  setTheme: (theme) => {
    set({ theme })
    // Also update localStorage and document class
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        root.classList.add(systemTheme)
      } else {
        root.classList.add(theme)
      }
    }
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }))
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open })
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id: Date.now().toString() }]
    }))
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  },
}))
