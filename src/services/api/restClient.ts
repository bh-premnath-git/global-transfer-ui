import { ApiResponse } from '@/types';

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

class RestClient {
  private baseURL: string;

  constructor(baseURL: string = DEFAULT_BASE_URL) {
    this.baseURL = baseURL;
  }

  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  getBaseURL() {
    return this.baseURL;
  }

  private normalizeResponse<T>(raw: unknown): ApiResponse<T> {
    if (raw && typeof raw === 'object') {
      const candidate = raw as Record<string, unknown>;

      if ('data' in candidate && 'success' in candidate) {
        const { data, success, message } = candidate as ApiResponse<T>;
        return {
          data,
          success,
          message: message ?? '',
        };
      }

      if ('data' in candidate) {
        return {
          data: candidate.data as T,
          success: true,
          message: typeof candidate.message === 'string' ? candidate.message : '',
        };
      }

      if ('success' in candidate) {
        return {
          data: candidate.result as T,
          success: Boolean(candidate.success),
          message: typeof candidate.message === 'string' ? candidate.message : '',
        };
      }
    }

    return {
      data: raw as T,
      success: true,
      message: '',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      let parsedBody: unknown = null;

      if (contentType && contentType.includes('application/json')) {
        parsedBody = await response.json();
      } else {
        const text = await response.text();
        if (text) {
          try {
            parsedBody = JSON.parse(text) as unknown;
          } catch {
            parsedBody = text;
          }
        }
      }

      if (!response.ok) {
        const message =
          (parsedBody && typeof parsedBody === 'object' && 'message' in parsedBody
            ? String((parsedBody as Record<string, unknown>).message)
            : response.statusText) || `HTTP error! status: ${response.status}`;
        throw new Error(message);
      }

      return this.normalizeResponse<T>(parsedBody);
    } catch (error) {
      console.error('REST API Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const restClient = new RestClient();