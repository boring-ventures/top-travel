/**
 * Enhanced React Query configuration with robust error handling and retry logic
 */

import { QueryClient } from "@tanstack/react-query";

// Enhanced retry function for connection errors
const retryFunction = (failureCount: number, error: any) => {
  // Don't retry if it's a client error (4xx)
  if (error?.status >= 400 && error?.status < 500) {
    return false;
  }

  // Retry up to 3 times for connection errors
  if (failureCount < 3) {
    // Check if it's a connection-related error
    const isConnectionError =
      error?.message?.includes("Connection closed") ||
      error?.message?.includes("ECONNRESET") ||
      error?.message?.includes("ETIMEDOUT") ||
      error?.message?.includes("fetch failed") ||
      error?.name === "AbortError" ||
      (error as any)?.status >= 500;

    return isConnectionError;
  }

  return false;
};

// Enhanced error handling
const errorHandler = (error: any) => {
  console.error("React Query error:", error);

  // Log specific connection errors for debugging
  if (error?.message?.includes("Connection closed")) {
    console.error(
      "Connection closed error detected - this may indicate database connection issues"
    );
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Enhanced retry configuration
      retry: retryFunction,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff, max 30s

      // Stale time and cache configuration
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Network behavior
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations for connection errors
      retry: (failureCount, error) => {
        if (failureCount < 2) {
          const isConnectionError =
            error?.message?.includes("Connection closed") ||
            error?.message?.includes("ECONNRESET") ||
            error?.message?.includes("ETIMEDOUT") ||
            error?.message?.includes("fetch failed") ||
            error?.name === "AbortError" ||
            (error as any)?.status >= 500;

          return isConnectionError;
        }
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Max 10s for mutations
    },
  },
});

// Utility function to handle connection errors globally
export const handleConnectionError = (
  error: any,
  context: string = "Unknown"
) => {
  console.error(`Connection error in ${context}:`, error);

  // You can add additional error reporting here
  // For example, send to error tracking service

  // Return a user-friendly error message
  if (error?.message?.includes("Connection closed")) {
    return "Error de conexión. Por favor, intenta nuevamente.";
  }

  if (error?.message?.includes("ETIMEDOUT")) {
    return "La solicitud tardó demasiado. Por favor, verifica tu conexión e intenta nuevamente.";
  }

  if (error?.name === "AbortError") {
    return "La solicitud fue cancelada. Por favor, intenta nuevamente.";
  }

  return "Ocurrió un error inesperado. Por favor, intenta nuevamente.";
};

// Enhanced query options for common use cases
export const createQueryOptions = {
  // For data that changes frequently
  dynamic: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  },

  // For relatively stable data
  stable: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },

  // For static data
  static: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  },

  // For user-specific data
  user: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: true,
  },
};
