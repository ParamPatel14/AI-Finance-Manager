import { PrismaClient } from "@prisma/client";

// Build PrismaClient options based on environment.
const clientOptions = {};

// Support Prisma Accelerate via PRISMA_ACCELERATE_URL
if (process.env.PRISMA_ACCELERATE_URL) {
  clientOptions.accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
}

// Optionally load a runtime adapter module specified by PRISMA_ADAPTER
// Example: PRISMA_ADAPTER="@prisma/adapter-node"
if (process.env.PRISMA_ADAPTER) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    clientOptions.adapter = require(process.env.PRISMA_ADAPTER);
  } catch (e) {
    console.warn("Failed to load PRISMA_ADAPTER:", e && e.message ? e.message : e);
  }
}

export const db = globalThis.prisma || new PrismaClient(clientOptions);

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}


