import { AuthResponse } from "@/types/auth"

class OnboardingService {
  private baseUrl = "/api/user"

  /**
   * Complete onboarding by updating user profile
   */
  async completeOnboarding(profileData: Record<string, unknown>): Promise<AuthResponse> {
    try {
      let response = await fetch(`${this.baseUrl}/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      })

      // If we get a 401, try to refresh the token and retry
      if (response.status === 401) {
        console.log("[OnboardingService] Access token expired, attempting refresh...")
        
        const refreshResponse = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        })

        if (refreshResponse.ok) {
          // Token refreshed successfully, retry the onboarding request
          response = await fetch(`${this.baseUrl}/onboarding`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(profileData),
          })
        }
      }

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        return { success: true, ...data }
      }

      return {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
      }
    } catch (err) {
      console.error("OnboardingService error:", err)
      return { success: false, message: "Network error. Please try again." }
    }
  }
}

export const onboardingService = new OnboardingService()
