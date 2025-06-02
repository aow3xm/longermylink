import 'dotenv/config';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
config({ path: '.env.local' });

let pool: Pool | null = null;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} catch (error) {
  console.error(error);
}

if (!pool) {
  throw new Error('Failed to connect to the database');
}

export const db = drizzle({ client: pool, schema});
