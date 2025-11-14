import 'dotenv/config';

/** @type {import('drizzle-kit').Config} */
export default {
  schema: './utils/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DRIZZLE_DATABASE_URL ||
      'postgresql://neondb_owner:npg_tNw9vdPu5MeK@ep-broad-brook-adui0jfd-pooler.c-2.us-east-1.aws.neon.tech/AI-Content-Generator?sslmode=require&channel_binding=require',
  },
};