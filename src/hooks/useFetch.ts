import { useCallback } from 'react'
import { captureError } from '../utils/errorTracking'

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  headers?: Record<string, string>
}

interface FetchResult<T> {
  data: T | null
  error: string | null
  status: number | null
}

export function useFetch() {
  const secureFetch = useCallback(
    async <T,>(
      endpoint: string,
      options: FetchOptions = {},
    ): Promise<FetchResult<T>> => {
      // SSRF protection: reject absolute URLs
      if (endpoint.startsWith('http')) {
        captureError(
          new Error('SSRF protection: absolute URL rejected'),
          'useFetch.secureFetch',
          { endpoint },
        )
        return {
          data: null,
          error: 'Invalid request',
          status: null,
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      try {
        const response = await fetch(endpoint, {
          method: options.method ?? 'GET',
          credentials: 'include',
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
        })

        if (!response.ok) {
          captureError(
            new Error(`API ${response.status}: ${endpoint}`),
            'useFetch.secureFetch',
            { endpoint, status: response.status, method: options.method },
          )

          // Do not leak server error details to the UI
          const errorMessage =
            response.status === 429
              ? 'Too many requests. Please try again shortly.'
              : response.status >= 500
                ? 'Server error. Please try again later.'
                : 'Request failed. Please check your input.'

          return {
            data: null,
            error: errorMessage,
            status: response.status,
          }
        }

        const data = (await response.json()) as T

        return {
          data,
          error: null,
          status: response.status,
        }
      } catch (error) {
        captureError(error, 'useFetch.secureFetch', {
          endpoint,
          method: options.method,
        })

        return {
          data: null,
          error: 'Network error. Check your connection and try again.',
          status: null,
        }
      }
    },
    [],
  )

  return { secureFetch }
}
