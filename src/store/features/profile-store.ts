import { create } from "zustand"
import { ProfileState } from "@/store/types"
import { profileService } from "@/services"
import { Profile } from "@/types/types"

interface ProfileActions {
  fetchProfile: () => Promise<void>
  updateProfile: (profileData: Partial<Profile>) => Promise<boolean>
  uploadPhoto: (photoData: any) => Promise<string | null>
  removePhoto: (photoIndex: number) => Promise<boolean>
  setMainPhoto: (photoIndex: number) => Promise<boolean>
  clearError: () => void
}

export const useProfileStore = create<ProfileState & ProfileActions>()((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null })
    try {
      const profile = await profileService.getProfile()
      set({ profile: profile || null, isLoading: false })
    } catch (error) {
      set({ isLoading: false, error: "Failed to fetch profile" })
    }
  },

  updateProfile: async (profileData: Partial<Profile>) => {
    set({ isLoading: true, error: null })
    try {
      const result = await profileService.updateProfile(profileData)

      if (result.success && result.profile) {
        set({ profile: result.profile, isLoading: false })
        return true
      } else {
        set({ isLoading: false, error: result.message || "Failed to update profile" })
        return false
      }
    } catch (error) {
      set({ isLoading: false, error: "Failed to update profile" })
      return false
    }
  },

  uploadPhoto: async (photoData: any) => {
    try {
      const photoUrl = await profileService.uploadPhoto(photoData)
      return photoUrl
    } catch (error) {
      return null
    }
  },

  removePhoto: async (photoIndex: number) => {
    try {
      const success = await profileService.removePhoto(photoIndex)
      return success
    } catch (error) {
      return false
    }
  },

  setMainPhoto: async (photoIndex: number) => {
    try {
      const success = await profileService.setMainPhoto(photoIndex)
      return success
    } catch (error) {
      return false
    }
  },

  clearError: () => set({ error: null }),
}))
