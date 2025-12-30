import type { TStrapiResponse } from '@/types'

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type ApiOptions<P = Record<string, unknown>> = {
  method: HTTPMethod
  payload?: P
  timeoutMs?: number
  authToken?: string
}

/**
 * Unified API function with timeout and optional authentication
 *
 * Features:
 * - Supports all HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Optional authentication (includes Bearer token when authToken provided)
 * - Timeout protection (8 seconds default)
 * - Consistent error handling and response formatting
 * - Handles DELETE requests without response body parsing
 */

async function apiWithTimeout(
  input: RequestInfo,
  init: RequestInit = {},
  timeoutMs = 8000
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeout)
  }
}

export async function apiRequest<T = unknown, P = Record<string, unknown>>(
  url: string,
  options: ApiOptions<P>
): Promise<TStrapiResponse<T>> {
  const { method, payload, timeoutMs = 8000, authToken } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  try {
    const response = await apiWithTimeout(
      url,
      {
        method,
        headers,
        body:
          method === 'GET' || method === 'DELETE'
            ? undefined
            : JSON.stringify(payload ?? {}),
      },
      timeoutMs
    )

    if (method === 'DELETE') {
      return response.ok
        ? { data: true as T, success: true, status: response.status }
        : {
            error: {
              status: response.status,
              name: 'Error',
              message: 'Failed to delete resource',
            },
            success: false,
            status: response.status,
          }
    }

    const data = await response.json()

    if (!response.ok) {
      if (response.status !== 402) {
        console.error(`API ${method} error (${response.status}):`, {
          url,
          status: response.status,
          statusText: response.statusText,
          data,
          hasAuthToken: !!authToken,
        })
      }

      if (data.error) {
        return {
          error: data.error,
          success: false,
          status: response.status,
        }
      }

      return {
        error: {
          status: response.status,
          name: data?.error?.name ?? 'Error',
          message:
            data?.error?.message ?? (response.statusText || 'An error occurred'),
        },
        success: false,
        status: response.status,
      }
    }

    const responseData = data.data ? data.data : data
    const responseMeta = data.meta ? data.meta : undefined
    return {
      data: responseData as T,
      meta: responseMeta,
      success: true,
      status: response.status,
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.error('Request timed out')
      return {
        error: {
          status: 408,
          name: 'TimeoutError',
          message: 'The request timed out. Please try again.',
        },
        success: false,
        status: 408,
      } as TStrapiResponse<T>
    }

    console.error(`Network or unexpected error on ${method} ${url}:`, error)
    return {
      error: {
        status: 500,
        name: 'NetworkError',
        message: error instanceof Error ? error.message : 'Something went wrong',
      },
      success: false,
      status: 500,
    } as TStrapiResponse<T>
  }
}

/**
 * Convenience API methods that support both public and authenticated requests
 */
export const api = {
  get: <T>(
    url: string,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T>(url, { method: 'GET', ...options }),

  post: <T, P = Record<string, unknown>>(
    url: string,
    payload: P,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T, P>(url, { method: 'POST', payload, ...options }),

  put: <T, P = Record<string, unknown>>(
    url: string,
    payload: P,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T, P>(url, { method: 'PUT', payload, ...options }),

  patch: <T, P = Record<string, unknown>>(
    url: string,
    payload: P,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T, P>(url, { method: 'PATCH', payload, ...options }),

  delete: <T>(
    url: string,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T>(url, { method: 'DELETE', ...options }),
}
