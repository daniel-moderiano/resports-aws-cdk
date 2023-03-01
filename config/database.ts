import "dotenv/config";
import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  DATABASE_USER: str(),
  DATABASE_PASSWORD: str(),
  DATABASE_NAME: str(),
  DATABASE_HOST: str(),
});

export const databaseConfig = {
  DATABASE_USER: env.DATABASE_USER,
  DATABASE_PASSWORD: env.DATABASE_PASSWORD,
  DATABASE_NAME: env.DATABASE_NAME,
  DATABASE_HOST: env.DATABASE_HOST,
};
