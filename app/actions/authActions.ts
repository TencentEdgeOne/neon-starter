'use server';

import { db, schema } from '../lib/db';
import { createSession, destroySession, hashPassword, verifyPassword, isValidEmail } from '../lib/auth';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function register(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email')?.toString().toLowerCase().trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  if (!isValidEmail(email)) {
    return { success: false, error: 'Invalid email format' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  if (!db) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: 'Email already registered' };
    }

    const passwordHash = await hashPassword(password);

    const [newUser] = await db
      .insert(schema.users)
      .values({
        email,
        passwordHash,
      })
      .returning();

    await createSession(newUser.id, newUser.email);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to register' };
  }
}

export async function login(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email')?.toString().toLowerCase().trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  if (!db) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    await createSession(user.id, user.email);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to login' };
  }
}

export async function logout() {
  await destroySession();
  redirect('/');
}
