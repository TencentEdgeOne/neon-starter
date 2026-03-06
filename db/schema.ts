import { pgTable, serial, text, boolean, timestamp, integer, varchar } from 'drizzle-orm/pg-core';

/**
 * Users table schema
 * Stores user credentials and profile information
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

/**
 * Password reset tokens table
 * Stores tokens for password recovery
 */
export const passwordReset = pgTable('password_reset', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  used: boolean('used').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type PasswordReset = typeof passwordReset.$inferSelect;

/**
 * Page visits tracking table
 * Tracks page view statistics
 */
export const pageVisits = pgTable('page_visits', {
  id: serial('id').primaryKey(),
  page: varchar('page', { length: 100 }).notNull().default('home'),
  count: integer('count').notNull().default(0),
  lastVisit: timestamp('last_visit').notNull().defaultNow(),
});

export type PageVisit = typeof pageVisits.$inferSelect;
