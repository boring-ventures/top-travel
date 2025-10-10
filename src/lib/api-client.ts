/**
 * Enhanced API client with retry logic and connection error handling
 */

interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition?: (error: any) => boolean;
}

const defaultRetryConfig: RetryConfig = {
  retries: 3,
  retryDelay: 1000, // 1 second
  retryCondition: (error) => {
    // Retry on network errors, timeouts, and connection issues
    return (
      error.name === "AbortError" ||
      error.message?.includes("Connection closed") ||
      error.message?.includes("ECONNRESET") ||
      error.message?.includes("ETIMEDOUT") ||
      error.message?.includes("fetch failed") ||
      error.status >= 500
    );
  },
};

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryConfig: Partial<RetryConfig> = {}
): Promise<Response> {
  const config = { ...defaultRetryConfig, ...retryConfig };
  let lastError: any;

  for (let attempt = 0; attempt <= config.retries; attempt++) {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // If response is ok, return it
      if (response.ok) {
        return response;
      }

      // If it's a client error (4xx), don't retry
      if (response.status >= 400 && response.status < 500) {
        return response;
      }

      // For server errors (5xx), throw to trigger retry
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error;

      // Don't retry if it's the last attempt or if retry condition is not met
      if (attempt === config.retries || !config.retryCondition!(error)) {
        break;
      }

      // Wait before retrying with exponential backoff
      const delay = config.retryDelay * Math.pow(2, attempt);
      console.warn(
        `Request failed (attempt ${attempt + 1}/${config.retries + 1}), retrying in ${delay}ms:`,
        error instanceof Error ? error.message : String(error)
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // If all retries failed, throw the last error
  throw lastError;
}

/**
 * Enhanced fetch wrapper for API routes with automatic retry and error handling
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  retryConfig?: Partial<RetryConfig>
): Promise<T> {
  try {
    const response = await fetchWithRetry(endpoint, options, retryConfig);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Hook-friendly API client with React Query integration
 */
export function createApiClient() {
  return {
    get: <T = any>(endpoint: string, retryConfig?: Partial<RetryConfig>) =>
      apiRequest<T>(endpoint, { method: "GET" }, retryConfig),

    post: <T = any>(
      endpoint: string,
      data: any,
      retryConfig?: Partial<RetryConfig>
    ) =>
      apiRequest<T>(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        retryConfig
      ),

    put: <T = any>(
      endpoint: string,
      data: any,
      retryConfig?: Partial<RetryConfig>
    ) =>
      apiRequest<T>(
        endpoint,
        {
          method: "PUT",
          body: JSON.stringify(data),
        },
        retryConfig
      ),

    patch: <T = any>(
      endpoint: string,
      data: any,
      retryConfig?: Partial<RetryConfig>
    ) =>
      apiRequest<T>(
        endpoint,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        retryConfig
      ),

    delete: <T = any>(endpoint: string, retryConfig?: Partial<RetryConfig>) =>
      apiRequest<T>(endpoint, { method: "DELETE" }, retryConfig),
  };
}

export const apiClient = createApiClient();
