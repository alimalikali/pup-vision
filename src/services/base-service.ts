import { AuthResponse, ServiceResponse, RequestOptions } from '@types';

export class BaseService {
  protected baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<AuthResponse> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Core request handler for all service endpoints
   * Handles authentication, token refresh, and error handling
   */
  protected async request<T = unknown>(path: string, options: RequestOptions = {}): Promise<ServiceResponse<T>> {
    const { skipAuth = false, skipRefresh = false, ...fetchOptions } = options;

    const doFetch = async (): Promise<Response> => {
      return fetch(`${this.baseUrl}${path}`, {
        ...fetchOptions,
        credentials: 'include', // always include cookies
        headers: {
          'Content-Type': 'application/json',
          ...(fetchOptions.headers || {}),
        },
      });
    };

    try {
      let response = await doFetch();
      let data = await response.json().catch(() => ({}));

      // Handle authentication errors (401) with token refresh
      if (response.status === 401 && !skipAuth && !skipRefresh && path !== '/refresh') {
        console.warn(`[BaseService] Access token expired, refreshing...`);

        // Avoid multiple simultaneous refresh calls
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshPromise = this.refreshToken().finally(() => {
            this.isRefreshing = false;
            this.refreshPromise = null;
          });
        }

        const refreshRes = await this.refreshPromise!;
        if (!refreshRes.success) {
          return {
            success: false,
            message: 'Session expired. Please log in again.',
          };
        }

        // Retry original request once after successful refresh
        response = await doFetch();
        data = await response.json().catch(() => ({}));
      }

      if (response.ok) {
        return {
          success: true,
          data: data.data || data,
          message: data.message,
        };
      }

      return {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
      };
    } catch (err) {
      console.error(`BaseService request error [${path}]:`, err);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  /**
   * GET request helper
   */
  protected async get<T = unknown>(path: string, options: RequestOptions = {}): Promise<ServiceResponse<T>> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  /**
   * POST request helper
   */
  protected async post<T = unknown>(path: string, body?: unknown, options: RequestOptions = {}): Promise<ServiceResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request helper
   */
  protected async put<T = unknown>(path: string, body?: unknown, options: RequestOptions = {}): Promise<ServiceResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request helper
   */
  protected async delete<T = unknown>(path: string, options: RequestOptions = {}): Promise<ServiceResponse<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  /**
   * Refresh authentication token
   */
  private async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        return { success: true, ...data };
      }

      return {
        success: false,
        message: data.message || 'Token refresh failed',
      };
    } catch (err) {
      console.error('Token refresh error:', err);
      return {
        success: false,
        message: 'Token refresh failed',
      };
    }
  }

  /**
   * Handle service-specific errors
   */
  protected handleError(error: unknown, defaultMessage: string): ServiceResponse {
    console.error(`Service error:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : defaultMessage,
    };
  }

  /**
   * Check if response indicates authentication is required
   */
  protected isAuthRequired(response: ServiceResponse): boolean {
    return (!response.success && response.message?.includes('Authentication required')) ?? false;
  }

  /**
   * Check if response indicates session expired
   */
  protected isSessionExpired(response: ServiceResponse): boolean {
    return !response.success && response.message?.includes('Session expired');
  }
}

export default BaseService;
