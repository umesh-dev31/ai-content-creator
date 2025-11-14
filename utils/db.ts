import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl =
  process.env.DRIZZLE_DATABASE_URL || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;

if (!databaseUrl) {
  throw new Error('DRIZZLE_DATABASE_URL is not set');
}

const sql = neon(databaseUrl);

const db = drizzle(sql, { schema });

export default db;