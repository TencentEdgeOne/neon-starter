import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { db, schema } from './db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const SESSION_PASSWORD = process.env.SESSION_SECRET || 'change-this-to-a-secure-secret-key-at-least-32-chars';
const SESSION_COOKIE_NAME = 'auth-session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionData {
  userId?: number;
  email?: string;
  name?: string;
}

/**
 * Get the current session
 */
export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), {
    cookieName: SESSION_COOKIE_NAME,
    password: SESSION_PASSWORD,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    },
  });
  return session;
}

/**
 * Create a session for a user after login
 */
export async function createSession(userId: number, email: string, name?: string) {
  const session = await getSession();
  session.userId = userId;
  session.email = email;
  session.name = name;
  await session.save();
}

/**
 * Destroy session on logout
 */
export async function destroySession() {
  const session = await getSession();
  session.destroy();
}

/**
 * Get current logged in user (if any)
 */
export async function getCurrentUser(): Promise<schema.User | null> {
  const session = await getSession();
  if (!session.userId || !db) return null;

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.userId))
    .limit(1);

  return user || null;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


