// Prisma configuration for Migrate and tooling
// Move connection URLs out of schema.prisma into this file per Prisma v7+.
// See: https://pris.ly/d/config-datasource

export default {
  datasources: {
    db: {
      // For local development and migrations, set `DATABASE_URL` in your environment
      // Example: export DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
      url: process.env.DATABASE_URL,
      // If you use a direct connection URL for runtime operations, set DIRECT_URL
      directUrl: process.env.DIRECT_URL,
    },
  },
};

// Note: For production or Prisma Accelerate, you can instead configure the
// `accelerateUrl` when instantiating PrismaClient in your app (see lib/prisma.js).
