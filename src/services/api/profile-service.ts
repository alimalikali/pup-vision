import { Profile } from '@/types/types'

interface PhotoResponse {
  success: boolean
  photoUrl?: string
  message?: string
}

interface ProfileUpdateResponse {
  success: boolean
  profile?: Profile
  message?: string
}

class ProfileService {
  private baseUrl = '/api/user'

  async getProfile(): Promise<Profile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Not authenticated');
          return null; // explicitly "not logged in"
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.success && data.profile) {
        return data.profile;
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  }
  
  async updateProfile(profileData: Partial<Profile>): Promise<ProfileUpdateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'PUT',
        credentials: 'include', // Include cookies for authentication
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, message: 'Authentication required' }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      return { success: false, message: 'Failed to update profile' }
    }
  }

  async uploadPhoto(photoUrl: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/photos`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upload', photoUrl }),
      })

      const data: PhotoResponse = await response.json()
      return data.success ? data.photoUrl || null : null
    } catch (error) {
      console.error('Photo upload error:', error)
      return null
    }
  }

  async removePhoto(photoIndex: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/photos`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', photoIndex }),
      })

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error('Photo removal error:', error)
      return false
    }
  }

  async setMainPhoto(photoIndex: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/photos`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setMain', photoIndex }),
      })

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error('Set main photo error:', error)
      return false
    }
  }

  async getPhotos(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/photos`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()
      return data.success ? data.photos || [] : []
    } catch (error) {
      console.error('Get photos error:', error)
      return []
    }
  }
}

export const profileService = new ProfileService()
