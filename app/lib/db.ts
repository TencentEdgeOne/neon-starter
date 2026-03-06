import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

/**
 * Database client for Next.js App Router
 * Uses Neon serverless driver for optimal serverless performance
 */

const databaseUrl = process.env.DATABASE_URL;

// Database URL is optional - features work without it for demo purposes

// Create Neon SQL client (only if URL is available)
const sql = databaseUrl ? neon(databaseUrl) : null;

// Create Drizzle ORM instance
export const db = sql ? drizzle(sql as any, { schema }) : null;

// Export schema for type inference
export { schema };
