import { AuthResponse, AuthUser, SignupRequest } from "@/types/auth"

class AuthService {
  private baseUrl = "/api/auth"
  private isRefreshing = false
  private refreshPromise: Promise<AuthResponse> | null = null

  /**
   * Core request handler for all auth endpoints
   */
  private async request<T = unknown>(
    path: string,
    options: RequestInit
  ): Promise<AuthResponse> {
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
            return { success: false, message: "Session expired. Please log in again." }
          }
  
          // Retry original request once
          response = await doFetch()
          data = await response.json().catch(() => ({}))
        }
      if (response.ok) {
        return { success: true, ...data }
      }

      return {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
      }
    } catch (err) {
      console.error(`AuthService request error [${path}]:`, err)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  // --- Auth Methods ---

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthUser>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    return this.request<AuthUser>("/signup", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async logout(): Promise<AuthResponse> {
    return this.request<null>("/logout", { method: "POST" })
  }

  async checkAuth(): Promise<AuthResponse> {
    return this.request<AuthUser>("/check", { method: "GET" })
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.request<AuthUser>("/refresh", { method: "POST" })
  }

  async googleAuth(accessToken: string): Promise<AuthResponse> {
    return this.request<AuthUser>("/google", {
      method: "POST",
      body: JSON.stringify({ access_token: accessToken }),
    })
  }


}

export const authService = new AuthService()
