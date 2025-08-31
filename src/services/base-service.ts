// Base service class with common functionality
export abstract class BaseService {
  protected baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Always include cookies for authentication
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Request failed for ${url}:`, error)
      throw error
    }
  }

  protected handleError(error: unknown, defaultMessage: string): string {
    if (error instanceof Error) {
      return error.message
    }
    return defaultMessage
  }
}
