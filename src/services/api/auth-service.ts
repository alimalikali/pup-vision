import { AuthUser, AuthResponse, LoginRequest, SignupRequest } from "@/types/auth"

class AuthService {
  private baseUrl = "/api/auth"

  /**
   * Core request handler for all auth endpoints
   */
  private async request<T = unknown>(
    path: string,
    options: RequestInit
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        credentials: "include", // always include cookies
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      })

      const data = await response.json().catch(() => ({}))

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

  // Example extensibility: GitHub / LinkedIn
  async oauth(provider: "github" | "linkedin", token: string): Promise<AuthResponse> {
    return this.request<AuthUser>(`/${provider}`, {
      method: "POST",
      body: JSON.stringify({ access_token: token }),
    })
  }
}

export const authService = new AuthService()
