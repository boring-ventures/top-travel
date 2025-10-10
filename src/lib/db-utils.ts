/**
 * Enhanced database connection utilities with retry logic and error handling
 */

import prisma from "@/lib/prisma";

interface RetryConfig {
  retries: number;
  delay: number;
}

const defaultRetryConfig: RetryConfig = {
  retries: 3,
  delay: 1000, // 1 second
};

/**
 * Enhanced Prisma operation wrapper with retry logic for connection errors
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const { retries, delay } = { ...defaultRetryConfig, ...config };
  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Check if it's a connection-related error that should be retried
      const isConnectionError =
        error.message?.includes("Connection closed") ||
        error.message?.includes("ECONNRESET") ||
        error.message?.includes("ETIMEDOUT") ||
        error.message?.includes("P1001") || // Prisma connection error
        error.message?.includes("P1008") || // Prisma operation timeout
        error.code === "P1001" ||
        error.code === "P1008";

      // Don't retry if it's not a connection error or if it's the last attempt
      if (!isConnectionError || attempt === retries) {
        break;
      }

      // Wait before retrying with exponential backoff
      const retryDelay = delay * Math.pow(2, attempt);
      console.warn(
        `Database operation failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${retryDelay}ms:`,
        error.message
      );

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  // If all retries failed, throw the last error
  throw lastError;
}

/**
 * Enhanced Prisma client wrapper with automatic retry for connection errors
 */
export const db = {
  // Wrap all Prisma operations with retry logic
  async findUnique<T>(model: any, args: any): Promise<T | null> {
    return withRetry(() => model.findUnique(args));
  },

  async findMany<T>(model: any, args: any = {}): Promise<T[]> {
    return withRetry(() => model.findMany(args));
  },

  async create<T>(model: any, args: any): Promise<T> {
    return withRetry(() => model.create(args));
  },

  async update<T>(model: any, args: any): Promise<T> {
    return withRetry(() => model.update(args));
  },

  async delete<T>(model: any, args: any): Promise<T> {
    return withRetry(() => model.delete(args));
  },

  async upsert<T>(model: any, args: any): Promise<T> {
    return withRetry(() => model.upsert(args));
  },

  async count(model: any, args: any = {}): Promise<number> {
    return withRetry(() => model.count(args));
  },

  // Transaction wrapper with retry logic
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return withRetry(() => prisma.$transaction(fn));
  },

  // Raw query wrapper with retry logic
  async raw<T = any>(query: string, ...params: any[]): Promise<T> {
    return withRetry(() => prisma.$queryRawUnsafe(query, ...params));
  },
};

/**
 * Connection health check utility
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await withRetry(
      async () => {
        await prisma.$queryRaw`SELECT 1`;
      },
      { retries: 1, delay: 500 }
    );
    return true;
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
}

/**
 * Graceful database disconnection
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log("Database disconnected gracefully");
  } catch (error) {
    console.error("Error disconnecting from database:", error);
  }
}

/**
 * Enhanced error handler for database operations
 */
export function handleDatabaseError(
  error: any,
  operation: string = "Unknown"
): string {
  console.error(`Database error in ${operation}:`, error);

  // Prisma-specific error codes
  if (error.code) {
    switch (error.code) {
      case "P1001":
        return "No se puede conectar a la base de datos. Verifica tu conexión e intenta nuevamente.";
      case "P1008":
        return "La operación tardó demasiado. Por favor, intenta nuevamente.";
      case "P2002":
        return "Ya existe un registro con estos datos.";
      case "P2025":
        return "El registro solicitado no existe.";
      default:
        return `Error de base de datos (${error.code}). Por favor, intenta nuevamente.`;
    }
  }

  // Connection-related errors
  if (error.message?.includes("Connection closed")) {
    return "La conexión a la base de datos se cerró. Por favor, intenta nuevamente.";
  }

  if (error.message?.includes("ECONNRESET")) {
    return "La conexión fue interrumpida. Por favor, intenta nuevamente.";
  }

  if (error.message?.includes("ETIMEDOUT")) {
    return "La operación tardó demasiado. Por favor, verifica tu conexión e intenta nuevamente.";
  }

  return "Ocurrió un error inesperado con la base de datos. Por favor, intenta nuevamente.";
}

