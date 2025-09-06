import { MatchesResponse, MatchesFilters, ProfileResponse, AdmireResponse, AdmireDataResponse } from "@/types/matches"
import { AuthResponse } from "@/types/auth"

class MatchesService {
  private baseUrl = "/api"
  private isRefreshing = false
  private refreshPromise: Promise<AuthResponse> | null = null

  /**
   * Core request handler for all matches endpoints
   */
  private async request<T = unknown>(
    path: string,
    options: RequestInit
  ): Promise<T> {
    const doFetch = async (): Promise<Response> => {
      return fetch(`${this.baseUrl}${path}`, {
        ...options,
        credentials: "include", // always include cookies
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      })
    }
    try {

      let response = await doFetch()
      let data = await response.json().catch(() => ({}))

      // If unauthorized → try refresh
      if (response.status === 401 && path !== "/refresh") {
        console.warn(`[AuthService] Access token expired, refreshing...`)
        
        // Avoid multiple simultaneous refresh calls
        if (!this.isRefreshing) {
          this.isRefreshing = true
          this.refreshPromise = this.refreshToken().finally(() => {
            this.isRefreshing = false
            this.refreshPromise = null
          })
        }

        const refreshRes = await this.refreshPromise!
        if (!refreshRes.success) {
          throw new Error("Session expired. Please log in again.")
        }

        // Retry original request once
        response = await doFetch()
        data = await response.json().catch(() => ({}))
      }
      if (response.ok) {
        return data as T
      }

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`)
      }

      return data as T
    } catch (err) {
      console.error(`MatchesService request error [${path}]:`, err)
      throw err
    }
  }

  /**
   * Get matches with cursor-based pagination and filtering
   */
  async getMatches(
    cursor?: string | null,
    limit: number = 20,
    includeCompatibility: boolean = true,
    filters: MatchesFilters = {}
  ): Promise<MatchesResponse> {
    const searchParams = new URLSearchParams()
    
    if (cursor) searchParams.set('cursor', cursor)
    searchParams.set('limit', limit.toString())
    searchParams.set('includeCompatibility', includeCompatibility.toString())
    
    // Add filters
    if (filters.ageMin) searchParams.set('ageMin', filters.ageMin.toString())
    if (filters.ageMax) searchParams.set('ageMax', filters.ageMax.toString())
    if (filters.gender) searchParams.set('gender', filters.gender)
    if (filters.city) searchParams.set('city', filters.city)
    if (filters.state) searchParams.set('state', filters.state)
    if (filters.education) searchParams.set('education', filters.education)
    if (filters.profession) searchParams.set('profession', filters.profession)
    if (filters.purposeDomain) searchParams.set('purposeDomain', filters.purposeDomain)
    if (filters.interests && filters.interests.length > 0) {
      searchParams.set('interests', filters.interests.join(','))
    }

    return this.request<MatchesResponse>(`/matches?${searchParams.toString()}`, {
      method: "GET",
    })
  }

  /**
   * Get a single profile by ID
   */
  async getProfile(
    profileId: string,
    includeCompatibility: boolean = true
  ): Promise<ProfileResponse> {
    const searchParams = new URLSearchParams()
    searchParams.set('includeCompatibility', includeCompatibility.toString())

    return this.request<ProfileResponse>(`/profile/${profileId}?${searchParams.toString()}`, {
      method: "GET",
    })
  }

  /**
   * Admire a user
   */
  async admireUser(targetUserId: string): Promise<AdmireResponse> {
    return this.request<AdmireResponse>("/admire", {
      method: "POST",
      body: JSON.stringify({
        targetUserId,
        action: "admire"
      }),
    })
  }

  /**
   * Pass on a user
   */
  async passUser(targetUserId: string): Promise<AdmireResponse> {
    return this.request<AdmireResponse>("/admire", {
      method: "POST",
      body: JSON.stringify({
        targetUserId,
        action: "pass"
      }),
    })
  }

  /**
   * Get admire data (who I admire, who admires me, matches)
   */
  async getAdmireData(): Promise<AdmireDataResponse> {
    return this.request<AdmireDataResponse>("/admire", {
      method: "GET",
    })
  }

  /**
   * Get matches only
   */
  async getMatchesOnly(): Promise<AdmireDataResponse> {
    return this.getAdmireData()
  }

  /**
   * Refresh authentication token
   */
  private async refreshToken(): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/refresh", {
      method: "POST",
    })
  }
}

export const matchesService = new MatchesService()
