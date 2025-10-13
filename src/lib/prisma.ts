// -------------------------------------------
// Purpose: Ensures only ONE PrismaClient instance exists
// during hot-reload (important for Next.js App Router).
// -------------------------------------------

import { PrismaClient } from "@prisma/client";

// Use globalThis to persist PrismaClient in dev mode (prevents duplicate DB connections)
export const prisma = (globalThis as any).prisma || new PrismaClient();

// Store singleton on globalThis in dev; skip in production for performance/safety
if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = prisma;