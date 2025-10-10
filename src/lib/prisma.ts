import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Only log errors, disable query logging to improve performance
    log: ["error"],
    // Optimize connection pooling and performance
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Enhanced error handling and connection management
    errorFormat: "pretty",
    // Connection timeout settings
    ...(process.env.NODE_ENV === "production" && {
      log: ["error"],
    }),
  });

// Connection error handling is managed by Prisma internally

// Graceful shutdown handling
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} else {
  // In production, handle graceful shutdown
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
