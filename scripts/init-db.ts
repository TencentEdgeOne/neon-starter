import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('Error: DATABASE_URL is not set in .env file');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function initDb() {
  console.log('Initializing database...');

  // Create users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  console.log('✓ users table created');

  // Create page_visits table
  await sql`
    CREATE TABLE IF NOT EXISTS page_visits (
      id SERIAL PRIMARY KEY,
      page VARCHAR(100) NOT NULL DEFAULT 'home',
      count INTEGER NOT NULL DEFAULT 0,
      last_visit TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  console.log('✓ page_visits table created');

  // Create index
  await sql`CREATE INDEX IF NOT EXISTS idx_page_visits_page ON page_visits(page)`;
  console.log('✓ index created');

  console.log('\nDatabase initialized successfully!');
}

initDb().catch(console.error);
