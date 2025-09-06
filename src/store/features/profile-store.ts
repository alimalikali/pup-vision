import { create } from 'zustand';
import { ProfileState, ProfileStoreActions, Profile } from '@types';
import { profileService } from '@/services';

export const useProfileStore = create<ProfileState & ProfileStoreActions>()(
  (set) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
      set({ isLoading: true, error: null });
      try {
        const profile = await profileService.getProfile();
        set({ profile: profile || null, isLoading: false });
      } catch {
        set({ isLoading: false, error: 'Failed to fetch profile' });
      }
    },

    updateProfile: async (profileData: Partial<Profile>) => {
      set({ isLoading: true, error: null });
      try {
        const result = await profileService.updateProfile(profileData);

        if (result.success && result.profile) {
          set({ profile: result.profile, isLoading: false });
          return true;
        } else {
          set({
            isLoading: false,
            error: result.message || 'Failed to update profile',
          });
          return false;
        }
      } catch {
        set({ isLoading: false, error: 'Failed to update profile' });
        return false;
      }
    },

    uploadPhoto: async (photoData: string) => {
      try {
        const photoUrl = await profileService.uploadPhoto(photoData);
        return photoUrl;
      } catch {
        return null;
      }
    },

    removePhoto: async (photoIndex: number) => {
      try {
        const success = await profileService.removePhoto(photoIndex);
        return success;
      } catch {
        return false;
      }
    },

    setMainPhoto: async (photoIndex: number) => {
      try {
        const success = await profileService.setMainPhoto(photoIndex);
        return success;
      } catch {
        return false;
      }
    },

    clearError: () => set({ error: null }),
  })
);
