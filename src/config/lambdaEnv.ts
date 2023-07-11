import "dotenv/config";
import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  MONGO_URI: str(),
  AUTH0_DOMAIN: str(),
  AUTH0_CLIENT_ID: str(),
  AUTH0_CLIENT_SECRET: str(),
});

export const lambdaEnv = {
  MONGO_URI: env.MONGO_URI,
  AUTH0_DOMAIN: env.AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: env.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: env.AUTH0_CLIENT_SECRET,
};
