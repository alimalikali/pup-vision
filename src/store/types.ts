import { Match, Profile, Subscription, Transaction } from "@/types/types"

export interface BaseState {
  isLoading: boolean
  error: string | null
}



export interface ProfileState extends BaseState {
  profile: Profile | null
}

export interface MatchesState extends BaseState {
  matches: Match[]
}

export interface BillingState extends BaseState {
  subscription: Subscription | null
  paymentHistory: Transaction[]
}

export interface SettingsState extends BaseState {
  settings: SettingsState
}

export interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  duration?: number
}

export interface UIState {
  theme: "light" | "dark" | "system"
  sidebarOpen: boolean
  notifications: Notification[]
}
