import { ApiError } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// Token management
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// Request interceptor to add auth token
const getHeaders = (customHeaders: Record<string, string> = {}): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Custom fetch wrapper with error handling
interface RequestConfig extends RequestInit {
  timeout?: number;
}

const toReadableErrorMessage = (errorData: any): string => {
  if (!errorData) {
    return 'An error occurred';
  }

  if (typeof errorData.message === 'string' && errorData.message.trim()) {
    return errorData.message;
  }

  if (typeof errorData.detail === 'string' && errorData.detail.trim()) {
    return errorData.detail;
  }

  // DRF validation errors are often keyed by field names.
  if (typeof errorData === 'object') {
    for (const value of Object.values(errorData)) {
      if (Array.isArray(value) && value.length > 0) {
        return String(value[0]);
      }
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
    }
  }

  return 'An error occurred';
};

const fetchWithTimeout = async (
  url: string,
  config: RequestConfig = {}
): Promise<Response> => {
  const { timeout = API_TIMEOUT, ...fetchConfig } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'An error occurred',
    }));

    const error: ApiError = {
      message: toReadableErrorMessage(errorData),
      errors: errorData.errors,
      detail: errorData.detail,
    };

    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

// Refresh token logic
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  setTokens(data.access, refreshToken);
  return data.access;
};

// Main API client methods
export const apiClient = {
  get: async <T>(endpoint: string, config: RequestConfig = {}): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = getHeaders(config.headers as Record<string, string>);

    try {
      const response = await fetchWithTimeout(url, {
        ...config,
        method: 'GET',
        headers,
      });

      // Handle 401 and retry with refresh
      if (response.status === 401 && !isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onTokenRefreshed(newToken);

          // Retry original request
          const retryHeaders = getHeaders(config.headers as Record<string, string>);
          const retryResponse = await fetchWithTimeout(url, {
            ...config,
            method: 'GET',
            headers: retryHeaders,
          });
          return handleResponse<T>(retryResponse);
        } catch (error) {
          isRefreshing = false;
          window.location.href = '/login';
          throw error;
        }
      }

      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  },

  post: async <T>(
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = getHeaders(config.headers as Record<string, string>);

    try {
      const response = await fetchWithTimeout(url, {
        ...config,
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (response.status === 401 && !isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onTokenRefreshed(newToken);

          const retryHeaders = getHeaders(config.headers as Record<string, string>);
          const retryResponse = await fetchWithTimeout(url, {
            ...config,
            method: 'POST',
            headers: retryHeaders,
            body: data ? JSON.stringify(data) : undefined,
          });
          return handleResponse<T>(retryResponse);
        } catch (error) {
          isRefreshing = false;
          window.location.href = '/login';
          throw error;
        }
      }

      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  },

  put: async <T>(
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = getHeaders(config.headers as Record<string, string>);

    const response = await fetchWithTimeout(url, {
      ...config,
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  patch: async <T>(
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = getHeaders(config.headers as Record<string, string>);

    const response = await fetchWithTimeout(url, {
      ...config,
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string, config: RequestConfig = {}): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = getHeaders(config.headers as Record<string, string>);

    const response = await fetchWithTimeout(url, {
      ...config,
      method: 'DELETE',
      headers,
    });

    return handleResponse<T>(response);
  },

  // Special method for file uploads
  upload: async <T>(
    endpoint: string,
    formData: FormData,
    config: RequestConfig = {}
  ): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAccessToken();
    
    const headers: HeadersInit = {
      ...(config.headers as Record<string, string>),
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetchWithTimeout(url, {
      ...config,
      method: 'POST',
      headers,
      body: formData,
    });

    return handleResponse<T>(response);
  },
};

export default apiClient;
