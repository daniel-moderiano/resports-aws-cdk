import "dotenv/config";

import { cleanEnv, str } from "envalid";
import { Pool } from "pg";

export const env = cleanEnv(process.env, {
  DATABASE_USER: str(),
  DATABASE_PASSWORD: str(),
  DATABASE_NAME: str(),
  DATABASE_HOST: str(),
  AWS_ACCOUNT: str(),
  AWS_REGION: str(),
});

// Uses an in-memory Postgres database for testing
export const testPool = new Pool({
  // DATABASE_URL will be automatically set during test setup by @databases/pg-test
  connectionString: process.env.DATABASE_URL,
});
